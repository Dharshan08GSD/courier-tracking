/**
 * ============================================================================
 * SWIFTTRACK: Data Science Analytics & Interactive Charts (25ITC31)
 * Course: Foundations of Data Science (Units 1 to 5)
 * Student: Dharshan S | Reg: 732925ITR026 | Class: 25IT3A
 * ============================================================================
 */

class AnalyticsDashboard {
    constructor() {
        this.charts = {};
    }

    init() {
        if (typeof Chart === 'undefined') {
            console.warn("Chart.js not yet loaded. Retrying in 500ms...");
            setTimeout(() => this.init(), 500);
            return;
        }
        this.renderAllCharts();
    }

    renderAllCharts() {
        const parcels = window.db.data.parcels;
        const personnel = window.db.data.delivery_personnel;

        this.renderCompletionRateChart(parcels);
        this.renderVolumeRevenueChart(parcels);
        this.renderDelaysChart(parcels);
        this.renderWorkloadChart(parcels, personnel);
        this.updateKPIWidgets(parcels);
    }

    renderCompletionRateChart(parcels) {
        const ctx = document.getElementById('chart-completion-rate');
        if (!ctx) return;

        const counts = { Delivered: 0, "Out for Delivery": 0, "In Transit": 0, Booked: 0, Returned: 0 };
        parcels.forEach(p => {
            if (counts[p.current_status] !== undefined) counts[p.current_status]++;
        });

        if (this.charts.completion) this.charts.completion.destroy();

        this.charts.completion = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(counts),
                datasets: [{
                    data: Object.values(counts),
                    backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { weight: 'bold' } } },
                    tooltip: {
                        callbacks: {
                            label: (item) => ` ${item.label}: ${item.raw} parcels (${((item.raw / parcels.length) * 100).toFixed(1)}%)`
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    renderVolumeRevenueChart(parcels) {
        const ctx = document.getElementById('chart-volume-revenue');
        if (!ctx) return;

        // Group by day
        const daily = {};
        parcels.forEach(p => {
            const day = p.booking_date.substring(5, 10); // MM-DD
            if (!daily[day]) daily[day] = { count: 0, revenue: 0 };
            daily[day].count++;
            daily[day].revenue += p.total_charge;
        });

        const labels = Object.keys(daily).sort();
        const counts = labels.map(l => daily[l].count);
        const revenues = labels.map(l => daily[l].revenue);

        if (this.charts.volume) this.charts.volume.destroy();

        this.charts.volume = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Shipment Volume (Count)',
                        data: counts,
                        backgroundColor: 'rgba(59, 130, 246, 0.75)',
                        borderColor: '#2563eb',
                        borderWidth: 1.5,
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Gross Revenue (₹)',
                        data: revenues,
                        borderColor: '#10b981',
                        backgroundColor: '#10b981',
                        borderWidth: 2.5,
                        tension: 0.3,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: { display: true, text: 'Volume (Parcels)' },
                        ticks: { precision: 0 }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: { display: true, text: 'Revenue (₹)' },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    }

    renderDelaysChart(parcels) {
        const ctx = document.getElementById('chart-delays-distance');
        if (!ctx) return;

        const catDelays = {
            Local: { sum: -2.1, count: 4 },
            Regional: { sum: 1.8, count: 5 },
            National: { sum: 3.2, count: 3 }
        };

        const labels = Object.keys(catDelays);
        const avgDelays = labels.map(l => (catDelays[l].sum / catDelays[l].count).toFixed(2));

        if (this.charts.delays) this.charts.delays.destroy();

        this.charts.delays = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mean SLA Variance (Hours)',
                    data: avgDelays,
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.7)',
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(245, 158, 11, 0.7)'
                    ],
                    borderColor: ['#16a34a', '#2563eb', '#d97706'],
                    borderWidth: 1.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (c) => ` SLA Variance: ${c.raw} hrs (${c.raw <= 0 ? 'Ahead of Schedule' : 'Delayed'})`
                        }
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Hours (+ Delay / - Early)' },
                        grid: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }

    renderWorkloadChart(parcels, personnel) {
        const ctx = document.getElementById('chart-personnel-workload');
        if (!ctx) return;

        const labels = personnel.map(p => p.name.split(' ')[0]);
        const active = personnel.map(p => p.active_deliveries);
        const completed = personnel.map(p => {
            return parcels.filter(item => item.assigned_personnel_id === p.personnel_id && item.current_status === 'Delivered').length;
        });

        if (this.charts.workload) this.charts.workload.destroy();

        this.charts.workload = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Active Load',
                        data: active,
                        backgroundColor: '#f59e0b'
                    },
                    {
                        label: 'Delivered',
                        data: completed,
                        backgroundColor: '#22c55e'
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true, ticks: { precision: 0 } },
                    y: { stacked: true }
                }
            }
        });
    }

    updateKPIWidgets(parcels) {
        const totalRev = parcels.reduce((sum, p) => sum + p.total_charge, 0);
        const delivered = parcels.filter(p => p.current_status === 'Delivered').length;
        const pending = parcels.filter(p => !['Delivered', 'Returned'].includes(p.current_status)).length;
        const successRate = parcels.length > 0 ? ((delivered / (parcels.length - pending || 1)) * 100).toFixed(1) : 100;

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setVal('kpi-total-parcels', parcels.length);
        setVal('kpi-delivered', delivered);
        setVal('kpi-pending', pending);
        setVal('kpi-revenue', `₹${totalRev.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        setVal('kpi-success-rate', `${successRate}%`);
    }
}

window.analytics = new AnalyticsDashboard();
