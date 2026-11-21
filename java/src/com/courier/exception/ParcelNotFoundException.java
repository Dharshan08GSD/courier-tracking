package com.courier.exception;

/**
 * Custom Exception thrown when a searched tracking number does not exist.
 * Academic Mapping: 25ITT32 Unit 3 (User Defined Exceptions, throw, throws)
 */
public class ParcelNotFoundException extends Exception {
    public ParcelNotFoundException(String message) {
        super(message);
    }
}
