package com.courier.model;

import com.courier.service.Trackable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Abstract Base Class for all Parcels in the System.
 * Academic Mapping: 25ITT32 Unit 2 (Inheritance, Abstract Classes, Polymorphism, Interfaces)
 */
public abstract class Parcel implements Trackable {
    protected int parcelId;
    protected String trackingNumber;
    protected Customer sender;
    protected String receiverName;
    protected String receiverPhone;
    protected String receiverAddress;
    protected String destinationCity;
    protected String destinationPincode;
    protected String parcelType;
    protected double weightKg;
    protected String distanceCategory; // Local, Regional, National, International
    protected String serviceType;      // Standard, Express, Same-Day
    protected double baseCharge;
    protected double taxAmount;
    protected double totalCharge;
    protected String currentStatus;    // Booked, In Transit, Out for Delivery, Delivered, Returned
    protected DeliveryPersonnel assignedPersonnel;
    protected LocalDateTime bookingDate;
    protected LocalDateTime estimatedDelivery;
    protected LocalDateTime actualDelivery;
    protected List<TrackingUpdate> trackingHistory;

    public Parcel(int parcelId, String trackingNumber, Customer sender, String receiverName,
                  String receiverPhone, String receiverAddress, String destinationCity,
                  String destinationPincode, String parcelType, double weightKg,
                  String distanceCategory, String serviceType) {
        this.parcelId = parcelId;
        this.trackingNumber = trackingNumber;
        this.sender = sender;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.receiverAddress = receiverAddress;
        this.destinationCity = destinationCity;
        this.destinationPincode = destinationPincode;
        this.parcelType = parcelType;
        this.weightKg = weightKg;
        this.distanceCategory = distanceCategory;
        this.serviceType = serviceType;
        this.currentStatus = "Booked";
        this.bookingDate = LocalDateTime.now();
        this.trackingHistory = new ArrayList<>();
        
        // Add initial tracking entry
        this.trackingHistory.add(new TrackingUpdate(
            1, trackingNumber, "Booked", "Origin Sorting Hub, Erode", "Manifest created", "System", LocalDateTime.now()
        ));
    }

    // Abstract method to be overridden by subclasses (Polymorphism)
    public abstract void calculatePricing();

    @Override
    public void updateStatus(String newStatus, String location, String notes, String updatedBy) {
        this.currentStatus = newStatus;
        int nextId = this.trackingHistory.size() + 1;
        this.trackingHistory.add(new TrackingUpdate(
            nextId, this.trackingNumber, newStatus, location, notes, updatedBy, LocalDateTime.now()
        ));
        if ("Delivered".equalsIgnoreCase(newStatus)) {
            this.actualDelivery = LocalDateTime.now();
        }
    }

    @Override
    public String getStatus() { return currentStatus; }

    @Override
    public List<TrackingUpdate> getTrackingHistory() { return trackingHistory; }

    // Getters and Setters
    public int getParcelId() { return parcelId; }
    public String getTrackingNumber() { return trackingNumber; }
    public Customer getSender() { return sender; }
    public String getReceiverName() { return receiverName; }
    public String getReceiverPhone() { return receiverPhone; }
    public String getReceiverAddress() { return receiverAddress; }
    public String getDestinationCity() { return destinationCity; }
    public String getDestinationPincode() { return destinationPincode; }
    public String getParcelType() { return parcelType; }
    public double getWeightKg() { return weightKg; }
    public String getDistanceCategory() { return distanceCategory; }
    public String getServiceType() { return serviceType; }
    public double getBaseCharge() { return baseCharge; }
    public double getTaxAmount() { return taxAmount; }
    public double getTotalCharge() { return totalCharge; }
    public DeliveryPersonnel getAssignedPersonnel() { return assignedPersonnel; }
    public void setAssignedPersonnel(DeliveryPersonnel assignedPersonnel) { this.assignedPersonnel = assignedPersonnel; }
    public LocalDateTime getBookingDate() { return bookingDate; }
    public LocalDateTime getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(LocalDateTime estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }
    public LocalDateTime getActualDelivery() { return actualDelivery; }

    public void displayWaybill() {
        System.out.println("┌────────────────────────────────────────────────────────┐");
        System.out.printf("│ WAYBILL / CONSIGNMENT NOTE: %-26s │%n", trackingNumber);
        System.out.println("├────────────────────────────────────────────────────────┤");
        System.out.printf("│ Sender:   %-44s │%n", sender.getName() + " (" + sender.getCity() + ")");
        System.out.printf("│ Receiver: %-44s │%n", receiverName + " (" + destinationCity + ")");
        System.out.printf("│ Type:     %-15s Weight: %-6.2f kg           │%n", parcelType, weightKg);
        System.out.printf("│ Route:    %-15s Service: %-15s │%n", distanceCategory, serviceType);
        System.out.printf("│ Total:    INR %-8.2f (Tax Incl. 18%% GST)          │%n", totalCharge);
        System.out.printf("│ Status:   %-44s │%n", currentStatus);
        System.out.println("└────────────────────────────────────────────────────────┘");
    }
}
