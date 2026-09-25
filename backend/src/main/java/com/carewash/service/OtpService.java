package com.carewash.service;

import com.carewash.entity.OtpEntity;
import com.carewash.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();
    
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private static final int MAX_RESENDS = 3;

    public void generateAndSendRegistrationOtp(String email, String ipAddress) {
        generateAndSendOtp(email, OtpEntity.OtpPurpose.REGISTRATION, ipAddress);
    }

    public void generateAndSendForgotPasswordOtp(String email, String ipAddress) {
        generateAndSendOtp(email, OtpEntity.OtpPurpose.FORGOT_PASSWORD, ipAddress);
    }

    private void generateAndSendOtp(String email, OtpEntity.OtpPurpose purpose, String ipAddress) {
        Optional<OtpEntity> recentOtpOpt = otpRepository.findTopByEmailAndPurposeOrderByCreatedAtDesc(email, purpose);
        
        int resendCount = 0;
        if (recentOtpOpt.isPresent()) {
            OtpEntity recentOtp = recentOtpOpt.get();
            if (recentOtp.getCreatedAt().plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Please wait before requesting another OTP.");
            }
            if (!recentOtp.isUsed() && recentOtp.getExpiresAt().isAfter(LocalDateTime.now())) {
                resendCount = recentOtp.getResendCount() + 1;
                if (resendCount > MAX_RESENDS) {
                    throw new RuntimeException("Maximum resend attempts reached. Try again later.");
                }
                // Invalidate the old one
                recentOtp.setUsed(true);
                otpRepository.save(recentOtp);
            }
        }

        String rawOtp = String.format("%06d", secureRandom.nextInt(999999));
        
        OtpEntity otpEntity = OtpEntity.builder()
                .email(email)
                .otpHash(passwordEncoder.encode(rawOtp))
                .purpose(purpose)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .resendCount(resendCount)
                .requestIp(ipAddress)
                .build();
                
        otpRepository.save(otpEntity);

        if (purpose == OtpEntity.OtpPurpose.REGISTRATION) {
            emailService.sendRegistrationOtp(email, rawOtp);
        } else {
            emailService.sendForgotPasswordOtp(email, rawOtp);
        }
    }

    public boolean verifyOtp(String email, String rawOtp, OtpEntity.OtpPurpose purpose) {
        Optional<OtpEntity> otpOpt = otpRepository.findTopByEmailAndPurposeOrderByCreatedAtDesc(email, purpose);
        if (otpOpt.isEmpty()) {
            return false;
        }
        
        OtpEntity otpEntity = otpOpt.get();
        if (otpEntity.isUsed()) {
            return false;
        }
        if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }
        if (otpEntity.getAttemptCount() >= MAX_ATTEMPTS) {
            throw new RuntimeException("Too many verification attempts. Please request a new OTP.");
        }
        otpEntity.setAttemptCount(otpEntity.getAttemptCount() + 1);

        if (passwordEncoder.matches(rawOtp, otpEntity.getOtpHash())) {
            otpEntity.setVerifiedAt(LocalDateTime.now());
            // Do not mark as used yet; let the final action (register/reset) consume it
            otpRepository.save(otpEntity);
            return true;
        } else {
            otpRepository.save(otpEntity);
            return false;
        }
    }

    public boolean isEmailVerified(String email, OtpEntity.OtpPurpose purpose) {
        Optional<OtpEntity> otpOpt = otpRepository.findTopByEmailAndPurposeOrderByCreatedAtDesc(email, purpose);
        return otpOpt.isPresent() && otpOpt.get().getVerifiedAt() != null && !otpOpt.get().isUsed();
    }

    public void consumeVerifiedOtp(String email, OtpEntity.OtpPurpose purpose) {
        Optional<OtpEntity> otpOpt = otpRepository.findTopByEmailAndPurposeOrderByCreatedAtDesc(email, purpose);
        if (otpOpt.isPresent() && otpOpt.get().getVerifiedAt() != null && !otpOpt.get().isUsed()) {
            OtpEntity otp = otpOpt.get();
            otp.setUsed(true);
            otpRepository.save(otp);
        } else {
            throw new RuntimeException("No verified OTP found to consume.");
        }
    }

    public void setResetToken(String email, String token) {
        Optional<OtpEntity> otpOpt = otpRepository.findTopByEmailAndPurposeOrderByCreatedAtDesc(email, OtpEntity.OtpPurpose.FORGOT_PASSWORD);
        if (otpOpt.isPresent() && otpOpt.get().getVerifiedAt() != null) {
            OtpEntity otp = otpOpt.get();
            otp.setResetToken(token); // Store secure token directly, usually hashed but simple token for now
            otpRepository.save(otp);
        }
    }

    public String getEmailByResetToken(String rawToken) {
        Optional<OtpEntity> otpOpt = otpRepository.findByResetToken(rawToken);
        if (otpOpt.isPresent()) {
            OtpEntity otp = otpOpt.get();
            if (!otp.isUsed() && otp.getExpiresAt().plusMinutes(15).isAfter(LocalDateTime.now())) {
                // Return email and mark as used? Let the caller consume it.
                return otp.getEmail();
            }
        }
        return null;
    }

    public void consumeResetToken(String token) {
        Optional<OtpEntity> otpOpt = otpRepository.findByResetToken(token);
        if (otpOpt.isPresent()) {
            OtpEntity otp = otpOpt.get();
            otp.setUsed(true);
            otpRepository.save(otp);
        }
    }
}
