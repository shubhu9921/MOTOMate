package com.carewash.controller;

import com.carewash.dto.ReviewDto;
import com.carewash.entity.User;
import com.carewash.service.AuthService;
import com.carewash.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private AuthService authService;

    @PostMapping("/reviews")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createReview(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        try {
            User user = authService.getUserFromToken(token.substring(7));
            Long bookingId = Long.valueOf(request.get("bookingId").toString());
            Integer rating = Integer.valueOf(request.get("rating").toString());
            String comment = (String) request.get("comment");
            
            ReviewDto review = reviewService.createReview(user, bookingId, rating, comment);
            return ResponseEntity.ok(Map.of("success", true, "data", review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/services/{serviceId}/reviews")
    public ResponseEntity<?> getServiceReviews(
            @PathVariable Long serviceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<ReviewDto> reviews = reviewService.getServiceReviews(serviceId, PageRequest.of(page, size));
            Double avgRating = reviewService.getServiceAverageRating(serviceId);
            Long totalCount = reviewService.getServiceReviewCount(serviceId);
            
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "data", reviews,
                "averageRating", avgRating != null ? avgRating : 0.0,
                "totalReviews", totalCount != null ? totalCount : 0
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
