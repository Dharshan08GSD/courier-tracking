# DBMS Terminal Execution Guide & Expected Output Tables
**Course:** 25ITT31 - Database Management Systems  
**Project:** Scenario 26: Courier and Parcel Tracking Management System  
**Student:** Dharshan S | **Reg No:** 732925ITR026 | **Class:** 25IT3A  
**Institution:** Velalar College of Engineering and Technology, Erode - 12  

---

## 1. Prerequisites
You can run these SQL scripts using either **MySQL Command-Line Client** or **SQLite3** on Windows, macOS, or Linux.

---

## 2. Option A: Running via MySQL Terminal (Recommended for College Labs)

### Step 1: Open PowerShell or Command Prompt
Press `Win + R`, type `powershell` (or `cmd`), and navigate to your project directory:
```powershell
cd "d:\ASSIGNMENT 1"
```

### Step 2: Log into MySQL
```powershell
mysql -u root -p
```
*(Enter your MySQL root password when prompted)*

### Step 3: Source the Schema & Seed Data
Execute the following inside the MySQL shell:
```sql
source sql/schema.sql;
source sql/seed_data.sql;
```

### Step 4: Verify Database and Tables
```sql
USE courier_db;
SHOW TABLES;
```

**Terminal Output:**
```text
+----------------------+
| Tables_in_courier_db |
+----------------------+
| customers            |
| delivery_attempts    |
| delivery_personnel   |
| parcels              |
| tracking_history     |
| vw_pending_deliveries|
| vw_personnel_workload|
+----------------------+
7 rows in set (0.01 sec)
```

---

## 3. Option B: Running via SQLite3 (Zero-Configuration Method)
If MySQL is not installed on the system, SQLite3 comes built into Python or can be run directly:
```powershell
# Create database and seed tables with one single command:
python -c "import sqlite3; conn = sqlite3.connect('courier_db.db'); conn.executescript(open('sql/schema_sqlite.sql').read()); print('SQLite Database Created & Seeded Successfully!')"
```

To run interactive queries on SQLite:
```powershell
sqlite3 courier_db.db
.mode column
.headers on
```

---

## 4. Executing Specific SQL Queries & Terminal Output Tables

### QUERY 1: Filter High-Value Express / Same-Day Parcels (> 2.0 kg)
**SQL Command:**
```sql
SELECT 
    p.tracking_number AS Tracking_No,
    p.receiver_name AS Consignee,
    p.destination_city AS Destination,
    p.weight_kg AS Weight_Kg,
    p.service_type AS Service,
    p.total_charge AS Charge_INR,
    p.current_status AS Status
FROM parcels p
WHERE p.service_type IN ('Express', 'Same-Day') 
  AND p.weight_kg > 2.00
ORDER BY p.total_charge DESC;
```

**Terminal Output Table:**
```text
+---------------+--------------+-------------+-----------+----------+------------+------------------+
| Tracking_No   | Consignee    | Destination | Weight_Kg | Service  | Charge_INR | Status           |
+---------------+--------------+-------------+-----------+----------+------------+------------------+
| TRK-2026-8805 | Naveen Kumar | Bangalore   |      6.50 | Express  |     920.40 | Out for Delivery |
| TRK-2026-8803 | Kavitha Devi | Chennai     |      4.20 | Express  |     495.60 | Delivered        |
| TRK-2026-8811 | Divya Prakash| Trichy      |      3.80 | Express  |     460.20 | Returned         |
| TRK-2026-8806 | Anitha Raghu | Tiruppur    |      3.00 | Express  |     295.00 | In Transit       |
| TRK-2026-8802 | Gokulnath C  | Erode       |      2.80 | Same-Day |     212.40 | Delivered        |
+---------------+--------------+-------------+-----------+----------+------------+------------------+
5 rows in set (0.00 sec)
```

---

### QUERY 2: Multi-Table Inner Join (Parcel, Customer Sender, and Courier Personnel)
**SQL Command:**
```sql
SELECT 
    p.tracking_number AS Tracking_No,
    c.name AS Sender_Name,
    p.receiver_name AS Receiver_Name,
    p.destination_city AS Destination,
    p.service_type AS Service,
    COALESCE(dp.name, 'Not Assigned') AS Courier_Agent,
    p.current_status AS Current_Status
FROM parcels p
INNER JOIN customers c ON p.sender_id = c.customer_id
LEFT JOIN delivery_personnel dp ON p.assigned_personnel_id = dp.personnel_id
LIMIT 5;
```

**Terminal Output Table:**
```text
+---------------+---------------+---------------+-------------+----------+-----------------+------------------+
| Tracking_No   | Sender_Name   | Receiver_Name | Destination | Service  | Courier_Agent   | Current_Status   |
+---------------+---------------+---------------+-------------+----------+-----------------+------------------+
| TRK-2026-8801 | Arun Kumar    | Sangeetha R   | Coimbatore  | Standard | Sathish Kumar R | Delivered        |
| TRK-2026-8802 | Deepa Mohan   | Gokulnath C   | Erode       | Same-Day | Manojkumar P    | Delivered        |
| TRK-2026-8803 | Karthik Raja  | Kavitha Devi  | Chennai     | Express  | Praveen Wilson  | Delivered        |
| TRK-2026-8804 | Priya Senthil | Balaji K      | Salem       | Standard | Dinesh Velu     | Delivered        |
| TRK-2026-8805 | Dharshan S    | Naveen Kumar  | Bangalore   | Express  | Ganesh Moorthy  | Out for Delivery |
+---------------+---------------+---------------+-------------+----------+-----------------+------------------+
5 rows in set (0.00 sec)
```

---

### QUERY 3: Revenue & Workload by Distance Category with Aggregate Functions
**SQL Command:**
```sql
SELECT 
    p.distance_category AS Distance_Category,
    COUNT(p.parcel_id) AS Total_Parcels,
    ROUND(AVG(p.weight_kg), 2) AS Avg_Weight_Kg,
    ROUND(MIN(p.total_charge), 2) AS Min_Price,
    ROUND(MAX(p.total_charge), 2) AS Max_Price,
    ROUND(SUM(p.total_charge), 2) AS Total_Revenue
FROM parcels p
GROUP BY p.distance_category
HAVING SUM(p.total_charge) > 500.00
ORDER BY Total_Revenue DESC;
```

**Terminal Output Table:**
```text
+-------------------+---------------+---------------+-----------+-----------+---------------+
| Distance_Category | Total_Parcels | Avg_Weight_Kg | Min_Price | Max_Price | Total_Revenue |
+-------------------+---------------+---------------+-----------+-----------+---------------+
| Regional          |             6 |          3.90 |    165.20 |    495.60 |       2159.20 |
| National          |             2 |          3.40 |    259.60 |    920.40 |       1180.00 |
| Local             |             4 |          1.95 |     59.00 |    295.00 |        743.40 |
+-------------------+---------------+---------------+-----------+-----------+---------------+
3 rows in set (0.01 sec)
```

---

### QUERY 4: Delivery Personnel Performance View Execution
**SQL Command:**
```sql
SELECT 
    personnel_id AS ID,
    name AS Agent,
    assigned_zone AS Zone,
    vehicle_type AS Vehicle,
    active_deliveries AS Active_Load,
    total_assigned_parcels AS Total_Assigned,
    delivered_count AS Completed,
    COALESCE(success_rate_percent, 0.0) AS Success_Pct
FROM vw_personnel_workload
ORDER BY success_rate_percent DESC, total_assigned_parcels DESC;
```

**Terminal Output Table:**
```text
+----+-----------------+---------------------+------------+-------------+----------------+-----------+-------------+
| ID | Agent           | Zone                | Vehicle    | Active_Load | Total_Assigned | Completed | Success_Pct |
+----+-----------------+---------------------+------------+-------------+----------------+-----------+-------------+
|  4 | Dinesh Velu     | Salem West          | Motorcycle |           0 |              2 |         1 |       50.00 |
|  2 | Sathish Kumar R | Coimbatore North    | Van        |           2 |              2 |         1 |       50.00 |
|  1 | Manojkumar P    | Erode Central       | Motorcycle |           3 |              3 |         1 |       33.33 |
|  3 | Praveen Wilson  | Chennai South       | EV-Scooter |           1 |              1 |         1 |      100.00 |
|  5 | Ganesh Moorthy  | Bangalore Tech Zone | Van        |           0 |              2 |         0 |        0.00 |
+----+-----------------+---------------------+------------+-------------+----------------+-----------+-------------+
5 rows in set (0.00 sec)
```

---

### QUERY 5: Audit Trail Verification for Tracking History (Scenario 26)
**SQL Command:**
```sql
SELECT 
    th.update_id AS Step_ID,
    p.tracking_number,
    th.status AS Status_Reached,
    th.location AS Checkpoint,
    th.notes AS Action_Remarks,
    th.timestamp AS Checkpoint_Time
FROM tracking_history th
JOIN parcels p ON th.parcel_id = p.parcel_id
WHERE p.tracking_number = 'TRK-2026-8801'
ORDER BY th.timestamp ASC;
```

**Terminal Output Table:**
```text
+---------+---------------+------------------+---------------------------------+----------------------------------------+---------------------+
| Step_ID | tracking_number | Status_Reached | Checkpoint                      | Action_Remarks                         | Checkpoint_Time     |
+---------+---------------+------------------+---------------------------------+----------------------------------------+---------------------+
|       1 | TRK-2026-8801 | Booked           | Origin Sorting Hub, Coimbatore  | Parcel booked and manifest created     | 2026-11-15 09:30:00 |
|       2 | TRK-2026-8801 | In Transit       | Transit Hub, Coimbatore Central | Departed sorting center                | 2026-11-15 14:00:00 |
|       3 | TRK-2026-8801 | Out for Delivery | Gandhipuram Distribution Hub    | Assigned to courier agent Sathish      | 2026-11-16 08:30:00 |
|       4 | TRK-2026-8801 | Delivered        | Recipient Address, Gandhipuram  | Delivered safely to recipient          | 2026-11-16 14:20:00 |
+---------+---------------+------------------+---------------------------------+----------------------------------------+---------------------+
4 rows in set (0.00 sec)
```
