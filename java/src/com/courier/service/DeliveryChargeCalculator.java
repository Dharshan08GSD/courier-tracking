package com.courier.service;

/**
 * Functional interface for calculating dynamic shipping charges.
 * Academic Mapping: 25ITT32 Unit 5 (Functional Interfaces & Lambdas)
 */
@FunctionalInterface
public interface DeliveryChargeCalculator {
    double calculate(double weightKg, String distanceCategory, String serviceType);
}
