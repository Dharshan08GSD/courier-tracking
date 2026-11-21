# Database Management Systems (25ITT31) Course Documentation
## Relational Design, Normalization, SQL Suite & Transaction Controls

**Student Name:** Dharshan S | **Register Number:** 732925ITR026 | **Class:** 25IT3A  
**Institution:** Velalar College of Engineering and Technology, Erode – 12  
**Department:** Department of Information Technology (Academic Year 2026–27 ODD)  
**Project:** Scenario 26 — Courier and Parcel Tracking Management System (courier_db)  

---

## UNIT 1: DATABASE SYSTEMS AND DESIGN
### 1.1 Purpose of the Database System
Manual tracking of parcels leads to data redundancy, lost shipments, untracked delivery failures, and billing disputes. The `courier_db` provides a unified relational schema ensuring data integrity, strict referential constraints, concurrent status updates, and automated audit trails.

### 1.2 Entity-Relationship (ER) Model in Chen's Notation
*(Matching Reference Image 4)*
- **Entities (Rectangles):**
  1. `CUSTOMER`
  2. `PARCEL`
  3. `DELIVERY_PERSONNEL`
  4. `TRACKING_HISTORY`
  5. `DELIVERY_ATTEMPTS`
- **Relationships (Diamonds):**
  1. `CUSTOMER` —[1]—< Books >—[N]— `PARCEL`
  2. `PARCEL` —[N]—< Assigned To >—[1]— `DELIVERY_PERSONNEL`
  3. `PARCEL` —[1]—< Records >—[N]— `TRACKING_HISTORY`
  4. `PARCEL` —[1]—< Logs >—[N]— `DELIVERY_ATTEMPTS`
- **Key Constraints:**
  - `customer_id` (PK) uniquely identifies customers.
  - `tracking_number` (Candidate Key / Unique) identifies physical consignments.
  - `personnel_id` (PK) identifies field agents.
  - `update_id` and `attempt_id` (PKs) ensure audit immutability.

---

## UNIT 2: SQL (DDL, DML, JOINS, VIEWS & TRIGGERS)
### 2.1 Database Schema Definition (DDL)
Refer to `sql/schema.sql` for complete SQL scripts creating tables with `ENGINE=InnoDB`, `ON DELETE CASCADE`, and check constraints (`weight_kg > 0`).

### 2.2 Views for Analytical Optimization
1. `vw_pending_deliveries`: Joins `parcels`, `customers`, and `delivery_personnel` to isolate active shipments (`Booked`, `In Transit`, `Out for Delivery`).
2. `vw_personnel_workload`: Aggregates active deliveries, total assigned parcels, completed deliveries, and computes success rate percentage.

### 2.3 Automated Database Triggers
- `trg_parcel_after_insert`: Automatically logs the initial booking checkpoint into `tracking_history` immediately upon row insertion.
- `trg_parcel_after_update`: Automatically captures physical transit changes into `tracking_history` and updates `delivery_personnel.active_deliveries` counters when status becomes `Delivered`.

---

## UNIT 3: NORMALIZATION & QUERY OPTIMIZATION
### 3.1 Functional Dependencies (FDs)
From the domain analysis of courier logistics:
- $FD_1: \text{customer\_id} \rightarrow \text{name}, \text{phone}, \text{email}, \text{address}, \text{city}, \text{pincode}$
- $FD_2: \text{phone} \rightarrow \text{customer\_id}$ (Alternative Key)
- $FD_3: \text{tracking\_number} \rightarrow \text{sender\_id}, \text{receiver\_name}, \text{destination\_city}, \text{weight\_kg}, \text{service\_type}, \text{total\_charge}, \text{current\_status}$
- $FD_4: \text{personnel\_id} \rightarrow \text{name}, \text{phone}, \text{vehicle\_type}, \text{assigned\_zone}$
- $FD_5: \text{update\_id} \rightarrow \text{parcel\_id}, \text{status}, \text{location}, \text{timestamp}$

### 3.2 Step-by-Step Normalization Breakdown

#### 1. Unnormalized Form (UNF)
A monolithic flat spreadsheet containing customer details, multiple parcels, repeated courier agent details, and multiple comma-separated tracking updates for each parcel:
$$\text{UNF}(\underline{\text{tracking\_no}}, \text{sender\_name}, \text{sender\_phone}, \text{sender\_city}, \text{receiver\_name}, \text{dest\_city}, \text{weight}, \{\text{chkpt\_loc}, \text{chkpt\_time}\}, \text{agent\_name}, \text{agent\_phone})$$
*Anomalies:* Severe repeating groups; cannot add a new customer without booking a parcel (Insertion Anomaly); deleting a parcel deletes customer history (Deletion Anomaly).

#### 2. First Normal Form (1NF)
*Rule:* Eliminate repeating groups; ensure all attributes are atomic.
*Transformation:* Separated historical checkpoints into individual rows. Primary key becomes composite: $(\underline{\text{tracking\_no}, \text{checkpoint\_timestamp}})$.
*Issue:* Redundant customer and courier agent data duplicated across multiple tracking checkpoint rows.

#### 3. Second Normal Form (2NF)
*Rule:* Table must be in 1NF and contain NO partial functional dependencies (no non-prime attribute may depend on a proper subset of any candidate key).
*Transformation:*
- Decomposed checkpoint logs into `TRACKING_HISTORY` table whose attributes depend on the full composite key $(\text{update\_id})$.
- Segregated parcel attributes into `PARCEL` table depending purely on `tracking_number`.
*Result:* 2NF achieved; all non-prime attributes fully dependent on candidate keys.

#### 4. Third Normal Form (3NF)
*Rule:* Table must be in 2NF and contain NO transitive dependencies ($X \rightarrow Y$ and $Y \rightarrow Z$, where $Z$ is non-prime).
*Identified Transitive Dependency in 2NF Parcel Table:*
$$\text{tracking\_number} \rightarrow \text{assigned\_personnel\_id} \rightarrow \text{personnel\_name}, \text{vehicle\_type}$$
$$\text{tracking\_number} \rightarrow \text{sender\_id} \rightarrow \text{sender\_name}, \text{sender\_phone}, \text{sender\_city}$$
*Decomposition:*
- Extracted `CUSTOMERS` entity table $(\underline{\text{customer\_id}}, \text{name}, \text{phone}, \dots)$.
- Extracted `DELIVERY_PERSONNEL` entity table $(\underline{\text{personnel\_id}}, \text{name}, \text{phone}, \dots)$.
- In `PARCELS` table, retained only foreign keys `sender_id` and `assigned_personnel_id`.
*Result:* **3NF / Boyce-Codd Normal Form (BCNF) strictly satisfied!** Every determinant is a superkey.

---

## UNIT 4: TRANSACTION MANAGEMENT (ACID & CONCURRENCY)
### 4.1 ACID Properties Application
1. **Atomicity:** When booking a parcel, inserting into `parcels` and inserting the initial checkpoint into `tracking_history` occur within a single database transaction (`START TRANSACTION ... COMMIT`). If the network fails, `ROLLBACK` prevents orphaned consignments.
2. **Consistency:** Database check constraints (`weight_kg > 0`) and foreign key constraints enforce validity before and after execution.
3. **Isolation:** MySQL `REPEATABLE READ` default isolation level prevents phantom reads and dirty reads when dispatchers simultaneously query active workloads while drivers update status.
4. **Durability:** Write-ahead logging (WAL) and InnoDB doublewrite buffer ensure committed shipments survive system restarts.

---

## UNIT 5: NOSQL COMPARISON (DOCUMENT VS RELATIONAL)
While core accounting and billing require ACID-compliant relational schemas (`courier_db`), unstructured tracking checkpoints benefit from Document-Based NoSQL stores (e.g., MongoDB):
- **MongoDB Tracking Document Representation:**
```json
{
  "_id": "TRK-2026-8801",
  "sender": { "name": "Arun Kumar", "city": "Coimbatore" },
  "receiver": { "name": "Sangeetha R", "city": "Coimbatore" },
  "weight_kg": 0.50,
  "service": "Standard",
  "status": "Delivered",
  "checkpoints": [
    { "status": "Booked", "location": "Origin Hub, Coimbatore", "time": "2026-11-15T09:30:00Z" },
    { "status": "In Transit", "location": "Coimbatore Central", "time": "2026-11-15T14:00:00Z" },
    { "status": "Delivered", "location": "Gandhipuram", "time": "2026-11-16T14:20:00Z" }
  ]
}
```
*Advantage:* Atomic document updates with sub-millisecond retrieval without expensive multi-table SQL joins during high-traffic parcel queries.
