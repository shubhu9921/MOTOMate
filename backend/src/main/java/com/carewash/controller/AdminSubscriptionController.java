package com.carewash.controller;

import com.carewash.dto.SubscriptionPlanDto;
import com.carewash.dto.SubscriptionPlanRequest;
import com.carewash.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subscriptions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanDto>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }

    @PostMapping("/plans")
    public ResponseEntity<SubscriptionPlanDto> createPlan(@RequestBody SubscriptionPlanRequest request) {
        return ResponseEntity.ok(subscriptionService.createPlan(request));
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<SubscriptionPlanDto> updatePlan(@PathVariable Long id, @RequestBody SubscriptionPlanRequest request) {
        return ResponseEntity.ok(subscriptionService.updatePlan(id, request));
    }

    // Additional admin endpoints for viewing customer subscriptions can be added here
}
