package com.carewash.service;

public interface EmailService {
    void sendRegistrationOtp(String toEmail, String otp);
    void sendForgotPasswordOtp(String toEmail, String otp);
    void sendPasswordResetConfirmation(String toEmail);
}
