package com.courier.service;

import com.courier.model.TrackingUpdate;
import java.util.List;

/**
 * Interface for trackable entities across transit lifecycles.
 * Academic Mapping: 25ITT32 Unit 2 (Defining and Implementing Interfaces)
 */
public interface Trackable {
    void updateStatus(String newStatus, String location, String notes, String updatedBy);
    String getStatus();
    List<TrackingUpdate> getTrackingHistory();
}
