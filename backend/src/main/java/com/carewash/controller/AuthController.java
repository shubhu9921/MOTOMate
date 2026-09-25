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
        if (!otpService.isEmailVerified(signUpRequest.getEmail(), com.carewash.entity.OtpEntity.OtpPurpose.REGISTRATION)) {
            throw new BadRequestException("Email not verified. Please verify OTP first.");
        }
        
        AuthResponse authResponse = authService.registerUser(signUpRequest);
        // Consume the OTP so it can't be reused for another registration
        otpService.consumeVerifiedOtp(signUpRequest.getEmail(), com.carewash.entity.OtpEntity.OtpPurpose.REGISTRATION);

        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("User registered successfully")
                .data(authResponse)
                .build());
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@RequestBody java.util.Map<String, String> request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        // TODO: check if email is already registered here if needed
        otpService.generateAndSendRegistrationOtp(email, httpRequest.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("OTP sent successfully")
                .build());
    }

    @PostMapping("/verify-registration-otp")
    public ResponseEntity<ApiResponse<Void>> verifyRegistrationOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        if (email == null || otp == null) throw new BadRequestException("Email and OTP are required");

        boolean isValid = otpService.verifyOtp(email, otp, com.carewash.entity.OtpEntity.OtpPurpose.REGISTRATION);
        if (!isValid) {
            throw new BadRequestException("Invalid or expired OTP");
        }
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Email verified successfully").build());
    }

    @PostMapping("/resend-registration-otp")
    public ResponseEntity<ApiResponse<Void>> resendRegistrationOtp(@RequestBody java.util.Map<String, String> request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        return sendOtp(request, httpRequest); // re-uses send-otp logic
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody java.util.Map<String, String> request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String email = request.get("email");
        if (email == null) throw new BadRequestException("Email is required");
        
        try {
            otpService.generateAndSendForgotPasswordOtp(email, httpRequest.getRemoteAddr());
        } catch (Exception e) {
            // Ignore exception to not leak if email exists or rate limited?
            // Actually, we should surface rate limits to the user.
            if (e.getMessage().contains("wait") || e.getMessage().contains("Maximum")) {
                throw new BadRequestException(e.getMessage());
            }
        }
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true)
            .message("If an account exists for this email, a password reset OTP has been sent.").build());
    }

    @PostMapping("/verify-forgot-password-otp")
    public ResponseEntity<ApiResponse<java.util.Map<String, String>>> verifyForgotPasswordOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        if (email == null || otp == null) throw new BadRequestException("Email and OTP are required");

        boolean isValid = otpService.verifyOtp(email, otp, com.carewash.entity.OtpEntity.OtpPurpose.FORGOT_PASSWORD);
        if (!isValid) throw new BadRequestException("Invalid or expired OTP");

        // Return a short-lived reset token (for simplicity we can use a secure random UUID stored in the DB, or a JWT)
        // Since we have JWT support in AuthService, we could generate a special reset JWT.
        // For now, the user requested "return a short-lived password-reset token... Do NOT return the user's JWT"
        // Let's generate a UUID and store it in OtpEntity or just use the verified state.
        // If we use the verified state, the reset-password endpoint just checks `isEmailVerified`.
        // To strictly fulfill "resetToken": "...", we can return the email hashed or a JWT.
        // We will just return a placeholder or generate a reset token.
        String resetToken = java.util.UUID.randomUUID().toString();
        // Since we are short on tokens and don't want to create a whole ResetTokenEntity, 
        // we can store the reset token in the requestIp field of the verified OtpEntity?
        // Let's use the DB approach. I will update OtpService to handle this.
        otpService.setResetToken(email, resetToken);

        return ResponseEntity.ok(ApiResponse.<java.util.Map<String, String>>builder().success(true)
            .message("OTP verified successfully")
            .data(java.util.Map.of("resetToken", resetToken)).build());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String resetToken = request.get("resetToken");
        String newPassword = request.get("newPassword");
        if (resetToken == null || newPassword == null) throw new BadRequestException("Missing parameters");

        String email = otpService.getEmailByResetToken(resetToken);
        if (email == null) throw new BadRequestException("Invalid or expired reset token");

        authService.resetPassword(email, newPassword);
        otpService.consumeResetToken(resetToken);

        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Password reset successful").build());
    }
}
