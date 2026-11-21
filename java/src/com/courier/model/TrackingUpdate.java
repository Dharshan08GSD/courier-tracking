package com.courier.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Audit Log Model for Parcel Movement Checkpoints.
 * Academic Mapping: 25ITT32 Unit 4 (String Formatting & Timestamps)
 */
public class TrackingUpdate {
    private int updateId;
    private String trackingNumber;
    private String status;
    private String location;
    private String notes;
    private String updatedBy;
    private LocalDateTime timestamp;

    public TrackingUpdate(int updateId, String trackingNumber, String status, String location,
                          String notes, String updatedBy, LocalDateTime timestamp) {
        this.updateId = updateId;
        this.trackingNumber = trackingNumber;
        this.status = status;
        this.location = location;
        this.notes = notes;
        this.updatedBy = updatedBy;
        this.timestamp = timestamp;
    }

    public int getUpdateId() { return updateId; }
    public String getTrackingNumber() { return trackingNumber; }
    public String getStatus() { return status; }
    public String getLocation() { return location; }
    public String getNotes() { return notes; }
    public String getUpdatedBy() { return updatedBy; }
    public LocalDateTime getTimestamp() { return timestamp; }

    @Override
    public String toString() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return String.format("[%s] %-16s @ %-28s | %s (%s)",
                timestamp.format(dtf), status, location, notes, updatedBy);
    }
}
