package com.carewash.controller;

import com.carewash.config.WhatsAppConfig;
import com.carewash.dto.WhatsAppIncomingMessage;
import com.carewash.service.WhatsAppMessageProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carewash.service.WhatsAppWebhookSignatureService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp/webhook")
public class WhatsAppController {

    @Autowired
    private WhatsAppConfig whatsAppConfig;

    @Autowired
    private WhatsAppMessageProcessor whatsAppMessageProcessor;

    @Autowired
    private WhatsAppWebhookSignatureService signatureService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String token,
            @RequestParam(name = "hub.challenge", required = false) String challenge) {

        if (!whatsAppConfig.isEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("WhatsApp integration is disabled");
        }

        if ("subscribe".equals(mode) && whatsAppConfig.getVerifyToken().equals(token)) {
            return ResponseEntity.ok(challenge);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification failed");
        }
    }

    @PostMapping
    public ResponseEntity<String> receiveMessage(
            @RequestHeader(value = "X-Hub-Signature-256", required = false) String signature,
            @RequestBody byte[] rawPayload) {
        try {
            if (!whatsAppConfig.isEnabled()) {
                return ResponseEntity.ok("EVENT_RECEIVED");
            }

            if (!signatureService.isValidSignature(rawPayload, signature)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
            }

            Map<String, Object> payload = objectMapper.readValue(rawPayload, new TypeReference<Map<String, Object>>() {});

            // Extract and normalize data
            List<?> entries = (List<?>) payload.get("entry");
            if (entries != null && !entries.isEmpty()) {
                Map<?, ?> entry = (Map<?, ?>) entries.get(0);
                List<?> changes = (List<?>) entry.get("changes");
                
                if (changes != null && !changes.isEmpty()) {
                    Map<?, ?> change = (Map<?, ?>) changes.get(0);
                    Map<?, ?> value = (Map<?, ?>) change.get("value");
                    
                    if (value.containsKey("messages")) {
                        List<?> messages = (List<?>) value.get("messages");
                        if (messages != null && !messages.isEmpty()) {
                            Map<?, ?> message = (Map<?, ?>) messages.get(0);
                            
                            String messageId = (String) message.get("id");
                            String from = (String) message.get("from");
                            String timestamp = (String) message.get("timestamp");
                            String messageType = (String) message.get("type");
                            String text = null;

                            if ("text".equals(messageType)) {
                                Map<?, ?> textObj = (Map<?, ?>) message.get("text");
                                if (textObj != null) {
                                    text = (String) textObj.get("body");
                                }
                            }

                            WhatsAppIncomingMessage incomingMessage = new WhatsAppIncomingMessage();
                            incomingMessage.setMessageId(messageId);
                            incomingMessage.setPhoneNumber(from);
                            incomingMessage.setMessageType(messageType);
                            incomingMessage.setText(text);
                            incomingMessage.setTimestamp(timestamp);

                            // Asynchronous processing could be added here, but keeping simple for Phase 2
                            whatsAppMessageProcessor.processIncomingMessage(incomingMessage);
                        }
                    }
                }
            }

            return ResponseEntity.ok("EVENT_RECEIVED");
        } catch (Exception e) {
            System.err.println("Error processing WhatsApp webhook: " + e.getMessage());
            return ResponseEntity.ok("EVENT_RECEIVED");
        }
    }
}



