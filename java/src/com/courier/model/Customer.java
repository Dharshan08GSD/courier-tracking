package com.courier.model;

import java.time.LocalDateTime;

/**
 * Represents a Customer (Sender or Receiver) in the Courier System.
 * Academic Mapping: 25ITT32 Unit 1 (Classes, Objects, Constructors, Access Control)
 */
public class Customer {
    private int customerId;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String pincode;
    private LocalDateTime createdAt;

    public Customer(int customerId, String name, String phone, String email, String address, String city, String pincode) {
        this.customerId = customerId;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.city = city;
        this.pincode = pincode;
        this.createdAt = LocalDateTime.now();
    }

    public int getCustomerId() { return customerId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getAddress() { return address; }
    public String getCity() { return city; }
    public String getPincode() { return pincode; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return String.format("Customer #%d: %s | Phone: %s | City: %s", customerId, name, phone, city);
    }
}
