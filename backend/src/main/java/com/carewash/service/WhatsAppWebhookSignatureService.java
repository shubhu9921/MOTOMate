package com.carewash.service;

import com.carewash.config.WhatsAppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

@Service
public class WhatsAppWebhookSignatureService {

    @Autowired
    private WhatsAppConfig whatsAppConfig;

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    /**
     * Validates the Meta X-Hub-Signature-256 webhook signature.
     * 
     * @param rawBody The raw HTTP request body bytes before any JSON parsing.
     * @param signatureHeader The X-Hub-Signature-256 header (e.g. "sha256=1234abcd...").
     * @return true if the signature is valid, false otherwise.
     */
    public boolean isValidSignature(byte[] rawBody, String signatureHeader) {
        if (signatureHeader == null || !signatureHeader.startsWith("sha256=")) {
            return false;
        }

        if (!whatsAppConfig.isConfigured() || whatsAppConfig.getAppSecret() == null || whatsAppConfig.getAppSecret().trim().isEmpty()) {
            return false;
        }

        String providedHash = signatureHeader.substring(7); // Remove "sha256=" prefix

        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    whatsAppConfig.getAppSecret().getBytes(StandardCharsets.UTF_8), 
                    HMAC_ALGORITHM
            );
            mac.init(secretKeySpec);
            byte[] computedHashBytes = mac.doFinal(rawBody);
            String computedHash = bytesToHex(computedHashBytes);

            return MessageDigest.isEqual(
                    computedHash.getBytes(StandardCharsets.UTF_8),
                    providedHash.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            return false;
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}




