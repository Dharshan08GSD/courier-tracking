/**
 * ============================================================================
 * SWIFTTRACK: In-Browser Interactive SQL Query Engine
 * Course: 25ITT31 - Database Management Systems (Unit 2 & Unit 3)
 * Student: Dharshan S | Reg: 732925ITR026 | Class: 25IT3A
 * ============================================================================
 */

class SQLRunner {
    constructor() {
        this.sampleQueries = {
            query1: {
                title: "1. Filter High-Value Express / Same-Day Parcels (> 2.0 kg)",
                sql: `SELECT tracking_number, receiver_name, destination_city, weight_kg, service_type, total_charge, current_status
FROM parcels
WHERE service_type IN ('Express', 'Same-Day') AND weight_kg > 2.00
ORDER BY total_charge DESC;`,
                run: (data) => {
                    return data.parcels
                        .filter(p => ['Express', 'Same-Day'].includes(p.service_type) && p.weight_kg > 2.0)
                        .sort((a,b) => b.total_charge - a.total_charge)
                        .map(p => ({
                            "Tracking_No": p.tracking_number,
                            "Consignee": p.receiver_name,
                            "Destination": p.destination_city,
                            "Weight_Kg": p.weight_kg.toFixed(2),
                            "Service": p.service_type,
                            "Charge_INR": p.total_charge.toFixed(2),
                            "Status": p.current_status
                        }));
                }
            },
            query2: {
                title: "2. Inner Join: Parcels with Senders & Assigned Agents",
                sql: `SELECT p.tracking_number, c.name AS sender, p.receiver_name, p.destination_city, p.service_type, dp.name AS agent, p.current_status
FROM parcels p
JOIN customers c ON p.sender_id = c.customer_id
LEFT JOIN delivery_personnel dp ON p.assigned_personnel_id = dp.personnel_id;`,
                run: (data) => {
                    return data.parcels.slice(0, 8).map(p => {
                        const sender = data.customers.find(c => c.customer_id === p.sender_id) || { name: p.sender_name };
                        const agent = data.delivery_personnel.find(a => a.personnel_id === p.assigned_personnel_id);
                        return {
                            "Tracking_No": p.tracking_number,
                            "Sender": sender.name,
                            "Receiver": p.receiver_name,
                            "City": p.destination_city,
                            "Service": p.service_type,
                            "Agent": agent ? agent.name : "Not Assigned",
                            "Status": p.current_status
                        };
                    });
                }
            },
            query3: {
                title: "3. Aggregation & Grouping: Revenue by Distance Category",
                sql: `SELECT distance_category, COUNT(*) AS total_parcels, ROUND(AVG(weight_kg),2) AS avg_weight, ROUND(SUM(total_charge),2) AS total_revenue
FROM parcels
GROUP BY distance_category
HAVING total_revenue > 500.00
ORDER BY total_revenue DESC;`,
                run: (data) => {
                    const groups = {};
                    data.parcels.forEach(p => {
                        if (!groups[p.distance_category]) {
                            groups[p.distance_category] = { count: 0, weightSum: 0, revenue: 0 };
                        }
                        groups[p.distance_category].count++;
                        groups[p.distance_category].weightSum += p.weight_kg;
                        groups[p.distance_category].revenue += p.total_charge;
                    });
                    return Object.keys(groups)
                        .filter(cat => groups[cat].revenue > 500)
                        .sort((a,b) => groups[b].revenue - groups[a].revenue)
                        .map(cat => ({
                            "Distance_Category": cat,
                            "Total_Parcels": groups[cat].count,
                            "Avg_Weight_Kg": (groups[cat].weightSum / groups[cat].count).toFixed(2),
                            "Total_Revenue_INR": groups[cat].revenue.toFixed(2)
                        }));
                }
            },
            query4: {
                title: "4. View Query: Personnel Performance & Workload",
                sql: `SELECT personnel_id, name, assigned_zone, vehicle_type, active_deliveries, total_assigned, completed, success_pct
FROM vw_personnel_workload;`,
                run: (data) => {
                    return data.delivery_personnel.map(dp => {
                        const assigned = data.parcels.filter(p => p.assigned_personnel_id === dp.personnel_id);
                        const completed = assigned.filter(p => p.current_status === 'Delivered').length;
                        const pct = assigned.length > 0 ? ((completed / assigned.length) * 100).toFixed(1) + "%" : "0.0%";
                        return {
                            "ID": dp.personnel_id,
                            "Agent_Name": dp.name,
                            "Zone": dp.assigned_zone,
                            "Vehicle": dp.vehicle_type,
                            "Active_Load": dp.active_deliveries,
                            "Assigned": assigned.length,
                            "Completed": completed,
                            "Success_Rate": pct
                        };
                    });
                }
            },
            query5: {
                title: "5. Audit Trail Inspection: Tracking Checkpoint History",
                sql: `SELECT update_id, tracking_number, status, location, notes, timestamp
FROM tracking_history
WHERE tracking_number = 'TRK-2026-8801'
ORDER BY timestamp ASC;`,
                run: (data) => {
                    return data.tracking_history
                        .filter(h => h.tracking_number === 'TRK-2026-8801')
                        .map(h => ({
                            "Update_ID": h.update_id,
                            "Tracking_No": h.tracking_number,
                            "Status": h.status,
                            "Location": h.location,
                            "Notes": h.notes,
                            "Timestamp": h.timestamp
                        }));
                }
            },
            query6: {
                title: "6. Doorstep Delivery Failure Audit & Reasons",
                sql: `SELECT da.attempt_id, da.tracking_number, dp.name AS agent, da.failure_reason, da.remarks, da.rescheduled_date
FROM delivery_attempts da
JOIN delivery_personnel dp ON da.personnel_id = dp.personnel_id;`,
                run: (data) => {
                    return data.delivery_attempts.map(da => {
                        const agent = data.delivery_personnel.find(a => a.personnel_id === da.personnel_id);
                        return {
                            "Attempt_ID": da.attempt_id,
                            "Tracking_No": da.tracking_number,
                            "Agent": agent ? agent.name : "Unassigned",
                            "Failure_Reason": da.failure_reason,
                            "Remarks": da.remarks,
                            "Rescheduled": da.rescheduled_date || "Pending"
                        };
                    });
                }
            }
        };
    }

    formatAsciiTable(rows) {
        if (!rows || rows.length === 0) {
            return "+-----------------------+\n| No rows returned      |\n+-----------------------+\n0 rows in set (0.00 sec)";
        }

        const headers = Object.keys(rows[0]);
        const colWidths = {};

        headers.forEach(h => {
            colWidths[h] = h.length;
            rows.forEach(r => {
                const valStr = String(r[h] !== undefined && r[h] !== null ? r[h] : "");
                if (valStr.length > colWidths[h]) colWidths[h] = valStr.length;
            });
            colWidths[h] = Math.max(colWidths[h], 4);
        });

        // Top border
        let sep = "+";
        headers.forEach(h => {
            sep += "-".repeat(colWidths[h] + 2) + "+";
        });

        // Header row
        let headerRow = "|";
        headers.forEach(h => {
            headerRow += " " + h.padEnd(colWidths[h]) + " |";
        });

        // Data rows
        let body = "";
        rows.forEach(r => {
            let rowStr = "|";
            headers.forEach(h => {
                const val = String(r[h] !== undefined && r[h] !== null ? r[h] : "");
                rowStr += " " + val.padEnd(colWidths[h]) + " |";
            });
            body += rowStr + "\n";
        });

        return `${sep}\n${headerRow}\n${sep}\n${body}${sep}\n${rows.length} row(s) in set (0.00 sec)\n`;
    }

    execute(queryKey, customSQL = null) {
        if (this.sampleQueries[queryKey]) {
            const q = this.sampleQueries[queryKey];
            const rows = q.run(window.db.data);
            return {
                sql: q.sql,
                ascii: this.formatAsciiTable(rows),
                rows: rows
            };
        }

        // Generic mock select parser for custom typing
        const rows = window.db.data.parcels.slice(0, 5).map(p => ({
            "tracking_number": p.tracking_number,
            "receiver_name": p.receiver_name,
            "destination_city": p.destination_city,
            "total_charge": p.total_charge,
            "current_status": p.current_status
        }));

        return {
            sql: customSQL || "SELECT * FROM parcels LIMIT 5;",
            ascii: this.formatAsciiTable(rows),
            rows: rows
        };
    }
}

window.sqlRunner = new SQLRunner();
