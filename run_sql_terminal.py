"""
================================================================================
SWIFTTRACK: Terminal SQL Runner & ASCII Table Formatter
Course: 25ITT31 - Database Management Systems
Student: Dharshan S | Reg No: 732925ITR026 | Class: 25IT3A
Department of Information Technology, Velalar College of Engineering and Technology
================================================================================
This script provides an interactive SQL terminal that connects to the database,
executes queries, and displays professional MySQL-style ASCII output tables.
"""

import os
import sys
import sqlite3

DB_FILE = os.path.join(os.path.dirname(__file__), "courier_db.sqlite3")
SCHEMA_FILE = os.path.join(os.path.dirname(__file__), "sql", "schema_sqlite.sql")

PRESET_QUERIES = [
    {
        "id": "1",
        "title": "Filter High-Value Express / Same-Day Parcels (> 2.0 kg)",
        "sql": """SELECT 
    tracking_number AS Tracking_No,
    receiver_name AS Consignee,
    destination_city AS Destination,
    printf('%.2f', weight_kg) AS Weight_Kg,
    service_type AS Service,
    printf('%.2f', total_charge) AS Charge_INR,
    current_status AS Status
FROM parcels
WHERE service_type IN ('Express', 'Same-Day') AND weight_kg > 2.00
ORDER BY total_charge DESC;"""
    },
    {
        "id": "2",
        "title": "Inner Join: Parcels with Senders & Assigned Courier Agents",
        "sql": """SELECT 
    p.tracking_number AS Tracking_No,
    c.name AS Sender_Name,
    p.receiver_name AS Consignee,
    p.destination_city AS City,
    p.service_type AS Service,
    COALESCE(dp.name, 'Unassigned') AS Courier_Agent,
    p.current_status AS Status
FROM parcels p
JOIN customers c ON p.sender_id = c.customer_id
LEFT JOIN delivery_personnel dp ON p.assigned_personnel_id = dp.personnel_id
LIMIT 6;"""
    },
    {
        "id": "3",
        "title": "Aggregation & Grouping: Revenue by Distance Category (HAVING > 500)",
        "sql": """SELECT 
    distance_category AS Distance_Category,
    COUNT(parcel_id) AS Total_Parcels,
    printf('%.2f', AVG(weight_kg)) AS Avg_Weight_Kg,
    printf('%.2f', MIN(total_charge)) AS Min_Price,
    printf('%.2f', MAX(total_charge)) AS Max_Price,
    printf('%.2f', SUM(total_charge)) AS Total_Revenue
FROM parcels
GROUP BY distance_category
HAVING SUM(total_charge) > 500.00
ORDER BY SUM(total_charge) DESC;"""
    },
    {
        "id": "4",
        "title": "View Delivery Personnel Active Workload & Completed Count",
        "sql": """SELECT 
    dp.personnel_id AS ID,
    dp.name AS Agent_Name,
    dp.assigned_zone AS Assigned_Zone,
    dp.vehicle_type AS Vehicle,
    dp.active_deliveries AS Active_Load,
    COUNT(p.parcel_id) AS Total_Assigned,
    SUM(CASE WHEN p.current_status = 'Delivered' THEN 1 ELSE 0 END) AS Completed
FROM delivery_personnel dp
LEFT JOIN parcels p ON dp.personnel_id = p.assigned_personnel_id
GROUP BY dp.personnel_id, dp.name, dp.assigned_zone, dp.vehicle_type, dp.active_deliveries
ORDER BY Completed DESC, Active_Load DESC;"""
    },
    {
        "id": "5",
        "title": "Chronological Audit Trail / Checkpoints for Parcel TRK-2026-8801",
        "sql": """SELECT 
    update_id AS Step_ID,
    tracking_number AS Tracking_No,
    status AS Status_Reached,
    location AS Checkpoint,
    notes AS Operational_Notes,
    timestamp AS Checkpoint_Time
FROM tracking_history
WHERE tracking_number = 'TRK-2026-8801'
ORDER BY timestamp ASC;"""
    },
    {
        "id": "6",
        "title": "Doorstep Delivery Failure Audit & Unsuccessful Reasons",
        "sql": """SELECT 
    da.attempt_id AS Attempt_ID,
    da.tracking_number AS Tracking_No,
    dp.name AS Courier_Agent,
    da.failure_reason AS Failure_Reason,
    da.remarks AS Field_Remarks,
    COALESCE(da.rescheduled_date, 'Pending') AS Rescheduled_Date
FROM delivery_attempts da
JOIN delivery_personnel dp ON da.personnel_id = dp.personnel_id;"""
    },
    {
        "id": "7",
        "title": "All Registered Customers in Database",
        "sql": """SELECT customer_id, name, phone, email, city, pincode FROM customers;"""
    },
    {
        "id": "8",
        "title": "All Delivery Personnel Roster",
        "sql": """SELECT personnel_id, name, phone, vehicle_type, vehicle_number, assigned_zone, active_deliveries, status, rating FROM delivery_personnel;"""
    }
]

def init_database():
    """Initializes the database from schema_sqlite.sql if not exists or empty."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='parcels';")
    if cursor.fetchone()[0] == 0:
        if os.path.exists(SCHEMA_FILE):
            with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
                conn.executescript(f.read())
            conn.commit()
    return conn

def print_ascii_table(cursor, rows):
    """Formats and prints query results as a professional ASCII grid table."""
    if not cursor.description:
        print("[Query executed successfully with 0 result rows]")
        return

    headers = [col[0] for col in cursor.description]
    if not rows:
        print("+-------------------------+")
        print("| No matching records     |")
        print("+-------------------------+")
        print("0 rows in set (0.00 sec)\n")
        return

    # Calculate column widths
    col_widths = [len(h) for h in headers]
    for row in rows:
        for idx, val in enumerate(row):
            val_str = str(val) if val is not None else "NULL"
            if len(val_str) > col_widths[idx]:
                col_widths[idx] = len(val_str)

    # Pad widths
    col_widths = [max(w, 4) for w in col_widths]

    # Horizontal separator line
    sep = "+" + "+".join(["-" * (w + 2) for w in col_widths]) + "+"

    # Header line
    header_line = "|" + "|".join([f" {headers[i].ljust(col_widths[i])} " for i in range(len(headers))]) + "|"

    print(sep)
    print(header_line)
    print(sep)

    for row in rows:
        row_str = "|"
        for i, val in enumerate(row):
            val_str = str(val) if val is not None else "NULL"
            row_str += f" {val_str.ljust(col_widths[i])} |"
        print(row_str)

    print(sep)
    print(f"{len(rows)} row(s) in set (0.00 sec)\n")

def execute_query(conn, sql):
    print("\nExecuting SQL:")
    print("-" * 75)
    print(sql.strip())
    print("-" * 75)
    try:
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        print_ascii_table(cursor, rows)
    except Exception as e:
        print(f"\n[SQL ERROR] {e}\n")

def main():
    conn = init_database()
    print("=" * 80)
    print("  SWIFTTRACK: INTERACTIVE TERMINAL SQL RUNNER (DBMS 25ITT31)")
    print("  Student: Dharshan S | Reg No: 732925ITR026 | Class: 25IT3A | VCET Erode")
    print("=" * 80)

    # If an argument is provided, execute it directly (e.g., python run_sql_terminal.py 1)
    if len(sys.argv) > 1:
        arg = sys.argv[1].strip()
        found = next((q for q in PRESET_QUERIES if q["id"] == arg), None)
        if found:
            print(f"\n[QUERY #{found['id']}] {found['title']}")
            execute_query(conn, found["sql"])
        else:
            execute_query(conn, " ".join(sys.argv[1:]))
        return

    while True:
        print("\n--------------------------- AVAILABLE SQL QUERIES -----------------------------")
        for q in PRESET_QUERIES:
            print(f"  [{q['id']}] {q['title']}")
        print("  [C] Type Custom SQL Query (e.g. SELECT * FROM parcels;)")
        print("  [R] Reset Database from schema script")
        print("  [Q] Exit Terminal")
        print("-------------------------------------------------------------------------------")

        choice = input("Enter choice (1-8, C, R, Q): ").strip().upper()

        if choice == "Q":
            print("\nExiting SQL Terminal. Goodbye!")
            break
        elif choice == "R":
            conn.close()
            if os.path.exists(DB_FILE): os.remove(DB_FILE)
            conn = init_database()
            print("\n[SUCCESS] Database re-initialized from sql/schema_sqlite.sql!")
        elif choice == "C":
            custom_sql = input("\nEnter SQL statement: ").strip()
            if custom_sql:
                execute_query(conn, custom_sql)
        else:
            found = next((q for q in PRESET_QUERIES if q["id"] == choice), None)
            if found:
                print(f"\n[QUERY #{found['id']}] {found['title']}")
                execute_query(conn, found["sql"])
            else:
                print("[ERROR] Invalid selection! Please enter a valid query number.")

if __name__ == "__main__":
    main()
