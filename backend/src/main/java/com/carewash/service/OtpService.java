package com.carewash.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class OtpService {
    
    // Simple in-memory cache for OTPs: Email -> OTP
    // Note: In production, use Redis or a DB table with expiration
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();
    
    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpCache.put(email, otp);
        
        // Simulating Email sending
        System.out.println("=========================================");
        System.out.println("MOCK EMAIL SERVICE: Sending OTP to " + email);
        System.out.println("Your REVORA Verification Code is: " + otp);
        System.out.println("=========================================");
    }
    
    public boolean validateOtp(String email, String otp) {
        if (email == null || otp == null) {
            return false;
        }
        String storedOtp = otpCache.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpCache.remove(email); // Consume the OTP
            return true;
        }
        return false;
    }
}
