package com.courier.model;

import java.time.LocalDateTime;

/**
 * Express Air/Priority Parcel Delivery.
 * Academic Mapping: 25ITT32 Unit 2 (Polymorphism & Dynamic Method Dispatch)
 */
public class ExpressParcel extends Parcel {
    private static final double EXPRESS_SURCHARGE = 75.0;

    public ExpressParcel(int parcelId, String trackingNumber, Customer sender, String receiverName,
                         String receiverPhone, String receiverAddress, String destinationCity,
                         String destinationPincode, String parcelType, double weightKg,
                         String distanceCategory) {
        super(parcelId, trackingNumber, sender, receiverName, receiverPhone, receiverAddress,
              destinationCity, destinationPincode, parcelType, weightKg, distanceCategory, "Express");
        calculatePricing();
        this.estimatedDelivery = LocalDateTime.now().plusDays(
            "Local".equalsIgnoreCase(distanceCategory) ? 1 : 2
        );
    }

    @Override
    public void calculatePricing() {
        double ratePerKg = switch (distanceCategory.toLowerCase()) {
            case "local" -> 65.0;
            case "regional" -> 110.0;
            case "national" -> 160.0;
            default -> 240.0;
        };
        this.baseCharge = Math.max(90.0, (this.weightKg * ratePerKg) + EXPRESS_SURCHARGE);
        this.taxAmount = Math.round(this.baseCharge * 0.18 * 100.0) / 100.0;
        this.totalCharge = Math.round((this.baseCharge + this.taxAmount) * 100.0) / 100.0;
    }
}
