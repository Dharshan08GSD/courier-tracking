package com.courier.util;

import com.courier.model.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Utility to seed initial data for the Java console application.
 */
public class DataGenerator {

    public static List<Customer> generateCustomers() {
        List<Customer> list = new ArrayList<>();
        list.add(new Customer(1, "Arun Kumar", "9842112345", "arun@gmail.com", "14 Gandhipuram", "Coimbatore", "641012"));
        list.add(new Customer(2, "Deepa Mohan", "9842223456", "deepa.m@outlook.com", "45 Perundurai Rd", "Erode", "638011"));
        list.add(new Customer(3, "Karthik Raja", "9842334567", "karthik.r@yahoo.com", "78 Anna Salai", "Chennai", "600017"));
        list.add(new Customer(4, "Priya Senthil", "9842445678", "priya.s@gmail.com", "12 Fairlands", "Salem", "636016"));
        list.add(new Customer(5, "Dharshan S", "9842001122", "dharshan.732925itr026@vcet.ac.in", "26 Thindal", "Erode", "638012"));
        return list;
    }

    public static List<DeliveryPersonnel> generatePersonnel() {
        List<DeliveryPersonnel> list = new ArrayList<>();
        list.add(new DeliveryPersonnel(1, "Manojkumar P", "9789111222", "Motorcycle", "TN-33-AX-4521", "Erode Central", 2, "On Delivery", 4.8));
        list.add(new DeliveryPersonnel(2, "Sathish Kumar R", "9789222333", "Van", "TN-38-BZ-1984", "Coimbatore North", 1, "On Delivery", 4.9));
        list.add(new DeliveryPersonnel(3, "Praveen Wilson", "9789333444", "EV-Scooter", "TN-01-EE-7762", "Chennai South", 1, "On Delivery", 4.7));
        list.add(new DeliveryPersonnel(4, "Dinesh Velu", "9789444555", "Motorcycle", "TN-27-DY-3310", "Salem West", 0, "Available", 4.6));
        list.add(new DeliveryPersonnel(5, "Ganesh Moorthy", "9789555666", "Van", "KA-05-MM-9102", "Bangalore Tech Zone", 0, "Available", 4.9));
        return list;
    }

    public static List<Parcel> generateInitialParcels(List<Customer> customers, List<DeliveryPersonnel> personnel) {
        List<Parcel> list = new ArrayList<>();

        Parcel p1 = new StandardParcel(1, "TRK-2026-8801", customers.get(0), "Sangeetha R", "9943110001",
                "12 Cross Cut Rd", "Coimbatore", "641012", "Document", 0.50, "Local");
        p1.setAssignedPersonnel(personnel.get(1));
        p1.updateStatus("Delivered", "Recipient Address, Coimbatore", "Delivered on schedule", "Agent-Sathish");
        list.add(p1);

        Parcel p2 = new SameDayParcel(2, "TRK-2026-8802", customers.get(1), "Gokulnath C", "9943110002",
                "89 Velalar Nagar", "Erode", "638012", "General Goods", 2.80, "Local");
        p2.setAssignedPersonnel(personnel.get(0));
        p2.updateStatus("Delivered", "Thindal, Erode", "Delivered with signature", "Agent-Manoj");
        list.add(p2);

        Parcel p3 = new ExpressParcel(3, "TRK-2026-8803", customers.get(2), "Kavitha Devi", "9943110003",
                "54 OMR Road", "Chennai", "600097", "Electronics", 4.20, "Regional");
        p3.setAssignedPersonnel(personnel.get(2));
        p3.updateStatus("Delivered", "OMR Road, Chennai", "Delivered at desk", "Agent-Praveen");
        list.add(p3);

        Parcel p4 = new StandardParcel(4, "TRK-2026-8804", customers.get(3), "Balaji Krishnan", "9943110004",
                "71 Meyyanur Bypass", "Salem", "636004", "Clothing", 1.80, "Regional");
        p4.setAssignedPersonnel(personnel.get(3));
        p4.updateStatus("Delivered", "Salem West", "Delivered successfully", "Agent-Dinesh");
        list.add(p4);

        Parcel p5 = new ExpressParcel(5, "TRK-2026-8805", customers.get(4), "Naveen Kumar", "9943110005",
                "38 Koramangala", "Bangalore", "560095", "Electronics", 6.50, "National");
        p5.setAssignedPersonnel(personnel.get(4));
        p5.updateStatus("Out for Delivery", "Bangalore Koramangala Hub", "Out for morning delivery", "Agent-Ganesh");
        list.add(p5);

        return list;
    }
}
