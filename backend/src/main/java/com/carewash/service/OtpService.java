package com.carewash.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class OtpService {
    
    // Simple in-memory cache for OTPs: Phone -> OTP
    // Note: In production, use Redis or a DB table with expiration
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();
    
    public void generateAndSendOtp(String phone) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpCache.put(phone, otp);
        
        // Simulating SMS sending
        System.out.println("=========================================");
        System.out.println("MOCK SMS SERVICE: Sending OTP to " + phone);
        System.out.println("Your MotorMate Verification Code is: " + otp);
        System.out.println("=========================================");
    }
    
    public boolean validateOtp(String phone, String otp) {
        if (phone == null || otp == null) {
            return false;
        }
        String storedOtp = otpCache.get(phone);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpCache.remove(phone); // Consume the OTP
            return true;
        }
        return false;
    }
}
