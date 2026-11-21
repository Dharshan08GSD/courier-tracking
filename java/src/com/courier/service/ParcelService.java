package com.courier.service;

import com.courier.exception.InvalidTrackingNumberException;
import com.courier.exception.ParcelNotFoundException;
import com.courier.model.*;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Service Layer coordinating all Parcel Operations.
 * Academic Mapping: 25ITT32 Unit 5 (Generics, Collections Framework, Lambdas & Streams)
 */
public class ParcelService {
    private List<Parcel> parcelRepository;
    private List<Customer> customerRepository;
    private List<DeliveryPersonnel> personnelRepository;
    private List<DeliveryAttempt> attemptRepository;
    
    private static final Pattern TRACKING_PATTERN = Pattern.compile("^TRK-\\d{4}-\\d{4}$");

    public ParcelService(List<Customer> customers, List<DeliveryPersonnel> personnel, List<Parcel> parcels) {
        this.customerRepository = new ArrayList<>(customers);
        this.personnelRepository = new ArrayList<>(personnel);
        this.parcelRepository = new ArrayList<>(parcels);
        this.attemptRepository = new ArrayList<>();
    }

    public synchronized void bookParcel(Parcel parcel) {
        parcelRepository.add(parcel);
    }

    public Parcel findByTrackingNumber(String trackingNumber) throws InvalidTrackingNumberException, ParcelNotFoundException {
        if (trackingNumber == null || !TRACKING_PATTERN.matcher(trackingNumber).matches()) {
            throw new InvalidTrackingNumberException("Tracking number format invalid! Expected: TRK-YYYY-XXXX (e.g., TRK-2026-8801)");
        }

        return parcelRepository.stream()
                .filter(p -> p.getTrackingNumber().equalsIgnoreCase(trackingNumber))
                .findFirst()
                .orElseThrow(() -> new ParcelNotFoundException("Parcel with tracking number '" + trackingNumber + "' not found in database."));
    }

    public List<Parcel> filterByStatus(String status) {
        // Academic Mapping: Unit 5 Streams & Predicates
        return parcelRepository.stream()
                .filter(p -> p.getCurrentStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());
    }

    public List<Parcel> getPendingDeliveries() {
        return parcelRepository.stream()
                .filter(p -> !p.getCurrentStatus().equalsIgnoreCase("Delivered") && !p.getCurrentStatus().equalsIgnoreCase("Returned"))
                .collect(Collectors.toList());
    }

    public void assignPersonnel(String trackingNumber, int personnelId) throws Exception {
        Parcel parcel = findByTrackingNumber(trackingNumber);
        DeliveryPersonnel agent = personnelRepository.stream()
                .filter(dp -> dp.getPersonnelId() == personnelId)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Delivery personnel ID " + personnelId + " not found."));

        parcel.setAssignedPersonnel(agent);
        agent.incrementActiveDeliveries();
        parcel.updateStatus("In Transit", agent.getAssignedZone() + " Distribution Station",
                "Assigned to delivery agent " + agent.getName(), "Dispatcher");
    }

    public double calculateTotalRevenue() {
        // Stream Reduction (Unit 5)
        return parcelRepository.stream()
                .mapToDouble(Parcel::getTotalCharge)
                .sum();
    }

    public Map<String, Long> getStatusCounts() {
        // Stream Grouping & Collectors (Unit 5)
        return parcelRepository.stream()
                .collect(Collectors.groupingBy(Parcel::getCurrentStatus, Collectors.counting()));
    }

    public List<Parcel> getAllParcels() { return Collections.unmodifiableList(parcelRepository); }
    public List<Customer> getAllCustomers() { return Collections.unmodifiableList(customerRepository); }
    public List<DeliveryPersonnel> getAllPersonnel() { return Collections.unmodifiableList(personnelRepository); }
    public List<DeliveryAttempt> getAllAttempts() { return Collections.unmodifiableList(attemptRepository); }
}
