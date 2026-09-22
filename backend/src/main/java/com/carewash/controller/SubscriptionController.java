package com.carewash.controller;

import com.carewash.dto.*;
import com.carewash.entity.User;
import com.carewash.repository.UserRepository;
import com.carewash.service.SubscriptionService;
import com.carewash.service.SubscriptionUsageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final SubscriptionUsageService usageService;
    private final UserRepository userRepository;

    public SubscriptionController(SubscriptionService subscriptionService, SubscriptionUsageService usageService, UserRepository userRepository) {
        this.subscriptionService = subscriptionService;
        this.usageService = usageService;
        this.userRepository = userRepository;
    }



    @GetMapping("/subscription-plans")
    public ResponseEntity<List<SubscriptionPlanDto>> getActivePlans() {
        return ResponseEntity.ok(subscriptionService.getActivePlans());
    }

    @PostMapping("/subscriptions")
    public ResponseEntity<CustomerSubscriptionDto> subscribe(Authentication authentication, @RequestBody SubscribeRequest request) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(subscriptionService.subscribe(userId, request));
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<CustomerSubscriptionDto>> getMySubscriptions(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(subscriptionService.getAllMySubscriptions(userId));
    }

    @GetMapping("/subscriptions/{id}")
    public ResponseEntity<CustomerSubscriptionDto> getSubscription(Authentication authentication, @PathVariable Long id) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(subscriptionService.getSubscription(id, userId));
    }

    @PostMapping("/subscriptions/{id}/cancel")
    public ResponseEntity<CustomerSubscriptionDto> cancelSubscription(Authentication authentication, @PathVariable Long id) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(subscriptionService.updateSubscriptionStatus(id, userId, com.carewash.entity.SubscriptionStatus.CANCELLED));
    }

    @PostMapping("/subscriptions/{id}/pause")
    public ResponseEntity<CustomerSubscriptionDto> pauseSubscription(Authentication authentication, @PathVariable Long id) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(subscriptionService.updateSubscriptionStatus(id, userId, com.carewash.entity.SubscriptionStatus.PAUSED));
    }

    @PostMapping("/subscriptions/{id}/resume")
    public ResponseEntity<CustomerSubscriptionDto> resumeSubscription(Authentication authentication, @PathVariable Long id) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(subscriptionService.updateSubscriptionStatus(id, userId, com.carewash.entity.SubscriptionStatus.ACTIVE));
    }

    @PatchMapping("/subscriptions/{id}/auto-renew")
    public ResponseEntity<Void> updateAutoRenew(Authentication authentication, @PathVariable Long id, @RequestBody java.util.Map<String, Boolean> body) {
        Long userId = extractUserId(authentication);
        subscriptionService.updateAutoRenew(id, userId, body.get("autoRenew"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/subscriptions/my/usage")
    public ResponseEntity<List<SubscriptionUsageDto>> getMyUsage(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(usageService.getUsageHistory(userId));
    }

    private Long extractUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
