package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.AuthResponse;
import com.carewash.dto.PasswordUpdateRequest;
import com.carewash.dto.ProfileUpdateRequest;
import com.carewash.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getProfile(Authentication authentication) {
        AuthResponse profile = userService.getUserProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Profile fetched successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> updateProfile(@Valid @RequestBody ProfileUpdateRequest request, Authentication authentication) {
        AuthResponse profile = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(@Valid @RequestBody PasswordUpdateRequest request, Authentication authentication) {
        userService.updatePassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Password updated successfully")
                .build());
    }
}
