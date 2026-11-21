package com.courier.model;

/**
 * Represents a Field Courier / Delivery Agent.
 * Academic Mapping: 25ITT32 Unit 1 (Encapsulation, Static Counters, Data Types)
 */
public class DeliveryPersonnel {
    private int personnelId;
    private String name;
    private String phone;
    private String vehicleType;
    private String vehicleNumber;
    private String assignedZone;
    private int activeDeliveries;
    private String status; // Available, On Delivery, On Leave
    private double rating;

    public DeliveryPersonnel(int personnelId, String name, String phone, String vehicleType,
                             String vehicleNumber, String assignedZone, int activeDeliveries,
                             String status, double rating) {
        this.personnelId = personnelId;
        this.name = name;
        this.phone = phone;
        this.vehicleType = vehicleType;
        this.vehicleNumber = vehicleNumber;
        this.assignedZone = assignedZone;
        this.activeDeliveries = activeDeliveries;
        this.status = status;
        this.rating = rating;
    }

    public int getPersonnelId() { return personnelId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getVehicleType() { return vehicleType; }
    public String getVehicleNumber() { return vehicleNumber; }
    public String getAssignedZone() { return assignedZone; }
    public int getActiveDeliveries() { return activeDeliveries; }
    public void incrementActiveDeliveries() { this.activeDeliveries++; }
    public void decrementActiveDeliveries() { if (this.activeDeliveries > 0) this.activeDeliveries--; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public double getRating() { return rating; }

    @Override
    public String toString() {
        return String.format("[%d] %s (%s, %s) - Active Load: %d, Rating: %.1f★",
                personnelId, name, vehicleType, assignedZone, activeDeliveries, rating);
    }
}
