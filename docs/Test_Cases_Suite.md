# Software Testing Documentation & Test Cases Suite
## Courier and Parcel Tracking Management System (Scenario 26)

**Student:** Dharshan S | **Reg No:** 732925ITR026 | **Class:** 25IT3A  
**Institution:** Velalar College of Engineering and Technology, Erode – 12  
**Course:** 25ITT33 – Software Engineering (Unit 4: Software Testing)  

---

## 1. Testing Strategy Overview
The testing framework encompasses **White-Box Testing** (Basis Path Testing, Condition Coverage) and **Black-Box Testing** (Equivalence Partitioning, Boundary Value Analysis) across Unit, Integration, and System testing levels.

---

## 2. Test Case Execution Matrix

| Test ID | Module / Feature | Test Objective | Input Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Tracking Search | Query valid delivered parcel | `TRK-2026-8801` | Displays full waybill, recipient name, charges, and complete 4-step chronological audit trail. | Correctly rendered waybill and complete checkpoint log. | **PASS** |
| **TC-02** | Tracking Search | Query non-existent tracking code | `TRK-2026-9999` | Throws `ParcelNotFoundException` with clear error alert. | "Parcel with tracking number not found in database." | **PASS** |
| **TC-03** | Tracking Search | Format validation with regex | `INVALID-1234` | Throws `InvalidTrackingNumberException` indicating format `TRK-YYYY-XXXX`. | Caught regex error and prevented database call. | **PASS** |
| **TC-04** | Parcel Booking | Valid Standard parcel registration | Weight: 2.0 kg, Dest: Salem, Type: Clothing | Calculates base: ₹140, 18% GST: ₹25.20, Total: ₹165.20; generates `TRK-2026-XXXX`. | Generated `TRK-2026-8813`, correct price, status `Booked`. | **PASS** |
| **TC-05** | Parcel Booking | Priority Express with Surcharge | Weight: 3.0 kg, Dest: Chennai, Type: Electronics | Express tariff ($3.0 \times 110 + 75 = 405$ + GST = ₹477.90). | Calculated ₹477.90 exactly. | **PASS** |
| **TC-06** | Parcel Booking | Same-Day Rush delivery | Weight: 1.5 kg, Dest: Erode, Service: Same-Day | Rate ($1.5 \times 80 + 120 = 240$ + GST = ₹283.20). | Calculated ₹283.20, SLA set to 8 hours. | **PASS** |
| **TC-07** | Boundary Testing | Zero or negative weight entry | Weight: -5.0 kg | Rejected with validation message "Weight must be greater than zero". | Prevented submission, showed alert. | **PASS** |
| **TC-08** | Dispatcher | Assign available courier agent | Parcel: `TRK-2026-8805`, Agent: 1 (Manoj) | Parcel status advances to `In Transit`, agent active load increments by 1. | Agent assigned, status updated, active load incremented. | **PASS** |
| **TC-09** | Status Transition | Advance status to Delivered | Parcel: `TRK-2026-8805` | Status changes to `Delivered`, `actual_delivery` timestamp logged, active load decremented. | Trigger updated status and decremented active agent load. | **PASS** |
| **TC-10** | Attempt Logging | Log failed delivery attempt | Reason: `Customer Unavailable`, Reschedule: Tomorrow | Audit entry added to `delivery_attempts`, status retained as pending. | Recorded attempt with reason and rescheduled date. | **PASS** |
| **TC-11** | Multithreading | Concurrent dispatch simulation | 3 active consignments | Spawns 3 worker threads with dynamic thread priorities (Same-Day: 10, Express: 7, Standard: 5). | All threads executed concurrently with synchronized updates. | **PASS** |
| **TC-12** | Database Trigger | Auto tracking history on insert | Insert parcel into DB | Trigger `trg_parcel_after_insert` automatically writes first checkpoint. | Checkpoint present in `tracking_history`. | **PASS** |
| **TC-13** | SQL View | Query pending deliveries view | `SELECT * FROM vw_pending_deliveries` | Returns only consignments in `Booked`, `In Transit`, or `Out for Delivery`. | Filtered out delivered/returned parcels accurately. | **PASS** |
| **TC-14** | Python Analytics | Outlier detection on weights | Gross weight: 12.0 kg | IQR outlier calculation detects statistical weight anomaly ($>9.64\text{ kg}$). | Flagged 1 outlier in console output. | **PASS** |
| **TC-15** | Persistence | Refresh web application tab | Browser page refresh | Client-side persistence retains new bookings and modified status. | All states preserved from `localStorage`. | **PASS** |

---
**Summary:** 15 Test Cases Executed | 15 Passed | 0 Failed | **100% Test Coverage**
