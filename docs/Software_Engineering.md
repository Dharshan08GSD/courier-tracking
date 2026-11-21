# Software Engineering (25ITT33) Course Documentation
## Unit-Wise Role, Process, and Architectural Design Suite

**Student Name:** Dharshan S | **Register Number:** 732925ITR026 | **Class:** 25IT3A  
**Institution:** Velalar College of Engineering and Technology, Erode – 12  
**Department:** Department of Information Technology (Academic Year 2026–27 ODD)  
**Project:** Scenario 26 — Courier and Parcel Tracking Management System (SwiftTrack)  

---

## Executive Overview
This document delivers a comprehensive, unit-by-unit breakdown of the **Software Engineering (25ITT33)** curriculum applied to the **Courier and Parcel Tracking Management System**. Each unit details its explicit role, process methodologies, engineering calculations, and structured UML diagrams matching standard visual standards.

---

## UNIT 1: SOFTWARE PROCESS
### 1.1 Role in This Project
Unit 1 establishes the software development life cycle (SDLC) framework governing the Courier and Parcel Tracking Management System. Given that courier logistics demand continuous deployment, evolving business rules (such as GST rate shifts and new transit hubs), and rapid iterative feedback, the **Agile Scrum Methodology** was chosen over rigid traditional waterfall models.

### 1.2 Process Model Breakdown (Agile Scrum Implementation)
The project was structured across **4 Sprint Iterations**, each spanning a 2-week cycle:

```
[Product Backlog] ──> [Sprint 1: Core Models & DB] ──> [Sprint 2: Booking & Tariff Engine] 
                         ──> [Sprint 3: Dispatch & Tracking] ──> [Sprint 4: Analytics & GitHub Pages Deploy]
```

1. **Sprint 1 (Architecture & Database Foundations):**
   - Elicited logistics requirements; finalized 3NF database schema and relational tables.
   - Built Java domain classes (`Customer`, `Parcel`, `DeliveryPersonnel`).
2. **Sprint 2 (Consignment Booking & Tariff Calculation):**
   - Implemented dynamic tariff pricing engine based on weight and distance.
   - Created barcode/tracking number generation algorithm (`TRK-YYYY-XXXX`).
3. **Sprint 3 (Dispatcher Workflow, Tracking Audit, & Attempts):**
   - Implemented tracking update state machine (`Booked` $\rightarrow$ `In Transit` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered` / `Returned`).
   - Integrated failed delivery attempt logging with failure reasons.
4. **Sprint 4 (Data Science Analytics & GitHub Pages Live Deployment):**
   - Python Pandas data cleaning, Matplotlib/Seaborn visualizations, and zero-latency client-side persistence for 24/7 free hosting.

### 1.3 Addressing Software Myths
- **Myth 1: "A general statement of objectives is enough to begin writing software."**  
  *Reality:* In courier systems, missing specifications on dimensional weight or failed delivery attempt thresholds cause severe tracking inconsistencies. We prepared a formal SRS upfront.
- **Myth 2: "Software requirements continuously change, but change can be easily accommodated because software is flexible."**  
  *Reality:* Uncontrolled scope creep impacts database integrity and delivery SLAs. Using an Agile backlog prioritized core functional requirements first.

---

## UNIT 2: REQUIREMENTS ENGINEERING
### 2.1 Role in This Project
Unit 2 governs the elicitation, analysis, specification, and validation of user needs to ensure 100% compliance with Scenario 26.

### 2.2 Requirements Engineering Phases
1. **Requirements Elicitation:** Conducted interviews with logistics coordinators and field agents to identify pain points (manual manifest entry, tracking delays, untracked delivery failures).
2. **Requirements Specification:** Drafted formal IEEE-compliant SRS with 9 core functional requirements and non-functional metrics ($<100\text{ ms}$ query latency).
3. **Requirements Validation:** Peer reviews and traceability matrices linking every functional requirement to specific database tables and Java methods.

### 2.3 User Stories & Acceptance Criteria
- **User Story US-01 (Customer Booking):**  
  *As a customer, I want to book a parcel with destination details and receive a unique tracking number so that I can track its transit.*  
  *Acceptance Criteria:* System generates `TRK-2026-XXXX`, calculates charges, and records entry in `parcels` table.
- **User Story US-02 (Delivery Attempt):**  
  *As a delivery agent, I want to record why a parcel could not be delivered so that dispatchers can reschedule it.*  
  *Acceptance Criteria:* System logs attempt timestamp, chooses from standard failure reasons, and sets `rescheduled_date`.

---

## UNIT 3: SOFTWARE DESIGN & UML DIAGRAMS
### 3.1 Role in This Project
Unit 3 translates software requirements into architectural, component-level, and object-oriented designs. Below are the 4 core diagrams formally constructed for this project.

### 3.2 Diagram 1: System Architecture Diagram
The system is architected as a **3-Tier Multi-Module Platform**:
1. **Presentation Tier:** Responsive web interface with real-time tracking timeline, booking modal, SQL query console, and Chart.js dashboards.
2. **Business Logic Tier:** Java OOP domain classes, polymorphism for parcel types, multithreaded transit dispatch simulator, and Python EDA engine.
3. **Persistence Tier:** MySQL 3NF database schema, SQLite portability, and client-side zero-latency persistence.

*(Refer to `assets/diagrams/system_architecture.svg`)*

---

### 3.3 Diagram 2: UML Class Diagram (Matching Reference Image 3)
Modeled with formal UML 3-box notation showing attributes, visibility (`+` public, `-` private, `#` protected), methods, and generalization:
- **Base Abstract Class:** `Parcel`
  - *Attributes:* `#trackingNumber: String`, `#weightKg: double`, `#distanceCategory: String`, `#serviceType: String`, `#totalCharge: double`, `#currentStatus: String`
  - *Methods:* `+calculatePricing(): void*`, `+updateStatus(newStatus, loc): void`, `+displayWaybill(): void`
- **Subclasses (Inheritance via Open Triangular Arrow pointing UP):**
  - `StandardParcel`: Implements surface ground rate ($40/\text{kg}$, 3 days SLA).
  - `ExpressParcel`: Implements priority air rate ($110/\text{kg} + \$75$ surcharge, 24 hr SLA).
  - `SameDayParcel`: Implements intra-city rush rate ($80/\text{kg} + \$120$ rush premium, 8 hr SLA).
- **Associated Classes:**
  - `Customer` ($1 \leftrightarrow 0..\text{N}$ `Parcel`)
  - `DeliveryPersonnel` ($0..1 \leftrightarrow 0..\text{N}$ `Parcel`)
  - `TrackingUpdate` & `DeliveryAttempt` ($1 \leftrightarrow 1..\text{N}$ `Parcel`)

*(Refer to `assets/diagrams/class_diagram.svg`)*

---

### 3.4 Diagram 3: UML Component Diagram (Matching Reference Image 2)
Modeled with formal UML 2.0 component notation, ports, provided interfaces (lollipops `—○`), and required interfaces (sockets `—)`):
- **Container Component:** `«component» CourierTrackingSystem` with component decorator icon.
- **Provided Interfaces (Left Ports):**
  - `Booking API`
  - `Tracking Query Interface`
  - `Dispatcher Admin Console`
- **Internal Subcomponents & Assembly Connectors:**
  - `«component» TrackingEngine` (Central status coordinator)
  - `«component» DispatchManager` (Agent allocation)
  - `«component» PricingCalculator` (Rate algorithms)
  - `«component» AnalyticsEngine` (Python EDA integration)
- **Required Interfaces (Right Ports):**
  - `Payment Gateway Interface`
  - `SMS / WhatsApp Notification Gateway`
  - `Relational DBMS (courier_db)`

*(Refer to `assets/diagrams/component_diagram.svg`)*

---

### 3.5 Diagram 4: UML Activity Diagram (Matching Reference Image 1)
Modeled with initial node, fork bar, parallel branch execution, decision diamond, join bar, and final node:
1. **Initial Node:** Filled circle starting the booking workflow.
2. **Action 1:** `Receive Booking Request`.
3. **Fork Bar (Synchronization Bar):** Splits execution into two parallel concurrent branches:
   - **Branch A (Physical Consignment Processing):**
     - Action: `Weigh & Sort Parcel`.
     - Decision Diamond: `[rush / express]` vs `[standard]`.
     - Left Path: `Arrange Priority Air / Express Dispatch`.
     - Right Path: `Arrange Standard Surface Delivery`.
     - Merge Diamond: Merges dispatch branches.
   - **Branch B (Financial Processing):**
     - Action: `Generate Waybill & Invoice`.
     - Action: `Collect Delivery Charge`.
4. **Join Bar (Synchronization Rendezvous):** Both branches must complete before proceeding.
5. **Action 2:** `Dispatch to Doorstep & Update Status`.
6. **Final Node:** Concentric bullseye indicating workflow completion.

*(Refer to `assets/diagrams/activity_diagram.svg`)*

---

## UNIT 4: SOFTWARE TESTING
### 4.1 Role in This Project
Unit 4 establishes the verification and validation (V&V) procedures confirming that the implementation adheres to requirements with zero defects.

### 4.2 Testing Levels Applied
1. **Unit Testing:** Validating individual pricing algorithms in `StandardParcel`, `ExpressParcel`, and regex pattern matching on tracking numbers.
2. **Integration Testing:** Verifying that updating a parcel's status in `parcels` triggers an automatic audit entry in `tracking_history` and updates personnel active load.
3. **System Testing:** End-to-end user journeys from parcel booking through live status progression to delivered/returned status.
4. **Boundary Value Testing:** Weight inputs at $0.00\text{ kg}$, $0.01\text{ kg}$, $50.00\text{ kg}$, and $999.00\text{ kg}$.

*(Refer to `docs/Test_Cases_Suite.md` for the complete 15-case matrix with Expected vs. Actual results)*

---

## UNIT 5: SOFTWARE PROJECT MANAGEMENT
### 5.1 Role in This Project
Unit 5 applies project estimation, scheduling, risk analysis, and quality management principles to the delivery of the Courier Management System.

### 5.2 The 4 P's Framework
1. **People:** Student developer (Dharshan S), academic advisor, end-user personas (customers, delivery agents, dispatchers).
2. **Product:** Fully responsive web application with Java codebase, MySQL schema, and Python analytics.
3. **Process:** 4-sprint Agile Scrum with daily checkpoints and sprint retrospectives.
4. **Project:** Delivering all Scenario 26 requirements on schedule within the academic semester.

### 5.3 COCOMO Cost Estimation Model (Basic COCOMO)
The project is categorized as an **Organic Mode** software project (small team, familiar domain, flexible requirements):

$$\text{Effort } (E) = a_b \times (\text{KLOC})^{b_b} \quad \text{where } a_b = 2.4, \, b_b = 1.05$$
$$\text{Development Time } (D) = c_b \times (E)^{d_b} \quad \text{where } c_b = 2.5, \, d_b = 0.38$$

- **Estimated Code Size (KLOC):**
  - Java Source Code: $850\text{ LOC}$
  - SQL Scripts: $350\text{ LOC}$
  - Python Scripts: $300\text{ LOC}$
  - Web Frontend (HTML/CSS/JS): $2,200\text{ LOC}$
  - **Total:** $\approx 3.7\text{ KLOC}$ ($3.7$ thousand lines of code).
- **Calculations:**
  $$E = 2.4 \times (3.7)^{1.05} \approx 2.4 \times 3.92 = \mathbf{9.41\text{ Person-Months}}$$
  $$D = 2.5 \times (9.41)^{0.38} \approx 2.5 \times 2.34 = \mathbf{5.85\text{ Months}}$$
  $$\text{Recommended Staffing } (S) = \frac{E}{D} = \frac{9.41}{5.85} \approx \mathbf{1.6\text{ Engineers}}$$

### 5.4 Risk Identification and Mitigation Matrix

| Risk ID | Risk Description | Category | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R-01** | Hosting downtime on free tier | Technical | High | Low | Hosted on **GitHub Pages** (100% uptime, zero cold starts, zero cost). |
| **R-02** | Invalid tracking number formats | Operational | Medium | Medium | Client-side and server-side regex validation (`^TRK-\d{4}-\d{4}$`). |
| **R-03** | Race conditions in status updates | Technical | High | Low | Implemented `synchronized` blocks in Java service and database transactions. |
| **R-04** | Data loss upon browser refresh | User Experience| Medium | Medium | Dual-layer persistence using `localStorage` with automated mock fallback. |

---
**Prepared by:** Dharshan S (732925ITR026) | Class 25IT3A | Velalar College of Engineering and Technology
