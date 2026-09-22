package com.carewash.controller;

import com.carewash.dto.SubscriptionPlanDto;
import com.carewash.dto.SubscriptionPlanRequest;
import com.carewash.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSubscriptionController {

    private final SubscriptionService subscriptionService;

    public AdminSubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    @GetMapping("/subscription-plans")
    public ResponseEntity<List<SubscriptionPlanDto>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }

    @PostMapping("/subscription-plans")
    public ResponseEntity<SubscriptionPlanDto> createPlan(@RequestBody SubscriptionPlanRequest request) {
        return ResponseEntity.ok(subscriptionService.createPlan(request));
    }

    @PutMapping("/subscription-plans/{id}")
    public ResponseEntity<SubscriptionPlanDto> updatePlan(@PathVariable Long id, @RequestBody SubscriptionPlanRequest request) {
        return ResponseEntity.ok(subscriptionService.updatePlan(id, request));
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<com.carewash.dto.CustomerSubscriptionDto>> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }

    @GetMapping("/subscriptions/{id}")
    public ResponseEntity<com.carewash.dto.CustomerSubscriptionDto> getSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscription(id, null));
    }

    @PostMapping("/subscriptions/{id}/activate")
    public ResponseEntity<com.carewash.dto.CustomerSubscriptionDto> activateSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.activateSubscription(id));
    }

    @PostMapping("/subscriptions/{id}/pause")
    public ResponseEntity<com.carewash.dto.CustomerSubscriptionDto> pauseSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.updateSubscriptionStatus(id, null, com.carewash.entity.SubscriptionStatus.PAUSED));
    }

    @PostMapping("/subscriptions/{id}/resume")
    public ResponseEntity<com.carewash.dto.CustomerSubscriptionDto> resumeSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.updateSubscriptionStatus(id, null, com.carewash.entity.SubscriptionStatus.ACTIVE));
    }

    @PostMapping("/subscriptions/{id}/cancel")
    public ResponseEntity<com.carewash.dto.CustomerSubscriptionDto> cancelSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.updateSubscriptionStatus(id, null, com.carewash.entity.SubscriptionStatus.CANCELLED));
    }
}
