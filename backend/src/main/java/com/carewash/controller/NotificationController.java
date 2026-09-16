package com.carewash.controller;

import com.carewash.entity.Notification;
import com.carewash.entity.User;
import com.carewash.service.AuthService;
import com.carewash.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            User user = authService.getUserFromToken(token.substring(7));
            Page<Notification> notifications = notificationService.getUserNotifications(user.getId(), PageRequest.of(page, size));
            long unreadCount = notificationService.getUnreadCount(user.getId());
            
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "data", notifications,
                "unreadCount", unreadCount
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        try {
            User user = authService.getUserFromToken(token.substring(7));
            notificationService.markAsRead(id, user.getId());
            return ResponseEntity.ok(Map.of("success", true, "message", "Marked as read"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@RequestHeader("Authorization") String token) {
        try {
            User user = authService.getUserFromToken(token.substring(7));
            notificationService.markAllAsRead(user.getId());
            return ResponseEntity.ok(Map.of("success", true, "message", "All marked as read"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
