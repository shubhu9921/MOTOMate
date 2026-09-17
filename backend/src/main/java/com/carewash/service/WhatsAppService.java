package com.carewash.service;

import com.carewash.entity.WhatsAppMessageLog;
import com.carewash.repository.WhatsAppMessageLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class WhatsAppService {

    @Autowired
    private WhatsAppMessageLogRepository messageLogRepository;

    @Value("${app.whatsapp.access-token:}")
    private String accessToken;

    @Value("${app.whatsapp.phone-number-id:}")
    private String phoneNumberId;

    private final RestTemplate restTemplate = new RestTemplate();

    public void processIncomingMessage(Map<String, Object> payload) {
        try {
            List<?> entries = (List<?>) payload.get("entry");
            if (entries == null || entries.isEmpty()) return;

            Map<?, ?> entry = (Map<?, ?>) entries.get(0);
            List<?> changes = (List<?>) entry.get("changes");
            if (changes == null || changes.isEmpty()) return;

            Map<?, ?> change = (Map<?, ?>) changes.get(0);
            Map<?, ?> value = (Map<?, ?>) change.get("value");
            
            // Check if it's a message
            if (value.containsKey("messages")) {
                List<?> messages = (List<?>) value.get("messages");
                if (messages != null && !messages.isEmpty()) {
                    Map<?, ?> message = (Map<?, ?>) messages.get(0);
                    String messageId = (String) message.get("id");
                    String from = (String) message.get("from");
                    
                    // Idempotency check
                    if (messageLogRepository.existsById(messageId)) {
                        return; // Already processed
                    }
                    messageLogRepository.save(new WhatsAppMessageLog(messageId, from, LocalDateTime.now()));

                    Map<?, ?> textObj = (Map<?, ?>) message.get("text");
                    if (textObj != null) {
                        String text = (String) textObj.get("body");
                        handleTextMessage(from, text);
                    }
                }
            }
        } catch (Exception e) {
            // Log structure mismatch or other issue, fail safely
            System.err.println("WhatsApp message parsing error: " + e.getMessage());
        }
    }

    private void handleTextMessage(String from, String text) {
        if (text == null) return;
        
        String lowerText = text.trim().toLowerCase();
        
        if (lowerText.equals("hi") || lowerText.equals("hello")) {
            sendWhatsAppMessage(from, "Welcome to MotorMate 🚗\nHow can we help you today?\n1. Book a Car Wash\n2. View Services\n3. My Booking\n4. Contact Support");
        } else if (lowerText.equals("1")) {
            sendWhatsAppMessage(from, "Great! Let's book a wash. Please provide your Service Type (e.g., Exterior Wash, Full Wash).");
        } else if (lowerText.equals("2")) {
            sendWhatsAppMessage(from, "Our services:\n- Exterior Wash: ₹499\n- Full Wash: ₹999\n- Premium Detailing: ₹1999");
        } else {
            sendWhatsAppMessage(from, "Sorry, I didn't understand that. Type 'Hi' to start over.");
        }
    }

    public void sendWhatsAppMessage(String to, String body) {
        if (accessToken == null || accessToken.isEmpty() || phoneNumberId == null || phoneNumberId.isEmpty()) {
            System.out.println("WhatsApp API credentials missing. Simulated message to " + to + ": " + body);
            return;
        }

        String url = "https://graph.facebook.com/v17.0/" + phoneNumberId + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> textObj = Map.of("preview_url", false, "body", body);
        Map<String, Object> requestBody = Map.of(
                "messaging_product", "whatsapp",
                "to", to,
                "type", "text",
                "text", textObj
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            restTemplate.postForObject(url, request, String.class);
        } catch (Exception e) {
            System.err.println("Failed to send WhatsApp message: " + e.getMessage());
        }
    }
}
