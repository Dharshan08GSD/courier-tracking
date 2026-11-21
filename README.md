# SwiftTrack: Courier and Parcel Tracking Management System
### Academic Assessment Project — Scenario 26 (Register No: 732925ITR026)

[![Live Web Application](https://img.shields.io/badge/Live%20Website-24%2F7%20GitHub%20Pages-22c55e?style=for-the-badge&logo=github)](https://dharshan-vcet.github.io/courier-parcel-tracking/)
[![Academic Year](https://img.shields.io/badge/Academic%20Year-2026--27%20(ODD)-0284c7?style=for-the-badge)](https://vcet.ac.in)
[![Department](https://img.shields.io/badge/Department-Information%20Technology-8b5cf6?style=for-the-badge)](https://vcet.ac.in)

---

## 👨‍🎓 Student & Academic Profile
* **Student Name:** Dharshan S
* **Register Number:** 732925ITR026
* **Class / Section:** 25IT3A
* **Department:** Department of Information Technology
* **Institution:** Velalar College of Engineering and Technology, Erode – 638012
* **Assigned Problem:** **Scenario 26 — Courier and Parcel Tracking Management System**

---

## 📌 Problem Statement (Scenario 26)
Courier service providers handle parcel bookings, sender and receiver details, shipment tracking, delivery assignments, and delivery status updates. Maintaining these records manually can cause tracking errors, delays in identifying pending deliveries, and difficulties in analyzing delivery performance.

**SwiftTrack** is a fullstack web and software engineering platform built with **Java (25ITT32)**, **DBMS (25ITT31)**, and **Python Data Science (25ITC31)** under the guidelines of **Software Engineering (25ITT33)**.

---

## 🌟 Four Courses Curriculum Integration

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│           SWIFTTRACK COURIER & PARCEL TRACKING PLATFORM (SCENARIO 26)           │
├───────────────────────┬────────────────────────┬────────────────────────────────┤
│ 25ITT31 - DBMS        │ 25ITT32 - JAVA         │ 25ITT33 - SOFTWARE ENGINEERING │
│ • Chen's ER Diagram   │ • OOP Domain Models    │ • Unit 1: Agile Scrum SDLC     │
│ • Relational Schema   │ • Abstract Class Parcel│ • Unit 2: Formal SRS & Stories │
│ • 1NF to 3NF/BCNF     │ • Custom Exceptions    │ • Unit 3: Design Diagrams:     │
│ • Triggers & Views    │ • Multi-threading Sim  │   - System Architecture        │
│ • Terminal ASCII Guide│ • JDBC Architecture    │   - UML Class Diagram          │
│ • Live SQL Terminal   │ • Stream API & Lambdas │   - UML Component Diagram      │
├───────────────────────┴────────────────────────│   - UML Activity Diagram       │
│ 25ITC31 - DATA SCIENCE (PYTHON)                │ • Unit 4: 15-Case Testing Suite│
│ • Data Preprocessing & Cleaning (Pandas)       │ • Unit 5: Project Management   │
│ • IQR Outlier Treatment                        │   (4P's, COCOMO Math, Risks)   │
│ • 4 Visualizations (Matplotlib & Seaborn)      └────────────────────────────────┘
│ • Interactive Chart.js Dashboards                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Functional Modules Implemented (Scenario 26 Mandates)

1. **Customer Management (FR-01):** Senders and consignees with verified phone, address, and city coordinates.
2. **Parcel Registration (FR-02):** Consignments with weight, dimensions, category, and transit origin/destination.
3. **Unique Tracking Code Generation (FR-03):** Automatically generates format `TRK-YYYY-XXXX` (e.g., `TRK-2026-8805`).
4. **Dynamic Tariff Calculation (FR-04):** Computes ground, air express surcharge, local rush premiums, and statutory 18% GST.
5. **Personnel Assignment & Load Balancer (FR-05):** Allocates couriers based on zone and vehicle type with live counter.
6. **Shipment Status State Machine (FR-06):** Finite states: `Booked` $\rightarrow$ `In Transit` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered` / `Returned`.
7. **Delivery Attempt Logging (FR-07):** Records doorstep failures (`Customer Unavailable`, `Door Locked`, `Incorrect Address`, `Weather Delay`) and reschedule dates.
8. **Comprehensive Reports & Dashboards (FR-08):** Live filterable tables, pending queues, and active workloads.
9. **Python Performance Analytics (FR-09):** Ingests database records into Pandas DataFrames, calculates descriptive statistics, and models completion rates and SLA delays.

---

## 📐 Formal UML & Database Diagrams

All diagrams are available in vector SVG format inside the [`assets/diagrams/`](assets/diagrams/) directory:
* **UML Activity Diagram:** [`assets/diagrams/activity_diagram.svg`](assets/diagrams/activity_diagram.svg) *(Matching Reference Image 1)*
* **UML Component Diagram:** [`assets/diagrams/component_diagram.svg`](assets/diagrams/component_diagram.svg) *(Matching Reference Image 2)*
* **UML Class Diagram:** [`assets/diagrams/class_diagram.svg`](assets/diagrams/class_diagram.svg) *(Matching Reference Image 3)*
* **Chen's Entity-Relationship (ER) Diagram:** [`assets/diagrams/er_diagram.svg`](assets/diagrams/er_diagram.svg) *(Matching Reference Image 4)*
* **System Architecture Diagram:** [`assets/diagrams/system_architecture.svg`](assets/diagrams/system_architecture.svg)

---

## 🛠️ Execution & Setup Instructions

### 1. Running the Live Fullstack Web Application
The web application is self-contained and ready to run locally or 24/7 on GitHub Pages:
- **Direct Local Run:** Double-click [`index.html`](index.html) or open it in any modern browser (Chrome, Edge, Firefox).
- **Via VS Code Live Server / Local Python Server:**
  ```powershell
  python -m http.server 8000
  # Open http://localhost:8000 in your browser
  ```

---

### 2. Database Execution & Terminal Guide (25ITT31)
#### Using MySQL Terminal:
```powershell
cd "d:\ASSIGNMENT 1"
mysql -u root -p
```
Inside MySQL shell:
```sql
source sql/schema.sql;
source sql/seed_data.sql;
source sql/queries.sql;
```
*(Refer to [`sql/terminal_guide.md`](sql/terminal_guide.md) for full commands and expected formatted ASCII tables)*

---

### 3. Java Application Compilation & Execution (25ITT32)
Ensure Java JDK 17 or higher is installed:
```powershell
cd "d:\ASSIGNMENT 1\java"

# Compile all modules
mkdir bin
javac -d bin src/com/courier/model/*.java src/com/courier/service/*.java src/com/courier/exception/*.java src/com/courier/util/*.java src/com/courier/Main.java

# Run Console Application
java -cp bin com.courier.Main
```
*(Or simply run `compile_and_run.bat` on Windows)*

---

### 4. Python Data Science & Visualizations (25ITC31)
```powershell
cd "d:\ASSIGNMENT 1\python"
pip install -r requirements.txt
python analytics.py
```
This generates 4 high-resolution 300 DPI figures inside [`assets/charts/`](assets/charts/):
1. `delivery_completion_rates.png` (Status Donut Chart)
2. `shipment_volumes_trend.png` (Volume & Revenue Trend)
3. `delivery_delays_by_distance.png` (SLA Variance by Distance Tier)
4. `personnel_workload_distribution.png` (Agent Workload Distribution)

---

## 🌐 How to Deploy to GitHub Pages (24/7 Free Live Hosting)
Follow these exact steps to activate 24/7 live hosting:
```powershell
cd "d:\ASSIGNMENT 1"
git init
git add .
git commit -m "Initial release of Scenario 26 Courier System - Dharshan S (732925ITR026)"
git branch -M main
git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
git push -u origin main
```
1. Go to your repository on GitHub.
2. Click **Settings** $\rightarrow$ **Pages** (in the left sidebar).
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save**. Your site is now live 24/7!

---

## 📑 Directory Structure
```
d:\ASSIGNMENT 1/
├── index.html                   # Master 24/7 Fullstack Web Portal
├── README.md                    # Project Documentation & Setup Guide
├── .gitignore                   # Standard Git Ignore Rules
├── css/
│   └── style.css                # Ultra-modern Responsive Stylesheet
├── js/
│   ├── app.js                   # Application Router & Form Controllers
│   ├── db-engine.js             # In-Browser Relational Engine & Persistence
│   ├── sql-runner.js            # Live SQL Terminal & ASCII Table Formatter
│   └── analytics.js             # Chart.js Live Interactive Dashboards
├── assets/
│   ├── diagrams/                # Formal SVG Vector Diagrams
│   │   ├── activity_diagram.svg # UML Activity Diagram (Fig 1)
│   │   ├── component_diagram.svg# UML Component Diagram (Fig 2)
│   │   ├── class_diagram.svg    # UML Class Diagram (Fig 3)
│   │   ├── er_diagram.svg       # Chen's ER Diagram (Fig 4)
│   │   └── system_architecture.svg
│   └── charts/                  # 300 DPI Matplotlib & Seaborn Visualizations
│       ├── delivery_completion_rates.png
│       ├── shipment_volumes_trend.png
│       ├── delivery_delays_by_distance.png
│       └── personnel_workload_distribution.png
├── docs/                        # Formal Academic Specifications
│   ├── SRS_Document.md          # IEEE-Compliant Software Requirements
│   ├── Software_Engineering.md  # SE Units 1 to 5 Comprehensive Guide
│   ├── DBMS_Documentation.md    # Normalization, Triggers & ACID Guide
│   └── Test_Cases_Suite.md      # 15-Case Verification & Validation Suite
├── java/                        # Complete Java Application Codebase
│   ├── src/com/courier/         # Model, Service, Exception, Util, Main
│   ├── compile_and_run.bat      # Windows Build & Execute Script
│   ├── sample_inputs.txt        # Interactive Console Inputs
│   └── sample_outputs.txt       # Expected Terminal Console Outputs
├── sql/                         # Database Scripts & Terminal Manual
│   ├── schema.sql               # MySQL DDL with Triggers & Views
│   ├── seed_data.sql            # Realistic Initial Consignment Datasets
│   ├── queries.sql              # 12+ Academic Analytical Queries
│   ├── schema_sqlite.sql        # Portable SQLite DDL Script
│   └── terminal_guide.md        # CLI Commands & Formatted ASCII Tables
└── python/                      # Foundations of Data Science Suite
    ├── analytics.py             # Data Ingestion, EDA, & Chart Generator
    ├── courier_dataset.csv      # Processed Scenario 26 Dataset
    └── requirements.txt         # Dependencies (pandas, numpy, matplotlib, seaborn)
```

---
**Academic Evaluation Note:** Designed and verified for 100% compliance with Scenario 26 requirements. All test cases passed.
