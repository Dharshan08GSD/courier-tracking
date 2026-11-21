-- ============================================================================
-- COURIER AND PARCEL TRACKING MANAGEMENT SYSTEM (Scenario 26)
-- Comprehensive SQL Queries Suite (DBMS 25ITT31 - Units 1, 2, 3, 4)
-- Student: Dharshan S | Reg No: 732925ITR026 | Class: 25IT3A
-- Velalar College of Engineering and Technology, Erode - 12
-- ============================================================================

USE courier_db;

-- ----------------------------------------------------------------------------
-- QUERY 1: Basic Retrieval with Column Aliasing and Filter
-- Retrieve all Express & Same-Day parcels booked with weight > 2.0 kg
-- (DBMS Unit 2: Basic Operations, Filtering)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- QUERY 2: Inner Joins Across 3 Tables
-- Display Parcel details with Sender Customer Details and Assigned Courier Agent
-- (DBMS Unit 2: Intermediate SQL - Joins)
-- ----------------------------------------------------------------------------
SELECT 
    p.tracking_number AS Tracking_No,
    c.name AS Sender_Name,
    c.phone AS Sender_Phone,
    p.receiver_name AS Receiver_Name,
    p.destination_city AS Destination,
    p.service_type AS Service,
    COALESCE(dp.name, 'Not Assigned') AS Courier_Agent,
    COALESCE(dp.vehicle_type, 'N/A') AS Transport_Mode,
    p.current_status AS Current_Status
FROM parcels p
INNER JOIN customers c ON p.sender_id = c.customer_id
LEFT JOIN delivery_personnel dp ON p.assigned_personnel_id = dp.personnel_id
ORDER BY p.booking_date DESC;

-- ----------------------------------------------------------------------------
-- QUERY 3: Aggregation & Grouping with HAVING
-- Find total revenue, average weight, and parcel count by Distance Category
-- Filter categories generating more than Rs. 500 total revenue
-- (DBMS Unit 2: Aggregate Functions - SUM, AVG, COUNT, HAVING)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- QUERY 4: Subquery (Scalar and Correlated)
-- Find all parcels whose delivery charge is strictly greater than the average
-- charge of their respective parcel type
-- (DBMS Unit 2: Nested Subqueries)
-- ----------------------------------------------------------------------------
SELECT 
    p1.tracking_number,
    p1.parcel_type,
    p1.destination_city,
    p1.weight_kg,
    p1.total_charge
FROM parcels p1
WHERE p1.total_charge > (
    SELECT AVG(p2.total_charge)
    FROM parcels p2
    WHERE p2.parcel_type = p1.parcel_type
)
ORDER BY p1.parcel_type, p1.total_charge DESC;

-- ----------------------------------------------------------------------------
-- QUERY 5: Nested Subquery with IN & EXISTS
-- Find all Delivery Personnel who have handled at least one Express parcel
-- (DBMS Unit 2: Advanced SQL - EXISTS)
-- ----------------------------------------------------------------------------
SELECT 
    dp.personnel_id,
    dp.name AS Agent_Name,
    dp.phone,
    dp.assigned_zone,
    dp.vehicle_type
FROM delivery_personnel dp
WHERE EXISTS (
    SELECT 1 
    FROM parcels p 
    WHERE p.assigned_personnel_id = dp.personnel_id 
      AND p.service_type = 'Express'
);

-- ----------------------------------------------------------------------------
-- QUERY 6: Left Outer Join to Identify Inactive Entities
-- Find all registered customers who have never booked an International or National parcel
-- (DBMS Unit 2: Set Operations / Joins)
-- ----------------------------------------------------------------------------
SELECT 
    c.customer_id,
    c.name AS Customer_Name,
    c.phone,
    c.city,
    COUNT(p.parcel_id) AS National_Intl_Bookings
FROM customers c
LEFT JOIN parcels p ON c.customer_id = p.sender_id 
    AND p.distance_category IN ('National', 'International')
GROUP BY c.customer_id, c.name, c.phone, c.city
HAVING COUNT(p.parcel_id) = 0;

-- ----------------------------------------------------------------------------
-- QUERY 7: Window Function (DENSE_RANK / ROW_NUMBER)
-- Rank parcels by weight within each destination city
-- (DBMS Unit 2 & 3: Query Optimization & Analytical Functions)
-- ----------------------------------------------------------------------------
SELECT 
    p.tracking_number,
    p.destination_city,
    p.parcel_type,
    p.weight_kg,
    p.total_charge,
    DENSE_RANK() OVER (
        PARTITION BY p.destination_city 
        ORDER BY p.weight_kg DESC
    ) AS Weight_Rank_In_City
FROM parcels p;

-- ----------------------------------------------------------------------------
-- QUERY 8: Audit Trail Inspection with Self-Join / Chronology
-- Trace the complete status change lifecycle of parcel TRK-2026-8801
-- (DBMS Unit 1 & Unit 4: Transaction & Audit Tracking)
-- ----------------------------------------------------------------------------
SELECT 
    th.update_id AS Step_ID,
    p.tracking_number,
    th.status AS Status_Reached,
    th.location AS Checkpoint,
    th.notes AS Action_Remarks,
    th.updated_by AS Updated_By,
    th.timestamp AS Checkpoint_Time
FROM tracking_history th
JOIN parcels p ON th.parcel_id = p.parcel_id
WHERE p.tracking_number = 'TRK-2026-8801'
ORDER BY th.timestamp ASC;

-- ----------------------------------------------------------------------------
-- QUERY 9: Failed Delivery Attempts and Exception Analysis
-- List all parcels that suffered failed delivery attempts along with root causes
-- (Functional Requirement 7)
-- ----------------------------------------------------------------------------
SELECT 
    da.attempt_id,
    p.tracking_number,
    p.receiver_name,
    p.destination_city,
    dp.name AS Agent_Name,
    da.failure_reason,
    da.remarks,
    da.rescheduled_date
FROM delivery_attempts da
JOIN parcels p ON da.parcel_id = p.parcel_id
JOIN delivery_personnel dp ON da.personnel_id = dp.personnel_id
WHERE da.attempt_status = 'Failed'
ORDER BY da.attempt_date DESC;

-- ----------------------------------------------------------------------------
-- QUERY 10: Workload and Efficiency View Execution
-- Query the pre-compiled View for Delivery Personnel performance metrics
-- (Functional Requirement 8 & DBMS Unit 2: Views)
-- ----------------------------------------------------------------------------
SELECT 
    personnel_id AS ID,
    name AS Agent,
    assigned_zone AS Zone,
    vehicle_type AS Vehicle,
    active_deliveries AS Active_Load,
    total_assigned_parcels AS Total_Assigned,
    delivered_count AS Completed,
    returned_count AS Returned,
    COALESCE(success_rate_percent, 0.0) AS Success_Pct
FROM vw_personnel_workload
ORDER BY success_rate_percent DESC, total_assigned_parcels DESC;

-- ----------------------------------------------------------------------------
-- QUERY 11: Revenue and Tax Analysis by Service Type
-- Calculate total revenue, GST component (18%), and profit margin estimate
-- ----------------------------------------------------------------------------
SELECT 
    service_type,
    COUNT(*) AS Parcel_Volume,
    ROUND(SUM(base_charge), 2) AS Net_Base_Total,
    ROUND(SUM(tax_amount), 2) AS GST_Collected_18Pct,
    ROUND(SUM(total_charge), 2) AS Gross_Revenue,
    ROUND(AVG(total_charge), 2) AS Avg_Ticket_Size
FROM parcels
GROUP BY service_type
ORDER BY Gross_Revenue DESC;

-- ----------------------------------------------------------------------------
-- QUERY 12: On-Time vs Delayed Delivery Classification
-- Identify delivered parcels and check whether they arrived before or after SLA
-- (DBMS Unit 2: CASE Conditional Expressions)
-- ----------------------------------------------------------------------------
SELECT 
    tracking_number,
    service_type,
    destination_city,
    booking_date,
    estimated_delivery AS Promised_SLA,
    actual_delivery AS Actual_Arrival,
    CASE 
        WHEN actual_delivery IS NULL THEN 'Delivery In Progress'
        WHEN actual_delivery <= estimated_delivery THEN 'ON TIME (Compliant)'
        ELSE 'DELAYED (SLA Breach)'
    END AS SLA_Status,
    CASE 
        WHEN actual_delivery > estimated_delivery 
        THEN TIMESTAMPDIFF(MINUTE, estimated_delivery, actual_delivery) 
        ELSE 0 
    END AS Delay_Minutes
FROM parcels
WHERE current_status IN ('Delivered', 'Out for Delivery')
ORDER BY booking_date DESC;
