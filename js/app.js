/**
 * ============================================================================
 * SWIFTTRACK: Main Application Controller & UI Orchestration
 * Student: Dharshan S | Reg: 732925ITR026 | Class: 25IT3A
 * Velalar College of Engineering and Technology, Erode - 12
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTrackingSearch();
    initParcelsTable();
    initBookingModal();
    initModals();
    initSEUnitTabs();
    initSQLRunnerUI();
    initJavaSimulator();

    // Default to initial parcel tracking demo
    searchTrackingNumber("TRK-2026-8805");

    // Initialize charts
    if (window.analytics) window.analytics.init();
});

/* ============================================================================
   1. NAVIGATION ROUTER
   ============================================================================ */
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Refresh charts if opening Data Science or Home tab
                if (targetId === 'tab-datascience' || targetId === 'tab-tracker') {
                    if (window.analytics) window.analytics.renderAllCharts();
                }
            }
        });
    });
}

/* ============================================================================
   2. TRACKING SEARCH & TIMELINE VISUALIZER
   ============================================================================ */
function initTrackingSearch() {
    const searchBtn = document.getElementById('btn-track-search');
    const input = document.getElementById('input-tracking-no');

    const handleSearch = () => {
        const query = (input.value || "").trim().toUpperCase();
        if (!query) {
            alert("Please enter a consignment tracking number (e.g. TRK-2026-8801).");
            return;
        }
        searchTrackingNumber(query);
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
}

function searchTrackingNumber(trackingNo) {
    const parcel = window.db.data.parcels.find(p => p.tracking_number.toUpperCase() === trackingNo);
    const container = document.getElementById('tracking-result-container');
    if (!container) return;

    if (!parcel) {
        container.innerHTML = `
            <div class="card" style="border-left: 4px solid var(--accent-rose); background: #fff5f5;">
                <h3 style="color: #991b1b; font-weight: 700;">Consignment Not Found</h3>
                <p style="color: #7f1d1d; margin-top: 0.35rem; font-size: 0.88rem;">
                    No package matching <strong>"${trackingNo}"</strong> was found in the database. 
                    Please ensure the tracking number follows format <code>TRK-YYYY-XXXX</code>.
                </p>
            </div>
        `;
        return;
    }

    const history = window.db.data.tracking_history
        .filter(h => h.tracking_number.toUpperCase() === trackingNo)
        .sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));

    const attempts = window.db.data.delivery_attempts
        .filter(a => a.tracking_number.toUpperCase() === trackingNo);

    // Build timeline step states
    const statusOrder = ["Booked", "In Transit", "Out for Delivery", "Delivered"];
    const currentIdx = statusOrder.indexOf(parcel.current_status);
    const isReturned = parcel.current_status === "Returned";

    let stepsHtml = "";
    statusOrder.forEach((step, idx) => {
        let stepClass = "";
        let checkIcon = idx + 1;

        if (isReturned && idx >= 2) {
            stepClass = "failed";
        } else if (idx < currentIdx || parcel.current_status === "Delivered") {
            stepClass = "completed";
            checkIcon = "✓";
        } else if (idx === currentIdx) {
            stepClass = "active";
            checkIcon = "●";
        }

        const histMatch = history.find(h => h.status === step);
        const timeStr = histMatch ? histMatch.timestamp.substring(5) : "--";

        stepsHtml += `
            <div class="timeline-step ${stepClass}">
                <div class="step-circle">${checkIcon}</div>
                <div class="step-label">${step}</div>
                <div class="step-time">${timeStr}</div>
            </div>
        `;
    });

    // Attempts HTML if any
    let attemptsHtml = "";
    if (attempts.length > 0) {
        attemptsHtml = `
            <div style="margin-top: 1.5rem; padding: 1rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-sm);">
                <h4 style="color: #92400e; font-size: 0.88rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
                    ⚠️ Recorded Delivery Attempt(s)
                </h4>
                <ul style="margin-top: 0.5rem; padding-left: 1.25rem; font-size: 0.82rem; color: #78350f;">
                    ${attempts.map(a => `
                        <li><strong>${a.attempt_date}:</strong> Unsuccessful (${a.failure_reason}) — <em>${a.remarks}</em>. Rescheduled: ${a.rescheduled_date || 'Next cycle'}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="tracking-result-box">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <div>
                    <span class="badge ${getStatusBadgeClass(parcel.current_status)}" style="font-size: 0.85rem; padding: 0.3rem 0.8rem;">
                        ${parcel.current_status.toUpperCase()}
                    </span>
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--secondary); margin-top: 0.5rem;">
                        ${parcel.tracking_number}
                    </h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                        ${parcel.parcel_type} Consignment • ${parcel.weight_kg.toFixed(2)} kg • ${parcel.service_type} (${parcel.distance_category})
                    </p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Estimated Delivery</div>
                    <div style="font-size: 1.1rem; font-weight: 800; color: var(--secondary);">${parcel.estimated_delivery}</div>
                    <div style="font-size: 0.85rem; color: var(--accent); font-weight: 700;">Freight: ₹${parcel.total_charge.toFixed(2)}</div>
                </div>
            </div>

            <!-- Visual Progress Timeline -->
            <div class="timeline">
                <div class="timeline-steps">
                    ${stepsHtml}
                </div>
            </div>

            ${attemptsHtml}

            <!-- Details Grid -->
            <div class="grid-3" style="margin-top: 1.5rem;">
                <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Origin (Sender)</div>
                    <div style="font-weight: 700; color: var(--secondary); margin-top: 0.2rem;">${parcel.sender_name}</div>
                    <div style="font-size: 0.82rem; color: var(--text-muted);">${parcel.booking_date}</div>
                </div>
                <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Destination (Consignee)</div>
                    <div style="font-weight: 700; color: var(--secondary); margin-top: 0.2rem;">${parcel.receiver_name}</div>
                    <div style="font-size: 0.82rem; color: var(--text-muted);">${parcel.receiver_address}, ${parcel.destination_city}</div>
                </div>
                <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Courier Field Agent</div>
                    <div style="font-weight: 700; color: var(--secondary); margin-top: 0.2rem;">${parcel.assigned_personnel_name || 'Pending Allocation'}</div>
                    <div style="font-size: 0.82rem; color: var(--text-muted);">Contact via VCET Central Dispatch</div>
                </div>
            </div>

            <!-- Checkpoint History -->
            <div style="margin-top: 1.5rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.75rem;">
                    Chronological Transit Audit Trail (DBMS 25ITT31 Unit 1)
                </h4>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Checkpoint Location</th>
                                <th>Status Event</th>
                                <th>Operational Notes</th>
                                <th>Updated By</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.map(h => `
                                <tr>
                                    <td style="font-weight: 600;">${h.timestamp}</td>
                                    <td>${h.location}</td>
                                    <td><span class="badge ${getStatusBadgeClass(h.status)}">${h.status}</span></td>
                                    <td>${h.notes}</td>
                                    <td><code>${h.updated_by}</code></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'Delivered': return 'badge-success';
        case 'Out for Delivery': return 'badge-warning';
        case 'In Transit': return 'badge-info';
        case 'Returned': return 'badge-danger';
        default: return 'badge-purple';
    }
}

/* ============================================================================
   3. PARCELS TABLE & DISPATCHER ACTIONS
   ============================================================================ */
function initParcelsTable() {
    renderParcelsTable();

    const filterStatus = document.getElementById('select-filter-status');
    const searchInput = document.getElementById('input-filter-parcels');

    if (filterStatus) {
        filterStatus.addEventListener('change', () => renderParcelsTable());
    }
    if (searchInput) {
        searchInput.addEventListener('input', () => renderParcelsTable());
    }
}

function renderParcelsTable() {
    const tbody = document.getElementById('parcels-table-body');
    if (!tbody) return;

    const filterStatus = document.getElementById('select-filter-status')?.value || 'ALL';
    const searchQuery = (document.getElementById('input-filter-parcels')?.value || '').toLowerCase();

    let parcels = window.db.data.parcels;

    if (filterStatus !== 'ALL') {
        parcels = parcels.filter(p => p.current_status === filterStatus);
    }

    if (searchQuery) {
        parcels = parcels.filter(p => 
            p.tracking_number.toLowerCase().includes(searchQuery) ||
            p.receiver_name.toLowerCase().includes(searchQuery) ||
            p.destination_city.toLowerCase().includes(searchQuery)
        );
    }

    if (parcels.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No parcels found matching your criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = parcels.map(p => `
        <tr>
            <td>
                <a href="javascript:void(0)" onclick="inspectTracking('${p.tracking_number}')" style="font-weight: 700; color: var(--primary); text-decoration: none;">
                    ${p.tracking_number}
                </a>
            </td>
            <td>
                <div style="font-weight: 600;">${p.receiver_name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${p.destination_city}</div>
            </td>
            <td>
                <div>${p.service_type}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${p.distance_category}</div>
            </td>
            <td>${p.weight_kg.toFixed(2)} kg</td>
            <td style="font-weight: 700;">₹${p.total_charge.toFixed(2)}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(p.current_status)}">${p.current_status}</span>
            </td>
            <td>
                <div style="font-size: 0.82rem; font-weight: 600;">${p.assigned_personnel_name}</div>
            </td>
            <td>
                <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-outline btn-sm" onclick="openUpdateStatusModal('${p.tracking_number}')" title="Advance Status">
                        ⚡ Status
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="openAssignModal('${p.tracking_number}')" title="Assign Courier Agent">
                        👤 Agent
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="openAttemptModal('${p.tracking_number}')" title="Log Attempt">
                        📝 Attempt
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

window.inspectTracking = (trk) => {
    const input = document.getElementById('input-tracking-no');
    if (input) input.value = trk;
    searchTrackingNumber(trk);
    window.scrollTo({ top: 300, behavior: 'smooth' });
};

/* ============================================================================
   4. NEW PARCEL BOOKING & DYNAMIC TARIFF CALCULATOR
   ============================================================================ */
function initBookingModal() {
    const modal = document.getElementById('modal-book-parcel');
    const openBtn = document.getElementById('btn-open-book-modal');
    const closeBtn = document.getElementById('btn-close-book-modal');
    const form = document.getElementById('form-book-parcel');

    if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    // Dynamic price calculation
    const weightInput = document.getElementById('book-weight');
    const distSelect = document.getElementById('book-distance');
    const servSelect = document.getElementById('book-service');

    const updatePricePreview = () => {
        const weight = parseFloat(weightInput?.value) || 1.0;
        const dist = distSelect?.value || 'Local';
        const serv = servSelect?.value || 'Standard';

        const pricing = window.db.calculateCharges(weight, dist, serv);
        const previewEl = document.getElementById('booking-price-preview');
        if (previewEl) {
            previewEl.innerHTML = `
                Base: ₹${pricing.base.toFixed(2)} | GST (18%): ₹${pricing.tax.toFixed(2)} | 
                <strong style="color: var(--accent); font-size: 1.1rem;">Total: ₹${pricing.total.toFixed(2)}</strong>
            `;
        }
    };

    if (weightInput) weightInput.addEventListener('input', updatePricePreview);
    if (distSelect) distSelect.addEventListener('change', updatePricePreview);
    if (servSelect) servSelect.addEventListener('change', updatePricePreview);

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                sender_id: 10,
                sender_name: "Dharshan S (732925ITR026)",
                receiver_name: document.getElementById('book-receiver-name').value,
                receiver_phone: document.getElementById('book-receiver-phone').value,
                receiver_address: document.getElementById('book-receiver-address').value,
                destination_city: document.getElementById('book-dest-city').value,
                parcel_type: document.getElementById('book-type').value,
                weight_kg: document.getElementById('book-weight').value,
                distance_category: document.getElementById('book-distance').value,
                service_type: document.getElementById('book-service').value
            };

            const newParcel = window.db.bookParcel(formData);
            modal.classList.remove('active');
            form.reset();

            renderParcelsTable();
            if (window.analytics) window.analytics.renderAllCharts();
            searchTrackingNumber(newParcel.tracking_number);

            alert(`✅ Consignment successfully registered!\nTracking Number: ${newParcel.tracking_number}\nAmount Paid: ₹${newParcel.total_charge.toFixed(2)}`);
        });
    }
}

/* ============================================================================
   5. OPERATIONAL MODALS (STATUS, AGENT ASSIGNMENT, ATTEMPT)
   ============================================================================ */
function initModals() {
    // Status Modal
    const statusModal = document.getElementById('modal-update-status');
    const statusForm = document.getElementById('form-update-status');
    if (statusForm) {
        statusForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const trk = document.getElementById('update-status-tracking').value;
            const newStatus = document.getElementById('update-new-status').value;
            const loc = document.getElementById('update-location').value;
            const notes = document.getElementById('update-notes').value;

            window.db.updateStatus(trk, newStatus, loc, notes);
            statusModal.classList.remove('active');
            renderParcelsTable();
            searchTrackingNumber(trk);
            if (window.analytics) window.analytics.renderAllCharts();
        });
    }

    // Assign Agent Modal
    const assignModal = document.getElementById('modal-assign-agent');
    const assignForm = document.getElementById('form-assign-agent');
    if (assignForm) {
        assignForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const trk = document.getElementById('assign-tracking').value;
            const agentId = document.getElementById('assign-agent-id').value;

            window.db.assignPersonnel(trk, agentId);
            assignModal.classList.remove('active');
            renderParcelsTable();
            searchTrackingNumber(trk);
            if (window.analytics) window.analytics.renderAllCharts();
        });
    }

    // Delivery Attempt Modal
    const attemptModal = document.getElementById('modal-log-attempt');
    const attemptForm = document.getElementById('form-log-attempt');
    if (attemptForm) {
        attemptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const trk = document.getElementById('attempt-tracking').value;
            const reason = document.getElementById('attempt-reason').value;
            const remarks = document.getElementById('attempt-remarks').value;
            const resched = document.getElementById('attempt-reschedule-date').value;

            window.db.logAttempt(trk, reason, remarks, resched);
            attemptModal.classList.remove('active');
            renderParcelsTable();
            searchTrackingNumber(trk);
            if (window.analytics) window.analytics.renderAllCharts();
        });
    }

    // Generic Close Buttons
    document.querySelectorAll('.modal-close-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        });
    });
}

window.openUpdateStatusModal = (trackingNo) => {
    document.getElementById('update-status-tracking').value = trackingNo;
    document.getElementById('modal-update-status').classList.add('active');
};

window.openAssignModal = (trackingNo) => {
    document.getElementById('assign-tracking').value = trackingNo;
    const select = document.getElementById('assign-agent-id');
    if (select) {
        select.innerHTML = window.db.data.delivery_personnel.map(a => `
            <option value="${a.personnel_id}">${a.name} (${a.vehicle_type} - ${a.assigned_zone}) | Active Load: ${a.active_deliveries}</option>
        `).join('');
    }
    document.getElementById('modal-assign-agent').classList.add('active');
};

window.openAttemptModal = (trackingNo) => {
    document.getElementById('attempt-tracking').value = trackingNo;
    document.getElementById('modal-log-attempt').classList.add('active');
};

/* ============================================================================
   6. SOFTWARE ENGINEERING (25ITT33) UNIT TABS
   ============================================================================ */
function initSEUnitTabs() {
    const btns = document.querySelectorAll('.unit-btn');
    const unitPanes = document.querySelectorAll('.unit-content');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const unit = btn.getAttribute('data-unit');
            btns.forEach(b => b.classList.remove('active'));
            unitPanes.forEach(p => p.style.display = 'none');

            btn.classList.add('active');
            const target = document.getElementById(`se-unit-${unit}`);
            if (target) target.style.display = 'block';
        });
    });
}

/* ============================================================================
   7. INTERACTIVE SQL TERMINAL RUNNER (25ITT31)
   ============================================================================ */
function initSQLRunnerUI() {
    const select = document.getElementById('select-sql-preset');
    const runBtn = document.getElementById('btn-run-sql');
    const codeArea = document.getElementById('sql-editor');
    const outputArea = document.getElementById('sql-terminal-output');

    if (select && codeArea) {
        select.addEventListener('change', () => {
            const preset = window.sqlRunner.sampleQueries[select.value];
            if (preset) {
                codeArea.value = preset.sql;
            }
        });
    }

    if (runBtn && outputArea) {
        runBtn.addEventListener('click', () => {
            const key = select?.value;
            const custom = codeArea?.value;
            const res = window.sqlRunner.execute(key, custom);
            outputArea.textContent = res.ascii;
        });
    }
}

/* ============================================================================
   8. JAVA MULTITHREADED DISPATCH SIMULATOR (25ITT32)
   ============================================================================ */
function initJavaSimulator() {
    const runBtn = document.getElementById('btn-run-java-sim');
    const consoleOutput = document.getElementById('java-console-output');

    if (runBtn && consoleOutput) {
        runBtn.addEventListener('click', () => {
            consoleOutput.textContent = "[JVM Init] Compiling and starting com.courier.service.MultithreadedDispatchSimulator...\n";
            runBtn.disabled = true;

            const pending = window.db.data.parcels.filter(p => !['Delivered', 'Returned'].includes(p.current_status)).slice(0, 4);
            let logStep = 0;

            const logs = [
                `[SIMULATOR] Spawning ${pending.length} concurrent transit threads with JVM thread priorities...`,
                ...pending.map((p, i) => `  [Thread-Worker-${i+1}] Priority: ${p.service_type === 'Same-Day' ? '10 (MAX)' : p.service_type === 'Express' ? '7 (HIGH)' : '5 (NORM)'} | Processing ${p.tracking_number} -> ${p.destination_city}`),
                `[Thread-Worker-1] Synchronized status update: Status moved to 'In Transit'`,
                `[Thread-Worker-2] Synchronized status update: Checkpoint verified at Regional Logistics Center`,
                `[Thread-Worker-1] Arrived at destination station. Status moved to 'Out for Delivery'`,
                `[SIMULATOR] Concurrent thread execution joined cleanly with zero race conditions (Unit 3).`
            ];

            const interval = setInterval(() => {
                if (logStep < logs.length) {
                    consoleOutput.textContent += logs[logStep] + "\n";
                    logStep++;
                } else {
                    clearInterval(interval);
                    runBtn.disabled = false;
                    consoleOutput.textContent += "\n[JVM Status] Execution finished with exit code 0.\n";
                }
            }, 450);
        });
    }
}
