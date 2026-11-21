/**
 * ============================================================================
 * SWIFTTRACK: In-Browser Relational Data Engine & Persistence
 * Course: 25ITT31 - Database Management Systems
 * Student: Dharshan S | Reg: 732925ITR026 | Class: 25IT3A
 * ============================================================================
 */

const STORAGE_KEY = 'swifttrack_courier_db_v1';

class DatabaseEngine {
    constructor() {
        this.data = this.loadState();
    }

    loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error loading local storage state", e);
            }
        }
        return this.getDefaultData();
    }

    saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }

    getDefaultData() {
        return {
            customers: [
                { customer_id: 1, name: "Arun Kumar", phone: "9842112345", email: "arun@gmail.com", address: "14 Gandhipuram 4th Cross", city: "Coimbatore", pincode: "641012" },
                { customer_id: 2, name: "Deepa Mohan", phone: "9842223456", email: "deepa.m@outlook.com", address: "45 Perundurai Road", city: "Erode", pincode: "638011" },
                { customer_id: 3, name: "Karthik Raja", phone: "9842334567", email: "karthik.r@yahoo.com", address: "78 Anna Salai, T. Nagar", city: "Chennai", pincode: "600017" },
                { customer_id: 4, name: "Priya Senthil", phone: "9842445678", email: "priyas@gmail.com", address: "12 Fairlands Main Road", city: "Salem", pincode: "636016" },
                { customer_id: 5, name: "Venkatesh Murugan", phone: "9842556789", email: "venkat.m@gmail.com", address: "90 West Car Street", city: "Tiruppur", pincode: "641604" },
                { customer_id: 6, name: "Lavanya Natarajan", phone: "9842667890", email: "lavanya.n@gmail.com", address: "33 K.K. Nagar", city: "Madurai", pincode: "625020" },
                { customer_id: 7, name: "Suresh Babu", phone: "9842778901", email: "sureshbabu@gmail.com", address: "102 100ft Road, Indiranagar", city: "Bangalore", pincode: "560038" },
                { customer_id: 8, name: "Meenakshi Sundaram", phone: "9842889012", email: "meena.s@gmail.com", address: "54 North Bypass Road", city: "Tirunelveli", pincode: "627001" },
                { customer_id: 9, name: "Rajesh Kannan", phone: "9842990123", email: "rajesh.k@gmail.com", address: "21 Junction Road", city: "Trichy", pincode: "620001" },
                { customer_id: 10, name: "Dharshan S", phone: "9842001122", email: "dharshan.732925itr026@vcet.ac.in", address: "26 College Road, Thindal", city: "Erode", pincode: "638012" }
            ],
            delivery_personnel: [
                { personnel_id: 1, name: "Manojkumar P", phone: "9789111222", vehicle_type: "Motorcycle", vehicle_number: "TN-33-AX-4521", assigned_zone: "Erode Central", active_deliveries: 2, status: "On Delivery", rating: 4.8 },
                { personnel_id: 2, name: "Sathish Kumar R", phone: "9789222333", vehicle_type: "Van", vehicle_number: "TN-38-BZ-1984", assigned_zone: "Coimbatore North", active_deliveries: 1, status: "On Delivery", rating: 4.9 },
                { personnel_id: 3, name: "Praveen Wilson", phone: "9789333444", vehicle_type: "EV-Scooter", vehicle_number: "TN-01-EE-7762", assigned_zone: "Chennai South", active_deliveries: 1, status: "On Delivery", rating: 4.7 },
                { personnel_id: 4, name: "Dinesh Velu", phone: "9789444555", vehicle_type: "Motorcycle", vehicle_number: "TN-27-DY-3310", assigned_zone: "Salem West", active_deliveries: 0, status: "Available", rating: 4.6 },
                { personnel_id: 5, name: "Ganesh Moorthy", phone: "9789555666", vehicle_type: "Van", vehicle_number: "KA-05-MM-9102", assigned_zone: "Bangalore Tech Zone", active_deliveries: 1, status: "On Delivery", rating: 4.9 }
            ],
            parcels: [
                {
                    parcel_id: 1,
                    tracking_number: "TRK-2026-8801",
                    sender_id: 1,
                    sender_name: "Arun Kumar",
                    receiver_name: "Sangeetha R",
                    receiver_phone: "9943110001",
                    receiver_address: "12 Cross Cut Rd, Gandhipuram",
                    destination_city: "Coimbatore",
                    destination_pincode: "641012",
                    parcel_type: "Document",
                    weight_kg: 0.50,
                    distance_category: "Local",
                    service_type: "Standard",
                    base_charge: 50.00,
                    tax_amount: 9.00,
                    total_charge: 59.00,
                    current_status: "Delivered",
                    assigned_personnel_id: 2,
                    assigned_personnel_name: "Sathish Kumar R",
                    booking_date: "2026-11-15 09:30",
                    estimated_delivery: "2026-11-16 18:00",
                    actual_delivery: "2026-11-16 14:20"
                },
                {
                    parcel_id: 2,
                    tracking_number: "TRK-2026-8802",
                    sender_id: 2,
                    sender_name: "Deepa Mohan",
                    receiver_name: "Gokulnath C",
                    receiver_phone: "9943110002",
                    receiver_address: "89 Velalar Nagar, Thindal",
                    destination_city: "Erode",
                    destination_pincode: "638012",
                    parcel_type: "General Goods",
                    weight_kg: 2.80,
                    distance_category: "Local",
                    service_type: "Same-Day",
                    base_charge: 180.00,
                    tax_amount: 32.40,
                    total_charge: 212.40,
                    current_status: "Delivered",
                    assigned_personnel_id: 1,
                    assigned_personnel_name: "Manojkumar P",
                    booking_date: "2026-11-16 10:15",
                    estimated_delivery: "2026-11-16 20:00",
                    actual_delivery: "2026-11-16 19:40"
                },
                {
                    parcel_id: 3,
                    tracking_number: "TRK-2026-8803",
                    sender_id: 3,
                    sender_name: "Karthik Raja",
                    receiver_name: "Kavitha Devi",
                    receiver_phone: "9943110003",
                    receiver_address: "54 OMR Road, Thoraipakkam",
                    destination_city: "Chennai",
                    destination_pincode: "600097",
                    parcel_type: "Electronics",
                    weight_kg: 4.20,
                    distance_category: "Regional",
                    service_type: "Express",
                    base_charge: 420.00,
                    tax_amount: 75.60,
                    total_charge: 495.60,
                    current_status: "Delivered",
                    assigned_personnel_id: 3,
                    assigned_personnel_name: "Praveen Wilson",
                    booking_date: "2026-11-17 11:00",
                    estimated_delivery: "2026-11-18 16:00",
                    actual_delivery: "2026-11-18 15:10"
                },
                {
                    parcel_id: 4,
                    tracking_number: "TRK-2026-8804",
                    sender_id: 4,
                    sender_name: "Priya Senthil",
                    receiver_name: "Balaji Krishnan",
                    receiver_phone: "9943110004",
                    receiver_address: "71 Meyyanur Bypass",
                    destination_city: "Salem",
                    destination_pincode: "636004",
                    parcel_type: "Clothing",
                    weight_kg: 1.80,
                    distance_category: "Regional",
                    service_type: "Standard",
                    base_charge: 140.00,
                    tax_amount: 25.20,
                    total_charge: 165.20,
                    current_status: "Delivered",
                    assigned_personnel_id: 4,
                    assigned_personnel_name: "Dinesh Velu",
                    booking_date: "2026-11-17 14:00",
                    estimated_delivery: "2026-11-19 18:00",
                    actual_delivery: "2026-11-19 12:30"
                },
                {
                    parcel_id: 5,
                    tracking_number: "TRK-2026-8805",
                    sender_id: 10,
                    sender_name: "Dharshan S",
                    receiver_name: "Naveen Kumar",
                    receiver_phone: "9943110005",
                    receiver_address: "38 Koramangala 5th Block",
                    destination_city: "Bangalore",
                    destination_pincode: "560095",
                    parcel_type: "Electronics",
                    weight_kg: 6.50,
                    distance_category: "National",
                    service_type: "Express",
                    base_charge: 780.00,
                    tax_amount: 140.40,
                    total_charge: 920.40,
                    current_status: "Out for Delivery",
                    assigned_personnel_id: 5,
                    assigned_personnel_name: "Ganesh Moorthy",
                    booking_date: "2026-11-19 09:00",
                    estimated_delivery: "2026-11-21 16:00",
                    actual_delivery: null
                },
                {
                    parcel_id: 6,
                    tracking_number: "TRK-2026-8806",
                    sender_id: 5,
                    sender_name: "Venkatesh Murugan",
                    receiver_name: "Anitha Raghu",
                    receiver_phone: "9943110006",
                    receiver_address: "19 College Road, Kumaran Nagar",
                    destination_city: "Tiruppur",
                    destination_pincode: "641602",
                    parcel_type: "Fragile",
                    weight_kg: 3.00,
                    distance_category: "Local",
                    service_type: "Express",
                    base_charge: 250.00,
                    tax_amount: 45.00,
                    total_charge: 295.00,
                    current_status: "In Transit",
                    assigned_personnel_id: 1,
                    assigned_personnel_name: "Manojkumar P",
                    booking_date: "2026-11-20 08:30",
                    estimated_delivery: "2026-11-21 17:00",
                    actual_delivery: null
                },
                {
                    parcel_id: 7,
                    tracking_number: "TRK-2026-8807",
                    sender_id: 6,
                    sender_name: "Lavanya Natarajan",
                    receiver_name: "Saravanan M",
                    receiver_phone: "9943110007",
                    receiver_address: "104 Madurai Bye-Pass",
                    destination_city: "Madurai",
                    destination_pincode: "625016",
                    parcel_type: "General Goods",
                    weight_kg: 8.20,
                    distance_category: "Regional",
                    service_type: "Standard",
                    base_charge: 380.00,
                    tax_amount: 68.40,
                    total_charge: 448.40,
                    current_status: "In Transit",
                    assigned_personnel_id: 2,
                    assigned_personnel_name: "Sathish Kumar R",
                    booking_date: "2026-11-20 11:20",
                    estimated_delivery: "2026-11-22 18:00",
                    actual_delivery: null
                },
                {
                    parcel_id: 8,
                    tracking_number: "TRK-2026-8808",
                    sender_id: 7,
                    sender_name: "Suresh Babu",
                    receiver_name: "Harish Shankar",
                    receiver_phone: "9943110008",
                    receiver_address: "405 Electronic City Phase 1",
                    destination_city: "Bangalore",
                    destination_pincode: "560100",
                    parcel_type: "Document",
                    weight_kg: 0.30,
                    distance_category: "National",
                    service_type: "Express",
                    base_charge: 220.00,
                    tax_amount: 39.60,
                    total_charge: 259.60,
                    current_status: "Out for Delivery",
                    assigned_personnel_id: 5,
                    assigned_personnel_name: "Ganesh Moorthy",
                    booking_date: "2026-11-20 12:00",
                    estimated_delivery: "2026-11-21 15:00",
                    actual_delivery: null
                },
                {
                    parcel_id: 9,
                    tracking_number: "TRK-2026-8809",
                    sender_id: 2,
                    sender_name: "Deepa Mohan",
                    receiver_name: "Revathi Sundar",
                    receiver_phone: "9943110009",
                    receiver_address: "15 Brough Road",
                    destination_city: "Erode",
                    destination_pincode: "638001",
                    parcel_type: "Clothing",
                    weight_kg: 1.50,
                    distance_category: "Local",
                    service_type: "Same-Day",
                    base_charge: 150.00,
                    tax_amount: 27.00,
                    total_charge: 177.00,
                    current_status: "Out for Delivery",
                    assigned_personnel_id: 1,
                    assigned_personnel_name: "Manojkumar P",
                    booking_date: "2026-11-21 07:30",
                    estimated_delivery: "2026-11-21 14:00",
                    actual_delivery: null
                },
                {
                    parcel_id: 10,
                    tracking_number: "TRK-2026-8810",
                    sender_id: 8,
                    sender_name: "Meenakshi Sundaram",
                    receiver_name: "Murugan K",
                    receiver_phone: "9943110010",
                    receiver_address: "63 Palayamkottai High Road",
                    destination_city: "Tirunelveli",
                    destination_pincode: "627002",
                    parcel_type: "Fragile",
                    weight_kg: 5.00,
                    distance_category: "Regional",
                    service_type: "Standard",
                    base_charge: 320.00,
                    tax_amount: 57.60,
                    total_charge: 377.60,
                    current_status: "Booked",
                    assigned_personnel_id: null,
                    assigned_personnel_name: "Unassigned",
                    booking_date: "2026-11-21 08:45",
                    estimated_delivery: "2026-11-23 18:00",
                    actual_delivery: null
                },
                {
                    parcel_id: 11,
                    tracking_number: "TRK-2026-8811",
                    sender_id: 9,
                    sender_name: "Rajesh Kannan",
                    receiver_name: "Divya Prakash",
                    receiver_phone: "9943110011",
                    receiver_address: "82 Thillai Nagar",
                    destination_city: "Trichy",
                    destination_pincode: "620018",
                    parcel_type: "Electronics",
                    weight_kg: 3.80,
                    distance_category: "Regional",
                    service_type: "Express",
                    base_charge: 390.00,
                    tax_amount: 70.20,
                    total_charge: 460.20,
                    current_status: "Returned",
                    assigned_personnel_id: 4,
                    assigned_personnel_name: "Dinesh Velu",
                    booking_date: "2026-11-16 10:00",
                    estimated_delivery: "2026-11-18 17:00",
                    actual_delivery: null
                },
                {
                    parcel_id: 12,
                    tracking_number: "TRK-2026-8812",
                    sender_id: 10,
                    sender_name: "Dharshan S",
                    receiver_name: "Raghavan V",
                    receiver_phone: "9943110012",
                    receiver_address: "9 Marina Beach Road",
                    destination_city: "Chennai",
                    destination_pincode: "600004",
                    parcel_type: "Document",
                    weight_kg: 0.40,
                    distance_category: "Regional",
                    service_type: "Express",
                    base_charge: 180.00,
                    tax_amount: 32.40,
                    total_charge: 212.40,
                    current_status: "Booked",
                    assigned_personnel_id: null,
                    assigned_personnel_name: "Unassigned",
                    booking_date: "2026-11-21 09:15",
                    estimated_delivery: "2026-11-22 17:00",
                    actual_delivery: null
                }
            ],
            tracking_history: [
                { update_id: 1, tracking_number: "TRK-2026-8801", status: "Booked", location: "Origin Sorting Hub, Coimbatore", notes: "Parcel booked and manifest created", updated_by: "System", timestamp: "2026-11-15 09:30" },
                { update_id: 2, tracking_number: "TRK-2026-8801", status: "In Transit", location: "Transit Hub, Coimbatore Central", notes: "Departed sorting center", updated_by: "System", timestamp: "2026-11-15 14:00" },
                { update_id: 3, tracking_number: "TRK-2026-8801", status: "Out for Delivery", location: "Gandhipuram Distribution Hub", notes: "Assigned to courier agent Sathish", updated_by: "Dispatcher", timestamp: "2026-11-16 08:30" },
                { update_id: 4, tracking_number: "TRK-2026-8801", status: "Delivered", location: "Recipient Address, Gandhipuram", notes: "Delivered safely to recipient", updated_by: "Agent-Sathish", timestamp: "2026-11-16 14:20" },

                { update_id: 5, tracking_number: "TRK-2026-8802", status: "Booked", location: "Origin Sorting Hub, Erode", notes: "Same-Day manifest registered", updated_by: "System", timestamp: "2026-11-16 10:15" },
                { update_id: 6, tracking_number: "TRK-2026-8802", status: "Out for Delivery", location: "Erode Central Hub", notes: "Handed over to courier agent Manojkumar", updated_by: "Dispatcher", timestamp: "2026-11-16 13:00" },
                { update_id: 7, tracking_number: "TRK-2026-8802", status: "Delivered", location: "Thindal, Erode", notes: "Delivered to recipient with OTP signature", updated_by: "Agent-Manoj", timestamp: "2026-11-16 19:40" },

                { update_id: 8, tracking_number: "TRK-2026-8805", status: "Booked", location: "Origin Hub, Erode", notes: "Express electronics package booked by Dharshan", updated_by: "System", timestamp: "2026-11-19 09:00" },
                { update_id: 9, tracking_number: "TRK-2026-8805", status: "In Transit", location: "Inter-State Logistics Hub, Hosur", notes: "Cross-border clearance completed", updated_by: "System", timestamp: "2026-11-20 03:00" },
                { update_id: 10, tracking_number: "TRK-2026-8805", status: "Out for Delivery", location: "Bangalore Koramangala Hub", notes: "Out for delivery with agent Ganesh", updated_by: "Dispatcher", timestamp: "2026-11-21 08:00" },

                { update_id: 11, tracking_number: "TRK-2026-8811", status: "Booked", location: "Origin Hub, Trichy", notes: "Electronics item booked", updated_by: "System", timestamp: "2026-11-16 10:00" },
                { update_id: 12, tracking_number: "TRK-2026-8811", status: "In Transit", location: "Salem Transshipment Hub", notes: "In route to delivery point", updated_by: "System", timestamp: "2026-11-17 04:00" },
                { update_id: 13, tracking_number: "TRK-2026-8811", status: "Out for Delivery", location: "Salem West Delivery Station", notes: "Out with agent Dinesh", updated_by: "Dispatcher", timestamp: "2026-11-17 09:00" },
                { update_id: 14, tracking_number: "TRK-2026-8811", status: "Returned", location: "Salem Transshipment Hub", notes: "Returned to origin after 2 failed attempts", updated_by: "Dispatcher", timestamp: "2026-11-18 16:00" }
            ],
            delivery_attempts: [
                { attempt_id: 1, tracking_number: "TRK-2026-8811", personnel_id: 4, attempt_date: "2026-11-17 11:30", status: "Failed", failure_reason: "Customer Unavailable", remarks: "Phone was unreachable; door was locked", rescheduled_date: "2026-11-18" },
                { attempt_id: 2, tracking_number: "TRK-2026-8811", personnel_id: 4, attempt_date: "2026-11-18 14:15", status: "Failed", failure_reason: "Door Locked", remarks: "Nobody available at the premises for second attempt", rescheduled_date: null },
                { attempt_id: 3, tracking_number: "TRK-2026-8805", personnel_id: 5, attempt_date: "2026-11-20 17:30", status: "Failed", failure_reason: "Customer Requested Reschedule", remarks: "Customer asked for morning delivery between 9-11 AM", rescheduled_date: "2026-11-21" }
            ]
        };
    }

    calculateCharges(weightKg, distanceCategory, serviceType) {
        weightKg = parseFloat(weightKg) || 1.0;
        let ratePerKg = 40.0;
        let surcharge = 0.0;

        switch (distanceCategory.toLowerCase()) {
            case 'local': ratePerKg = 40.0; break;
            case 'regional': ratePerKg = 70.0; break;
            case 'national': ratePerKg = 110.0; break;
            case 'international': ratePerKg = 180.0; break;
        }

        if (serviceType.toLowerCase() === 'express') {
            ratePerKg += 35.0;
            surcharge = 75.0;
        } else if (serviceType.toLowerCase() === 'same-day') {
            ratePerKg += 40.0;
            surcharge = 120.0;
        }

        const base = Math.max(50.0, (weightKg * ratePerKg) + surcharge);
        const tax = Math.round(base * 0.18 * 100) / 100;
        const total = Math.round((base + tax) * 100) / 100;

        return { base, tax, total };
    }

    bookParcel(form) {
        const nextId = this.data.parcels.length + 1;
        const tracking_number = `TRK-2026-${String(8800 + nextId).padStart(4, '0')}`;
        const pricing = this.calculateCharges(form.weight_kg, form.distance_category, form.service_type);

        const newParcel = {
            parcel_id: nextId,
            tracking_number: tracking_number,
            sender_id: parseInt(form.sender_id) || 10,
            sender_name: form.sender_name || "Dharshan S",
            receiver_name: form.receiver_name,
            receiver_phone: form.receiver_phone,
            receiver_address: form.receiver_address,
            destination_city: form.destination_city,
            destination_pincode: form.destination_pincode || "638001",
            parcel_type: form.parcel_type || "General Goods",
            weight_kg: parseFloat(form.weight_kg),
            distance_category: form.distance_category,
            service_type: form.service_type,
            base_charge: pricing.base,
            tax_amount: pricing.tax,
            total_charge: pricing.total,
            current_status: "Booked",
            assigned_personnel_id: null,
            assigned_personnel_name: "Unassigned",
            booking_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            estimated_delivery: new Date(Date.now() + 86400000 * 2).toISOString().replace('T', ' ').substring(0, 16),
            actual_delivery: null
        };

        this.data.parcels.unshift(newParcel);

        // Auto trigger tracking update (DBMS Trigger simulation)
        this.data.tracking_history.push({
            update_id: this.data.tracking_history.length + 1,
            tracking_number: tracking_number,
            status: "Booked",
            location: "Origin Sorting Hub, Erode",
            notes: "Manifest generated by " + newParcel.sender_name,
            updated_by: "System",
            timestamp: newParcel.booking_date
        });

        this.saveState();
        return newParcel;
    }

    updateStatus(trackingNumber, newStatus, location, notes, updatedBy = "Dispatcher") {
        const p = this.data.parcels.find(x => x.tracking_number.toUpperCase() === trackingNumber.toUpperCase());
        if (!p) throw new Error(`Consignment ${trackingNumber} not found.`);

        const oldStatus = p.current_status;
        p.current_status = newStatus;
        if (newStatus === "Delivered") {
            p.actual_delivery = new Date().toISOString().replace('T', ' ').substring(0, 16);
            if (p.assigned_personnel_id) {
                const agent = this.data.delivery_personnel.find(a => a.personnel_id === p.assigned_personnel_id);
                if (agent && agent.active_deliveries > 0) agent.active_deliveries--;
            }
        }

        this.data.tracking_history.push({
            update_id: this.data.tracking_history.length + 1,
            tracking_number: trackingNumber,
            status: newStatus,
            location: location || `${p.destination_city} Transit Station`,
            notes: notes || `Status changed from ${oldStatus} to ${newStatus}`,
            updated_by: updatedBy,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });

        this.saveState();
        return p;
    }

    assignPersonnel(trackingNumber, personnelId) {
        const p = this.data.parcels.find(x => x.tracking_number.toUpperCase() === trackingNumber.toUpperCase());
        if (!p) throw new Error(`Consignment ${trackingNumber} not found.`);

        const agent = this.data.delivery_personnel.find(a => a.personnel_id === parseInt(personnelId));
        if (!agent) throw new Error(`Agent ID ${personnelId} not found.`);

        p.assigned_personnel_id = agent.personnel_id;
        p.assigned_personnel_name = agent.name;
        agent.active_deliveries++;

        if (p.current_status === "Booked") {
            p.current_status = "In Transit";
        }

        this.data.tracking_history.push({
            update_id: this.data.tracking_history.length + 1,
            tracking_number: trackingNumber,
            status: p.current_status,
            location: `${agent.assigned_zone} Hub`,
            notes: `Assigned to delivery agent ${agent.name} (${agent.vehicle_type})`,
            updated_by: "Dispatcher",
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });

        this.saveState();
        return p;
    }

    logAttempt(trackingNumber, reason, remarks, rescheduledDate) {
        const p = this.data.parcels.find(x => x.tracking_number.toUpperCase() === trackingNumber.toUpperCase());
        if (!p) throw new Error(`Consignment ${trackingNumber} not found.`);

        const attempt = {
            attempt_id: this.data.delivery_attempts.length + 1,
            tracking_number: trackingNumber,
            personnel_id: p.assigned_personnel_id || 1,
            attempt_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: "Failed",
            failure_reason: reason,
            remarks: remarks || "Doorstep delivery unsuccessful",
            rescheduled_date: rescheduledDate || null
        };

        this.data.delivery_attempts.push(attempt);

        this.data.tracking_history.push({
            update_id: this.data.tracking_history.length + 1,
            tracking_number: trackingNumber,
            status: "Out for Delivery",
            location: `${p.destination_city} - Doorstep`,
            notes: `Delivery attempt failed: ${reason}. Rescheduled for: ${rescheduledDate || 'Next business cycle'}`,
            updated_by: "Field Agent",
            timestamp: attempt.attempt_date
        });

        this.saveState();
        return attempt;
    }

    resetData() {
        this.data = this.getDefaultData();
        this.saveState();
    }
}

// Global instance
window.db = new DatabaseEngine();
