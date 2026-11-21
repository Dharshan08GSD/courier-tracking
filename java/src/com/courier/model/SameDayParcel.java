package com.courier.model;

import java.time.LocalDateTime;

/**
 * Same-Day Rush Parcel Delivery (Local Intrawith Zone).
 * Academic Mapping: 25ITT32 Unit 2 (Polymorphism & Business Rule Overrides)
 */
public class SameDayParcel extends Parcel {
    private static final double RUSH_PREMIUM = 120.0;

    public SameDayParcel(int parcelId, String trackingNumber, Customer sender, String receiverName,
                         String receiverPhone, String receiverAddress, String destinationCity,
                         String destinationPincode, String parcelType, double weightKg,
                         String distanceCategory) {
        super(parcelId, trackingNumber, sender, receiverName, receiverPhone, receiverAddress,
              destinationCity, destinationPincode, parcelType, weightKg, distanceCategory, "Same-Day");
        calculatePricing();
        this.estimatedDelivery = LocalDateTime.now().plusHours(8);
    }

    @Override
    public void calculatePricing() {
        double ratePerKg = 80.0;
        this.baseCharge = (this.weightKg * ratePerKg) + RUSH_PREMIUM;
        this.taxAmount = Math.round(this.baseCharge * 0.18 * 100.0) / 100.0;
        this.totalCharge = Math.round((this.baseCharge + this.taxAmount) * 100.0) / 100.0;
    }
}
