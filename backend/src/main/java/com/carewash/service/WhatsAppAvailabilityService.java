package com.carewash.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
public class WhatsAppAvailabilityService {

    /**
     * Returns a simple list of standard business hours for Phase 3.
     * In the future, this can be connected to ProviderSlotRepository.
     */
    public List<LocalTime> getAvailableTimeSlots(LocalDate date) {
        return Arrays.asList(
                LocalTime.of(9, 0),
                LocalTime.of(11, 0),
                LocalTime.of(14, 0), // 2:00 PM
                LocalTime.of(16, 0)  // 4:00 PM
        );
    }
}
