package com.carewash.controller;

import com.carewash.dto.BookingDto;
import com.carewash.entity.BookingStatus;
import com.carewash.entity.User;
import com.carewash.service.AuthService;
import com.carewash.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/provider")
@PreAuthorize("hasRole('SERVICE_PROVIDER')")
@CrossOrigin(origins = "*")
public class ProviderController {

    @Autowired
    private ProviderService providerService;
    
    @Autowired
    private AuthService authService;

    @GetMapping("/jobs")
    public ResponseEntity<?> getJobs(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            User user = authService.getUserFromToken(token.substring(7));
            Page<BookingDto> jobs = providerService.getProviderBookings(user, PageRequest.of(page, size));
            return ResponseEntity.ok(Map.of("success", true, "data", jobs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/jobs/{id}/status")
    public ResponseEntity<?> updateJobStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            User user = authService.getUserFromToken(token.substring(7));
            BookingStatus newStatus = BookingStatus.valueOf(request.get("status"));
            providerService.updateBookingStatus(user, id, newStatus);
            return ResponseEntity.ok(Map.of("success", true, "message", "Status updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid status value"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
