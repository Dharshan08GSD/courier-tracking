package com.courier.service;

import com.courier.model.Parcel;
import java.util.List;

/**
 * Simulates concurrent parcel transit movements across background worker threads.
 * Academic Mapping: 25ITT32 Unit 3 (Multithreading, Runnable, Synchronization, Thread Priorities)
 */
public class MultithreadedDispatchSimulator {

    public static void runSimulation(List<Parcel> parcels) {
        System.out.println("\n[SIMULATOR] Initializing Multithreaded Transit Dispatch Engine...");
        System.out.println("[SIMULATOR] Spawning concurrent threads for active consignments...\n");

        Thread[] workers = new Thread[parcels.size()];

        for (int i = 0; i < parcels.size(); i++) {
            final Parcel p = parcels.get(i);
            final int index = i + 1;

            workers[i] = new Thread(() -> {
                try {
                    String threadName = Thread.currentThread().getName();
                    System.out.printf("  [Thread-%d] Processing Consignment: %s destined for %s%n",
                            index, p.getTrackingNumber(), p.getDestinationCity());

                    Thread.sleep(600 + (index * 200)); // Simulate transit delay

                    synchronized (p) {
                        p.updateStatus("In Transit", "Regional Highway Checkpoint " + index,
                                "Transit clearance verified via GPS", threadName);
                    }

                    Thread.sleep(500);

                    synchronized (p) {
                        p.updateStatus("Out for Delivery", p.getDestinationCity() + " Destination Hub",
                                "Reached final delivery station", threadName);
                    }

                    System.out.printf("  [Thread-%d] SUCCESS: %s is now OUT FOR DELIVERY.%n",
                            index, p.getTrackingNumber());

                } catch (InterruptedException e) {
                    System.err.println("Thread interrupted: " + e.getMessage());
                    Thread.currentThread().interrupt();
                }
            }, "DispatchWorker-" + (i + 1));

            // Set priority dynamically based on service tier (Unit 3: Thread Priorities)
            if ("Same-Day".equalsIgnoreCase(p.getServiceType())) {
                workers[i].setPriority(Thread.MAX_PRIORITY); // Priority 10
            } else if ("Express".equalsIgnoreCase(p.getServiceType())) {
                workers[i].setPriority(Thread.NORM_PRIORITY + 2); // Priority 7
            } else {
                workers[i].setPriority(Thread.NORM_PRIORITY); // Priority 5
            }

            workers[i].start();
        }

        // Wait for all simulation threads to safely join
        for (Thread worker : workers) {
            try {
                worker.join();
            } catch (InterruptedException ignored) {}
        }

        System.out.println("\n[SIMULATOR] All concurrent transit dispatches completed successfully!\n");
    }
}
