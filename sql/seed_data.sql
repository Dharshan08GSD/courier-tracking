-- ============================================================================
-- COURIER AND PARCEL TRACKING MANAGEMENT SYSTEM (Scenario 26)
-- Seed Data Script
-- Student: Dharshan S | Reg No: 732925ITR026 | Class: 25IT3A
-- Velalar College of Engineering and Technology
-- ============================================================================

USE courier_db;

-- ----------------------------------------------------------------------------
-- 1. Insert Sample Customers
-- ----------------------------------------------------------------------------
INSERT INTO customers (customer_id, name, phone, email, address, city, pincode) VALUES
(1, 'Arun Kumar', '9842112345', 'arunkumar@gmail.com', '14 Gandhipuram 4th Cross', 'Coimbatore', '641012'),
(2, 'Deepa Mohan', '9842223456', 'deepa.m@outlook.com', '45 Perundurai Road', 'Erode', '638011'),
(3, 'Karthik Raja', '9842334567', 'karthik.raja@yahoo.com', '78 Anna Salai, T. Nagar', 'Chennai', '600017'),
(4, 'Priya Senthil', '9842445678', 'priyas@gmail.com', '12 Fairlands Main Road', 'Salem', '636016'),
(5, 'Venkatesh Murugan', '9842556789', 'venkat.m@gmail.com', '90 West Car Street, Chidambaram Nagar', 'Tiruppur', '641604'),
(6, 'Lavanya Natarajan', '9842667890', 'lavanya.n@gmail.com', '33 K.K. Nagar', 'Madurai', '625020'),
(7, 'Suresh Babu', '9842778901', 'sureshbabu@gmail.com', '102 100ft Road, Indiranagar', 'Bangalore', '560038'),
(8, 'Meenakshi Sundaram', '9842889012', 'meena.sundaram@gmail.com', '54 North Bypass Road', 'Tirunelveli', '627001'),
(9, 'Rajesh Kannan', '9842990123', 'rajesh.k@gmail.com', '21 Junction Road', 'Trichy', '620001'),
(10, 'Dharshan S', '9842001122', 'dharshan.732925itr026@vcet.ac.in', '26 College Road, Thindal', 'Erode', '638012');

-- ----------------------------------------------------------------------------
-- 2. Insert Delivery Personnel
-- ----------------------------------------------------------------------------
INSERT INTO delivery_personnel (personnel_id, name, phone, vehicle_type, vehicle_number, assigned_zone, active_deliveries, status, rating) VALUES
(1, 'Manojkumar P', '9789111222', 'Motorcycle', 'TN-33-AX-4521', 'Erode Central', 3, 'On Delivery', 4.8),
(2, 'Sathish Kumar R', '9789222333', 'Van', 'TN-38-BZ-1984', 'Coimbatore North', 2, 'On Delivery', 4.9),
(3, 'Praveen Wilson', '9789333444', 'EV-Scooter', 'TN-01-EE-7762', 'Chennai South', 1, 'On Delivery', 4.7),
(4, 'Dinesh Velu', '9789444555', 'Motorcycle', 'TN-27-DY-3310', 'Salem West', 0, 'Available', 4.6),
(5, 'Ganesh Moorthy', '9789555666', 'Van', 'KA-05-MM-9102', 'Bangalore Tech Zone', 0, 'Available', 4.9);

-- ----------------------------------------------------------------------------
-- 3. Insert Parcels with varying routes, weights, and statuses
-- ----------------------------------------------------------------------------
INSERT INTO parcels (parcel_id, tracking_number, sender_id, receiver_name, receiver_phone, receiver_address, destination_city, destination_pincode, parcel_type, weight_kg, distance_category, service_type, base_charge, tax_amount, total_charge, current_status, assigned_personnel_id, booking_date, estimated_delivery, actual_delivery) VALUES
(1, 'TRK-2026-8801', 1, 'Sangeetha R', '9943110001', '12 Cross Cut Rd, Gandhipuram', 'Coimbatore', '641012', 'Document', 0.50, 'Local', 'Standard', 50.00, 9.00, 59.00, 'Delivered', 2, '2026-11-15 09:30:00', '2026-11-16 18:00:00', '2026-11-16 14:20:00'),
(2, 'TRK-2026-8802', 2, 'Gokulnath C', '9943110002', '89 Velalar Nagar, Thindal', 'Erode', '638012', 'General Goods', 2.80, 'Local', 'Same-Day', 180.00, 32.40, 212.40, 'Delivered', 1, '2026-11-16 10:15:00', '2026-11-16 20:00:00', '2026-11-16 19:40:00'),
(3, 'TRK-2026-8803', 3, 'Kavitha Devi', '9943110003', '54 OMR Road, Thoraipakkam', 'Chennai', '600097', 'Electronics', 4.20, 'Regional', 'Express', 420.00, 75.60, 495.60, 'Delivered', 3, '2026-11-17 11:00:00', '2026-11-18 16:00:00', '2026-11-18 15:10:00'),
(4, 'TRK-2026-8804', 4, 'Balaji Krishnan', '9943110004', '71 Meyyanur Bypass', 'Salem', '636004', 'Clothing', 1.80, 'Regional', 'Standard', 140.00, 25.20, 165.20, 'Delivered', 4, '2026-11-17 14:00:00', '2026-11-19 18:00:00', '2026-11-19 12:30:00'),
(5, 'TRK-2026-8805', 10, 'Naveen Kumar', '9943110005', '38 Koramangala 5th Block', 'Bangalore', '560095', 'Electronics', 6.50, 'National', 'Express', 780.00, 140.40, 920.40, 'Out for Delivery', 5, '2026-11-19 09:00:00', '2026-11-21 16:00:00', NULL),
(6, 'TRK-2026-8806', 5, 'Anitha Raghu', '9943110006', '19 College Road, Kumaran Nagar', 'Tiruppur', '641602', 'Fragile', 3.00, 'Local', 'Express', 250.00, 45.00, 295.00, 'In Transit', 1, '2026-11-20 08:30:00', '2026-11-21 17:00:00', NULL),
(7, 'TRK-2026-8807', 6, 'Saravanan M', '9943110007', '104 Madurai Bye-Pass', 'Madurai', '625016', 'General Goods', 8.20, 'Regional', 'Standard', 380.00, 68.40, 448.40, 'In Transit', 2, '2026-11-20 11:20:00', '2026-11-22 18:00:00', NULL),
(8, 'TRK-2026-8808', 7, 'Harish Shankar', '9943110008', '405 Electronic City Phase 1', 'Bangalore', '560100', 'Document', 0.30, 'National', 'Express', 220.00, 39.60, 259.60, 'Out for Delivery', 5, '2026-11-20 12:00:00', '2026-11-21 15:00:00', NULL),
(9, 'TRK-2026-8809', 2, 'Revathi Sundar', '9943110009', '15 Brough Road', 'Erode', '638001', 'Clothing', 1.50, 'Local', 'Same-Day', 150.00, 27.00, 177.00, 'Out for Delivery', 1, '2026-11-21 07:30:00', '2026-11-21 14:00:00', NULL),
(10, 'TRK-2026-8810', 8, 'Murugan K', '9943110010', '63 Palayamkottai High Road', 'Tirunelveli', '627002', 'Fragile', 5.00, 'Regional', 'Standard', 320.00, 57.60, 377.60, 'Booked', NULL, '2026-11-21 08:45:00', '2026-11-23 18:00:00', NULL),
(11, 'TRK-2026-8811', 9, 'Divya Prakash', '9943110011', '82 Thillai Nagar', 'Trichy', '620018', 'Electronics', 3.80, 'Regional', 'Express', 390.00, 70.20, 460.20, 'Returned', 4, '2026-11-16 10:00:00', '2026-11-18 17:00:00', NULL),
(12, 'TRK-2026-8812', 10, 'Raghavan V', '9943110012', '9 Marina Beach Road', 'Chennai', '600004', 'Document', 0.40, 'Regional', 'Express', 180.00, 32.40, 212.40, 'Booked', NULL, '2026-11-21 09:15:00', '2026-11-22 17:00:00', NULL);

-- ----------------------------------------------------------------------------
-- 4. Insert Tracking History Logs
-- ----------------------------------------------------------------------------
INSERT INTO tracking_history (parcel_id, status, location, notes, updated_by, timestamp) VALUES
(1, 'Booked', 'Origin Sorting Hub, Coimbatore', 'Parcel booked and manifest created', 'System', '2026-11-15 09:30:00'),
(1, 'In Transit', 'Transit Hub, Coimbatore Central', 'Departed sorting center', 'System', '2026-11-15 14:00:00'),
(1, 'Out for Delivery', 'Gandhipuram Distribution Hub', 'Assigned to courier agent Sathish', 'Dispatcher', '2026-11-16 08:30:00'),
(1, 'Delivered', 'Recipient Address, Gandhipuram', 'Delivered safely to recipient', 'Agent-Sathish', '2026-11-16 14:20:00'),

(2, 'Booked', 'Origin Sorting Hub, Erode', 'Same-Day manifest registered', 'System', '2026-11-16 10:15:00'),
(2, 'Out for Delivery', 'Erode Central Hub', 'Handed over to courier agent Manojkumar', 'Dispatcher', '2026-11-16 13:00:00'),
(2, 'Delivered', 'Thindal, Erode', 'Delivered to recipient with OTP signature', 'Agent-Manoj', '2026-11-16 19:40:00'),

(3, 'Booked', 'Origin Hub, Chennai T.Nagar', 'Express parcel booked', 'System', '2026-11-17 11:00:00'),
(3, 'In Transit', 'Chennai South Transit Center', 'Passed security scan and sorting', 'System', '2026-11-17 16:30:00'),
(3, 'Out for Delivery', 'Thoraipakkam Delivery Station', 'Out with agent Praveen', 'Dispatcher', '2026-11-18 09:00:00'),
(3, 'Delivered', 'OMR Road, Chennai', 'Delivered to security desk', 'Agent-Praveen', '2026-11-18 15:10:00'),

(5, 'Booked', 'Origin Hub, Erode', 'Express electronics package booked by Dharshan', 'System', '2026-11-19 09:00:00'),
(5, 'In Transit', 'Inter-State Logistics Hub, Hosur', 'Cross-border clearance completed', 'System', '2026-11-20 03:00:00'),
(5, 'Out for Delivery', 'Bangalore Koramangala Hub', 'Out for delivery with agent Ganesh', 'Dispatcher', '2026-11-21 08:00:00'),

(11, 'Booked', 'Origin Hub, Trichy', 'Electronics item booked', 'System', '2026-11-16 10:00:00'),
(11, 'In Transit', 'Salem Transshipment Hub', 'In route to delivery point', 'System', '2026-11-17 04:00:00'),
(11, 'Out for Delivery', 'Salem West Delivery Station', 'Out with agent Dinesh', 'Dispatcher', '2026-11-17 09:00:00'),
(11, 'Returned', 'Salem Transshipment Hub', 'Returned to origin after 2 unsuccessful attempts', 'Dispatcher', '2026-11-18 16:00:00');

-- ----------------------------------------------------------------------------
-- 5. Insert Delivery Attempts
-- ----------------------------------------------------------------------------
INSERT INTO delivery_attempts (attempt_id, parcel_id, personnel_id, attempt_date, attempt_status, failure_reason, remarks, rescheduled_date) VALUES
(1, 11, 4, '2026-11-17 11:30:00', 'Failed', 'Customer Unavailable', 'Phone was unreachable; door was locked', '2026-11-18'),
(2, 11, 4, '2026-11-18 14:15:00', 'Failed', 'Door Locked', 'Nobody available at the premises for second attempt', NULL),
(3, 5, 5, '2026-11-20 17:30:00', 'Failed', 'Customer Requested Reschedule', 'Customer asked for morning delivery between 9-11 AM', '2026-11-21');
