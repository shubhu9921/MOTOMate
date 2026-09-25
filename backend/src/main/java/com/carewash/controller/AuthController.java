package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.AuthRequest;
import com.carewash.dto.AuthResponse;
import com.carewash.dto.RegisterRequest;
import com.carewash.service.AuthService;
import com.carewash.service.OtpService;
import com.carewash.exception.BadRequestException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        AuthResponse authResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("User logged in successfully")
                .data(authResponse)
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (!otpService.validateOtp(signUpRequest.getEmail(), signUpRequest.getOtp())) {
            throw new BadRequestException("Invalid or expired OTP");
        }
        
        AuthResponse authResponse = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("User registered successfully")
                .data(authResponse)
                .build());
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        otpService.generateAndSendOtp(email);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("OTP sent successfully")
                .build());
    }
}
