package com.courier;

import com.courier.exception.InvalidTrackingNumberException;
import com.courier.exception.ParcelNotFoundException;
import com.courier.model.*;
import com.courier.service.MultithreadedDispatchSimulator;
import com.courier.service.ParcelService;
import com.courier.util.DataGenerator;

import java.util.List;
import java.util.Scanner;

/**
 * ============================================================================
 * COURIER AND PARCEL TRACKING MANAGEMENT SYSTEM (Scenario 26)
 * Academic Course: 25ITT32 - Java Programming
 * Student: Dharshan S | Reg No: 732925ITR026 | Class: 25IT3A
 * Velalar College of Engineering and Technology, Erode - 12
 * ============================================================================
 */
public class Main {
    private static ParcelService parcelService;
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        // Initialize Data
        List<Customer> customers = DataGenerator.generateCustomers();
        List<DeliveryPersonnel> personnel = DataGenerator.generatePersonnel();
        List<Parcel> parcels = DataGenerator.generateInitialParcels(customers, personnel);
        parcelService = new ParcelService(customers, personnel, parcels);

        printBanner();

        boolean running = true;
        while (running) {
            printMenu();
            System.out.print("Select an option (1-8): ");
            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1" -> handleTrackParcel();
                case "2" -> handleBookNewParcel();
                case "3" -> handleListAllParcels();
                case "4" -> handleListPendingParcels();
                case "5" -> handleAssignPersonnel();
                case "6" -> handleRunMultithreadedSimulation();
                case "7" -> handleDisplayAnalyticsSummary();
                case "8" -> {
                    System.out.println("\nThank you for using SwiftTrack Courier Management System. Exiting...");
                    running = false;
                }
                default -> System.out.println("[ERROR] Invalid selection! Please enter a number between 1 and 8.\n");
            }
        }
    }

    private static void printBanner() {
        System.out.println("================================================================================");
        System.out.println("      SWIFTTRACK: COURIER AND PARCEL TRACKING MANAGEMENT SYSTEM (SCENARIO 26)   ");
        System.out.println("================================================================================");
        System.out.println("  Student: Dharshan S   | Reg No: 732925ITR026   | Class: 25IT3A               ");
        System.out.println("  Dept of Information Technology, Velalar College of Engineering and Technology ");
        System.out.println("================================================================================\n");
    }

    private static void printMenu() {
        System.out.println("--------------------------- OPERATIONAL DASHBOARD -----------------------------");
        System.out.println("  1. Track Parcel by Tracking Number (e.g., TRK-2026-8801)");
        System.out.println("  2. Register / Book a New Consignment Parcel");
        System.out.println("  3. View All Parcels (Consignment Register)");
        System.out.println("  4. View Pending Deliveries (Active Worklist)");
        System.out.println("  5. Assign Delivery Personnel to Parcel");
        System.out.println("  6. Launch Multithreaded Transit Dispatch Simulation (Unit 3)");
        System.out.println("  7. View Analytics & Performance Metrics (Stream API - Unit 5)");
        System.out.println("  8. Exit Application");
        System.out.println("-------------------------------------------------------------------------------");
    }

    private static void handleTrackParcel() {
        System.out.print("\nEnter Consignment Tracking Number: ");
        String trackingNo = scanner.nextLine().trim().toUpperCase();

        try {
            Parcel p = parcelService.findByTrackingNumber(trackingNo);
            p.displayWaybill();

            System.out.println("\n--- SHIPMENT AUDIT TRAIL / CHECKPOINTS ---");
            for (TrackingUpdate update : p.getTrackingHistory()) {
                System.out.println(" • " + update);
            }
            System.out.println();
        } catch (InvalidTrackingNumberException | ParcelNotFoundException e) {
            System.err.println("\n[TRACKING FAILED] " + e.getMessage() + "\n");
        }
    }

    private static void handleBookNewParcel() {
        System.out.println("\n--- BOOK NEW CONSIGNMENT ---");
        try {
            Customer sender = parcelService.getAllCustomers().get(4); // Dharshan S (Default)
            System.out.println("Default Sender: " + sender.getName() + " (" + sender.getCity() + ")");

            System.out.print("Enter Consignee / Receiver Name: ");
            String receiverName = scanner.nextLine().trim();

            System.out.print("Enter Receiver Phone Number: ");
            String receiverPhone = scanner.nextLine().trim();

            System.out.print("Enter Receiver Address: ");
            String receiverAddress = scanner.nextLine().trim();

            System.out.print("Enter Destination City: ");
            String destinationCity = scanner.nextLine().trim();

            System.out.print("Enter Parcel Type (Document/Electronics/Clothing/Fragile/General Goods): ");
            String parcelType = scanner.nextLine().trim();

            System.out.print("Enter Parcel Weight (in kg): ");
            double weight = Double.parseDouble(scanner.nextLine().trim());

            System.out.print("Select Distance Category (1. Local, 2. Regional, 3. National, 4. International): ");
            String distChoice = scanner.nextLine().trim();
            String distanceCategory = switch (distChoice) {
                case "2" -> "Regional";
                case "3" -> "National";
                case "4" -> "International";
                default -> "Local";
            };

            System.out.print("Select Service Type (1. Standard Ground, 2. Priority Express, 3. Same-Day Rush): ");
            String servChoice = scanner.nextLine().trim();

            int nextId = parcelService.getAllParcels().size() + 1;
            String trackingNumber = String.format("TRK-2026-%04d", 8800 + nextId);

            Parcel newParcel = switch (servChoice) {
                case "2" -> new ExpressParcel(nextId, trackingNumber, sender, receiverName, receiverPhone,
                        receiverAddress, destinationCity, "638001", parcelType, weight, distanceCategory);
                case "3" -> new SameDayParcel(nextId, trackingNumber, sender, receiverName, receiverPhone,
                        receiverAddress, destinationCity, "638001", parcelType, weight, distanceCategory);
                default -> new StandardParcel(nextId, trackingNumber, sender, receiverName, receiverPhone,
                        receiverAddress, destinationCity, "638001", parcelType, weight, distanceCategory);
            };

            parcelService.bookParcel(newParcel);
            System.out.println("\n[SUCCESS] Consignment successfully booked!");
            newParcel.displayWaybill();
            System.out.println();
        } catch (NumberFormatException e) {
            System.err.println("[ERROR] Invalid numeric input for weight. Booking aborted.\n");
        }
    }

    private static void handleListAllParcels() {
        System.out.println("\n============================= ALL REGISTERED PARCELS =============================");
        System.out.printf("%-15s %-16s %-14s %-10s %-10s %-16s%n",
                "Tracking No", "Receiver", "City", "Weight", "Charge", "Status");
        System.out.println("---------------------------------------------------------------------------------");
        for (Parcel p : parcelService.getAllParcels()) {
            System.out.printf("%-15s %-16s %-14s %-6.2f kg  ₹%-8.2f %-16s%n",
                    p.getTrackingNumber(),
                    p.getReceiverName().length() > 14 ? p.getReceiverName().substring(0, 14) : p.getReceiverName(),
                    p.getDestinationCity(),
                    p.getWeightKg(),
                    p.getTotalCharge(),
                    p.getCurrentStatus());
        }
        System.out.println("=================================================================================\n");
    }

    private static void handleListPendingParcels() {
        System.out.println("\n============================= PENDING ACTIVE DELIVERIES =========================");
        List<Parcel> pending = parcelService.getPendingDeliveries();
        if (pending.isEmpty()) {
            System.out.println("No pending deliveries! All packages have completed their destination routes.");
        } else {
            for (Parcel p : pending) {
                System.out.printf(" • %s -> %s (%s) | Status: %s | Agent: %s%n",
                        p.getTrackingNumber(), p.getReceiverName(), p.getDestinationCity(),
                        p.getCurrentStatus(),
                        p.getAssignedPersonnel() != null ? p.getAssignedPersonnel().getName() : "Unassigned");
            }
        }
        System.out.println("=================================================================================\n");
    }

    private static void handleAssignPersonnel() {
        System.out.print("\nEnter Tracking Number to Allocate: ");
        String trackingNo = scanner.nextLine().trim().toUpperCase();

        System.out.println("\nAvailable Delivery Personnel:");
        for (DeliveryPersonnel dp : parcelService.getAllPersonnel()) {
            System.out.println("  " + dp);
        }

        System.out.print("\nEnter Personnel ID to Assign: ");
        try {
            int agentId = Integer.parseInt(scanner.nextLine().trim());
            parcelService.assignPersonnel(trackingNo, agentId);
            System.out.println("[SUCCESS] Agent successfully assigned to parcel " + trackingNo + "!\n");
        } catch (Exception e) {
            System.err.println("[ALLOCATION FAILED] " + e.getMessage() + "\n");
        }
    }

    private static void handleRunMultithreadedSimulation() {
        List<Parcel> pending = parcelService.getPendingDeliveries();
        if (pending.isEmpty()) {
            System.out.println("\n[NOTE] No pending parcels found to simulate. Creating a demo express consignment...");
            handleBookNewParcel();
            pending = parcelService.getPendingDeliveries();
        }
        MultithreadedDispatchSimulator.runSimulation(pending);
    }

    private static void handleDisplayAnalyticsSummary() {
        System.out.println("\n=================== SYSTEM ANALYTICS & REVENUE SUMMARY ====================");
        System.out.printf(" Total Registered Parcels: %d%n", parcelService.getAllParcels().size());
        System.out.printf(" Total Cumulative Revenue: ₹%.2f%n", parcelService.calculateTotalRevenue());
        System.out.println("\n Status Breakdown (Java 8 Streams groupingBy):");
        parcelService.getStatusCounts().forEach((status, count) ->
                System.out.printf("   - %-18s : %d parcel(s)%n", status, count));
        System.out.println("===========================================================================\n");
    }
}
