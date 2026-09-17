package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.ProviderDto;
import com.carewash.dto.ProviderSlotDto;
import com.carewash.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class PublicProviderController {

    @Autowired
    private ProviderService providerService;

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<ProviderDto>>> getNearbyProviders(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "15.0") Double radiusKm) {
        
        List<ProviderDto> nearbyProviders = providerService.getNearbyProviders(lat, lng, radiusKm);
        
        return ResponseEntity.ok(ApiResponse.<List<ProviderDto>>builder()
                .success(true)
                .message("Nearby providers fetched successfully")
                .data(nearbyProviders)
                .build());
    }

    @GetMapping("/{providerId}/slots")
    public ResponseEntity<ApiResponse<List<ProviderSlotDto>>> getAvailableSlots(
            @PathVariable Long providerId,
            @RequestParam String date) {
        
        LocalDate slotDate = LocalDate.parse(date);
        List<ProviderSlotDto> slots = providerService.getAvailableSlots(providerId, slotDate);
        
        return ResponseEntity.ok(ApiResponse.<List<ProviderSlotDto>>builder()
                .success(true)
                .message("Available slots fetched successfully")
                .data(slots)
                .build());
    }
}
