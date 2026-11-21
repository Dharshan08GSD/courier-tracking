package com.courier.model;

import java.time.LocalDateTime;

/**
 * Standard Ground Parcel Delivery.
 * Academic Mapping: 25ITT32 Unit 2 (Inheritance, Super keyword, Method Overriding)
 */
public class StandardParcel extends Parcel {
    
    public StandardParcel(int parcelId, String trackingNumber, Customer sender, String receiverName,
                          String receiverPhone, String receiverAddress, String destinationCity,
                          String destinationPincode, String parcelType, double weightKg,
                          String distanceCategory) {
        super(parcelId, trackingNumber, sender, receiverName, receiverPhone, receiverAddress,
              destinationCity, destinationPincode, parcelType, weightKg, distanceCategory, "Standard");
        calculatePricing();
        this.estimatedDelivery = LocalDateTime.now().plusDays(
            "Local".equalsIgnoreCase(distanceCategory) ? 1 :
            "Regional".equalsIgnoreCase(distanceCategory) ? 2 : 4
        );
    }

    @Override
    public void calculatePricing() {
        double ratePerKg = switch (distanceCategory.toLowerCase()) {
            case "local" -> 40.0;
            case "regional" -> 70.0;
            case "national" -> 110.0;
            default -> 160.0;
        };
        this.baseCharge = Math.max(50.0, this.weightKg * ratePerKg);
        this.taxAmount = Math.round(this.baseCharge * 0.18 * 100.0) / 100.0;
        this.totalCharge = Math.round((this.baseCharge + this.taxAmount) * 100.0) / 100.0;
    }
}
