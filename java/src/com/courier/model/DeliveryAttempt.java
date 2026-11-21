package com.courier.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Model representing a doorstep delivery attempt.
 * Functional Requirement 7: Record delivery attempts and reasons for failure.
 */
public class DeliveryAttempt {
    private int attemptId;
    private String trackingNumber;
    private int personnelId;
    private LocalDateTime attemptDate;
    private String status; // Successful, Failed
    private String failureReason;
    private String remarks;
    private LocalDate rescheduledDate;

    public DeliveryAttempt(int attemptId, String trackingNumber, int personnelId,
                           LocalDateTime attemptDate, String status, String failureReason,
                           String remarks, LocalDate rescheduledDate) {
        this.attemptId = attemptId;
        this.trackingNumber = trackingNumber;
        this.personnelId = personnelId;
        this.attemptDate = attemptDate;
        this.status = status;
        this.failureReason = failureReason;
        this.remarks = remarks;
        this.rescheduledDate = rescheduledDate;
    }

    public int getAttemptId() { return attemptId; }
    public String getTrackingNumber() { return trackingNumber; }
    public int getPersonnelId() { return personnelId; }
    public LocalDateTime getAttemptDate() { return attemptDate; }
    public String getStatus() { return status; }
    public String getFailureReason() { return failureReason; }
    public String getRemarks() { return remarks; }
    public LocalDate getRescheduledDate() { return rescheduledDate; }
}
