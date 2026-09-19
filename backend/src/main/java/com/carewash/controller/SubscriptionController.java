package com.carewash.controller;

import com.carewash.dto.*;
import com.carewash.entity.User;
import com.carewash.repository.UserRepository;
import com.carewash.service.SubscriptionService;
import com.carewash.service.SubscriptionUsageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final SubscriptionUsageService usageService;
    private final UserRepository userRepository;

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanDto>> getActivePlans() {
        return ResponseEntity.ok(subscriptionService.getActivePlans());
    }

    @PostMapping("/subscribe")
    public ResponseEntity<CustomerSubscriptionDto> subscribe(Authentication authentication, @RequestBody SubscribeRequest request) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(subscriptionService.subscribe(userId, request));
    }

    @GetMapping("/my")
    public ResponseEntity<CustomerSubscriptionDto> getMySubscription(Authentication authentication) {
        Long userId = extractUserId(authentication);
        CustomerSubscriptionDto sub = subscriptionService.getMyActiveSubscription(userId);
        if (sub == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(sub);
    }

    @GetMapping("/my/usage")
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
