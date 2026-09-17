package com.carewash.controller;

import com.carewash.service.WhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks/whatsapp")
public class WhatsAppController {

    @Value("${app.whatsapp.verify-token:}")
    private String verifyToken;

    @Autowired
    private WhatsAppService whatsAppService;

    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String token,
            @RequestParam(name = "hub.challenge", required = false) String challenge) {

        if ("subscribe".equals(mode) && verifyToken.equals(token)) {
            return ResponseEntity.ok(challenge);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification failed");
        }
    }

    @PostMapping
    public ResponseEntity<String> receiveMessage(@RequestBody Map<String, Object> payload) {
        try {
            // Acknowledge receipt immediately to WhatsApp
            whatsAppService.processIncomingMessage(payload);
            return ResponseEntity.ok("EVENT_RECEIVED");
        } catch (Exception e) {
            // Log error but still return 200 to prevent WhatsApp from retrying endlessly
            System.err.println("Error processing WhatsApp webhook: " + e.getMessage());
            return ResponseEntity.ok("EVENT_RECEIVED");
        }
    }
}
