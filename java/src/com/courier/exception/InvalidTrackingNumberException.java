package com.courier.exception;

/**
 * Custom Exception thrown when tracking number format fails regex validation.
 * Academic Mapping: 25ITT32 Unit 3 (Exception Handling Fundamentals)
 */
public class InvalidTrackingNumberException extends Exception {
    public InvalidTrackingNumberException(String message) {
        super(message);
    }
}
