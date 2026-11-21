# Software Requirements Specification (SRS)
## Courier and Parcel Tracking Management System (Scenario 26)

**Institution:** Velalar College of Engineering and Technology, Erode – 12  
**Department:** Department of Information Technology  
**Academic Year:** 2026–27 (ODD) | **Class:** 25IT3A  
**Student:** Dharshan S | **Register Number:** 732925ITR026  
**Course Code:** 25ITT33 – Software Engineering  

---

## 1. Introduction
### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) document is to define the functional and non-functional requirements of the **Courier and Parcel Tracking Management System (SwiftTrack)**. It provides a detailed description of the software capabilities, architectural design, data models, operational constraints, and verification criteria for academic evaluation and production deployment.

### 1.2 Scope
SwiftTrack is an integrated end-to-end logistics and parcel tracking web application designed for regional, national, and international courier operators. The system manages:
- Sender and recipient customer records.
- Consignment parcel registrations and barcode/tracking number generation.
- Dynamic delivery tariff calculations based on weight, distance tier, and speed category.
- Dispatch personnel assignment and workload balancing.
- Multi-checkpoint physical status updating (`Booked` $\rightarrow$ `In Transit` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered` / `Returned`).
- Doorstep delivery attempt logging and failure reason tracking.
- Operational reports, audit trails, and Python-driven exploratory data analytics.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS:** Software Requirements Specification
- **AWB:** Air Waybill / Tracking Number
- **SLA:** Service Level Agreement
- **3NF:** Third Normal Form
- **FIFO:** First In, First Out
- **GST:** Goods and Services Tax (18% applied on shipping)
- **EDA:** Exploratory Data Analysis

---

## 2. Overall Description
### 2.1 Product Perspective
SwiftTrack operates as a modern 3-tier distributed web application with client-side zero-latency persistence, backed by Java OOP business logic engines, MySQL relational schemas, and Python data science pipelines.

### 2.2 User Characteristics
1. **Consignment Customer / Sender:** Books parcels, pays charges, and queries real-time tracking checkpoints.
2. **Operations Dispatcher / Station Admin:** Allocates parcels to delivery agents, updates transit hubs, and logs delivery attempts.
3. **Delivery Personnel / Courier Agent:** Accesses daily manifest, performs doorstep deliveries, collects receiver signatures, and records failure reasons.
4. **Logistics Analyst / Manager:** Reviews SLA delay metrics, shipment volumes, courier workload, and financial reports.

### 2.3 Operating Environment
- **Client Platforms:** Modern Web Browsers (Chrome 100+, Edge, Firefox, Safari) on Desktop, Tablet, and Mobile.
- **Hosting Infrastructure:** 24/7 High-Availability Free Static Cloud Hosting via GitHub Pages.
- **Execution Engines:** Java JDK 17/21 LTS, Python 3.10+, and MySQL 8.0+ / SQLite 3.

---

## 3. Specific Functional Requirements (Scenario 26 Mandate)

| Req ID | Functional Requirement | Detailed Specification |
| :--- | :--- | :--- |
| **FR-01** | **Customer Management** | Store and maintain Customer ID, Full Name, Contact Phone, Email Address, Physical Address, City, and Pincode for both senders and recipients. |
| **FR-02** | **Parcel Registration** | Capture Consignment ID, Sender details, Consignee name, phone, delivery address, destination city, parcel category (Document, Electronics, Clothing, Fragile, General Goods), gross weight in kilograms, and booking timestamp. |
| **FR-03** | **Tracking Number Generation** | Automatically generate and assign a globally unique alphanumeric tracking number adhering to the standard format: `TRK-YYYY-XXXX` (e.g., `TRK-2026-8801`). |
| **FR-04** | **Delivery Charge Calculation** | Dynamically compute base tariff based on parcel gross weight ($w$), distance classification (`Local`, `Regional`, `National`, `International`), and service tier (`Standard`, `Express`, `Same-Day`), plus 18% statutory GST. |
| **FR-05** | **Delivery Personnel Assignment** | Allocate consignments to qualified delivery agents based on geographic zone availability and vehicle type (`Motorcycle`, `Van`, `EV-Scooter`), tracking active load. |
| **FR-06** | **Shipment Status Tracking** | Record and display transitions across explicit states: `Booked`, `In Transit`, `Out for Delivery`, `Delivered`, and `Returned`, timestamping each physical checkpoint. |
| **FR-07** | **Delivery Attempt Logging** | Maintain doorstep delivery attempt audit trail recording timestamp, attempt status (`Successful` vs `Failed`), failure reason (`Customer Unavailable`, `Incorrect Address`, `Door Locked`, `Customer Rescheduled`, `Weather Delay`), and rescheduled date. |
| **FR-08** | **Comprehensive Reporting** | Generate operational reports showing parcel tracking chronological history, active pending consignments, successfully delivered parcels, returned items, and courier personnel workload. |
| **FR-09** | **Python Data Science & EDA** | Ingest database records into Pandas DataFrames, clean missing values, identify weight outliers, and visualize delivery completion rates, daily shipment volumes, and distance-based SLA delivery delays. |

---

## 4. Non-Functional Requirements (NFR)

### 4.1 Performance Requirements
- **Search Response Time:** Tracking queries must render within **$< 100\text{ ms}$** in client-side runtime.
- **Concurrent Dispatches:** Background multithreading simulator must process multi-agent dispatches without race conditions or memory locks.

### 4.2 Security Requirements
- Input sanitization against Cross-Site Scripting (XSS) and SQL Injection vulnerabilities.
- Format enforcement via regex validation on tracking numbers and phone numbers.

### 4.3 Reliability & Availability
- **24/7 Live Continuous Uptime:** 99.99% availability hosted on GitHub Pages with zero server cold start delays.
- Resilient offline state caching using browser `localStorage`.

### 4.4 Usability & UI/UX Requirements
- Clean, accessible user interface adhering to WCAG 2.1 standards.
- High contrast typography, clear visual status pills (Green for Delivered, Blue for In-Transit, Amber for Out for Delivery, Red for Returned).
- Fully responsive on mobile, tablet, and widescreen desktop monitors.
