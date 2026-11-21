-- ============================================================================
-- COURIER AND PARCEL TRACKING MANAGEMENT SYSTEM (Scenario 26)
-- Database Management Systems (25ITT31)
-- Student: Dharshan S | Reg No: 732925ITR026 | Class: 25IT3A
-- Department of Information Technology, Velalar College of Engineering and Technology
-- Database Schema Definition (MySQL 8.0+ Compatible)
-- ============================================================================

DROP DATABASE IF EXISTS courier_db;
CREATE DATABASE courier_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE courier_db;

-- ----------------------------------------------------------------------------
-- Table 1: CUSTOMERS
-- Stores customer information (senders and receivers)
-- ----------------------------------------------------------------------------
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_phone (phone),
    INDEX idx_customer_city (city)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 2: DELIVERY_PERSONNEL
-- Stores field delivery agents, assigned zones, and vehicles
-- ----------------------------------------------------------------------------
CREATE TABLE delivery_personnel (
    personnel_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    vehicle_type ENUM('Motorcycle', 'Van', 'Bicycle', 'EV-Scooter') DEFAULT 'Motorcycle',
    vehicle_number VARCHAR(20) NOT NULL,
    assigned_zone VARCHAR(50) NOT NULL,
    active_deliveries INT DEFAULT 0,
    status ENUM('Available', 'On Delivery', 'On Leave') DEFAULT 'Available',
    rating DECIMAL(2,1) DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_personnel_zone (assigned_zone),
    INDEX idx_personnel_status (status)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 3: PARCELS
-- Stores parcel details, pricing, route category, and current status
-- ----------------------------------------------------------------------------
CREATE TABLE parcels (
    parcel_id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(30) NOT NULL UNIQUE,
    sender_id INT NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(15) NOT NULL,
    receiver_address TEXT NOT NULL,
    destination_city VARCHAR(50) NOT NULL,
    destination_pincode VARCHAR(10) NOT NULL,
    parcel_type ENUM('Document', 'Electronics', 'Clothing', 'Fragile', 'General Goods') DEFAULT 'General Goods',
    weight_kg DECIMAL(6,2) NOT NULL CHECK (weight_kg > 0),
    distance_category ENUM('Local', 'Regional', 'National', 'International') NOT NULL,
    service_type ENUM('Standard', 'Express', 'Same-Day') NOT NULL,
    base_charge DECIMAL(8,2) NOT NULL,
    tax_amount DECIMAL(8,2) NOT NULL,
    total_charge DECIMAL(8,2) NOT NULL,
    current_status ENUM('Booked', 'In Transit', 'Out for Delivery', 'Delivered', 'Returned') DEFAULT 'Booked',
    assigned_personnel_id INT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery TIMESTAMP NOT NULL,
    actual_delivery TIMESTAMP NULL,
    FOREIGN KEY (sender_id) REFERENCES customers(customer_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (assigned_personnel_id) REFERENCES delivery_personnel(personnel_id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_tracking_no (tracking_number),
    INDEX idx_current_status (current_status),
    INDEX idx_destination_city (destination_city)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 4: TRACKING_HISTORY
-- Audit log of status transitions and physical transit checkpoints
-- ----------------------------------------------------------------------------
CREATE TABLE tracking_history (
    update_id INT AUTO_INCREMENT PRIMARY KEY,
    parcel_id INT NOT NULL,
    status ENUM('Booked', 'In Transit', 'Out for Delivery', 'Delivered', 'Returned') NOT NULL,
    location VARCHAR(100) NOT NULL,
    notes VARCHAR(255) NULL,
    updated_by VARCHAR(50) DEFAULT 'System',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parcel_id) REFERENCES parcels(parcel_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_history_parcel (parcel_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 5: DELIVERY_ATTEMPTS
-- Tracks each door delivery attempt and reasons for unsuccessful deliveries
-- ----------------------------------------------------------------------------
CREATE TABLE delivery_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    parcel_id INT NOT NULL,
    personnel_id INT NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attempt_status ENUM('Successful', 'Failed') NOT NULL,
    failure_reason ENUM('Customer Unavailable', 'Incorrect Address', 'Door Locked', 'Customer Requested Reschedule', 'Refused Delivery', 'Weather/Traffic Delay') NULL,
    remarks TEXT NULL,
    rescheduled_date DATE NULL,
    FOREIGN KEY (parcel_id) REFERENCES parcels(parcel_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (personnel_id) REFERENCES delivery_personnel(personnel_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_attempt_parcel (parcel_id)
) ENGINE=InnoDB;

-- ============================================================================
-- TRIGGERS FOR AUTOMATION (DBMS Unit 2 & Unit 4)
-- ============================================================================

-- Trigger 1: Automatically add initial entry to tracking_history upon parcel booking
DELIMITER //
CREATE TRIGGER trg_parcel_after_insert
AFTER INSERT ON parcels
FOR EACH ROW
BEGIN
    INSERT INTO tracking_history (parcel_id, status, location, notes, updated_by)
    VALUES (NEW.parcel_id, NEW.current_status, 'Origin Sorting Hub, Erode', 'Parcel booked and manifest created', 'System');
END //
DELIMITER ;

-- Trigger 2: Automatically log tracking history on status update & increment/decrement active deliveries
DELIMITER //
CREATE TRIGGER trg_parcel_after_update
AFTER UPDATE ON parcels
FOR EACH ROW
BEGIN
    IF OLD.current_status <> NEW.current_status THEN
        INSERT INTO tracking_history (parcel_id, status, location, notes, updated_by)
        VALUES (
            NEW.parcel_id, 
            NEW.current_status, 
            CASE 
                WHEN NEW.current_status = 'In Transit' THEN 'Transit Hub - Regional Center'
                WHEN NEW.current_status = 'Out for Delivery' THEN CONCAT(NEW.destination_city, ' Local Distribution Hub')
                WHEN NEW.current_status = 'Delivered' THEN CONCAT(NEW.destination_city, ' - Recipient Address')
                WHEN NEW.current_status = 'Returned' THEN 'Returned to Origin Hub - Erode'
                ELSE 'Central Logistics Hub'
            END,
            CONCAT('Status updated from ', OLD.current_status, ' to ', NEW.current_status),
            'Automated Dispatcher'
        );
    END IF;

    -- Adjust active deliveries for personnel
    IF OLD.current_status <> 'Delivered' AND NEW.current_status = 'Delivered' AND NEW.assigned_personnel_id IS NOT NULL THEN
        UPDATE delivery_personnel 
        SET active_deliveries = GREATEST(0, active_deliveries - 1)
        WHERE personnel_id = NEW.assigned_personnel_id;
    END IF;
    
    IF OLD.assigned_personnel_id IS NULL AND NEW.assigned_personnel_id IS NOT NULL AND NEW.current_status IN ('In Transit', 'Out for Delivery') THEN
        UPDATE delivery_personnel 
        SET active_deliveries = active_deliveries + 1
        WHERE personnel_id = NEW.assigned_personnel_id;
    END IF;
END //
DELIMITER ;

-- ============================================================================
-- VIEWS (DBMS Unit 2: Views and Intermediate SQL)
-- ============================================================================

-- View 1: Pending Deliveries Dashboard
CREATE OR REPLACE VIEW vw_pending_deliveries AS
SELECT 
    p.parcel_id,
    p.tracking_number,
    c.name AS sender_name,
    p.receiver_name,
    p.destination_city,
    p.service_type,
    p.current_status,
    p.estimated_delivery,
    dp.name AS delivery_agent,
    dp.phone AS agent_phone
FROM parcels p
JOIN customers c ON p.sender_id = c.customer_id
LEFT JOIN delivery_personnel dp ON p.assigned_personnel_id = dp.personnel_id
WHERE p.current_status IN ('Booked', 'In Transit', 'Out for Delivery');

-- View 2: Delivery Personnel Workload and Performance Summary
CREATE OR REPLACE VIEW vw_personnel_workload AS
SELECT 
    dp.personnel_id,
    dp.name,
    dp.assigned_zone,
    dp.vehicle_type,
    dp.status,
    dp.active_deliveries,
    COUNT(p.parcel_id) AS total_assigned_parcels,
    SUM(CASE WHEN p.current_status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_count,
    SUM(CASE WHEN p.current_status = 'Returned' THEN 1 ELSE 0 END) AS returned_count,
    ROUND((SUM(CASE WHEN p.current_status = 'Delivered' THEN 1 ELSE 0 END) / NULLIF(COUNT(p.parcel_id), 0)) * 100, 2) AS success_rate_percent
FROM delivery_personnel dp
LEFT JOIN parcels p ON dp.personnel_id = p.assigned_personnel_id
GROUP BY dp.personnel_id, dp.name, dp.assigned_zone, dp.vehicle_type, dp.status, dp.active_deliveries;
