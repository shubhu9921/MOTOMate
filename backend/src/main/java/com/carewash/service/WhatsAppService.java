package com.carewash.service;

import com.carewash.config.WhatsAppConfig;
import com.carewash.entity.WhatsAppMessageLog;
import com.carewash.repository.WhatsAppMessageLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private WhatsAppConfig whatsAppConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    // Incoming messages are now processed by WhatsAppController and WhatsAppMessageProcessor


    public void sendWhatsAppMessage(String to, String body) {
        if (!whatsAppConfig.isConfigured()) {
            System.out.println("WhatsApp API credentials missing. Simulated message to " + to + ": " + body);
            return;
        }

        String url = whatsAppConfig.getApiUrl() + "/" + whatsAppConfig.getApiVersion() + "/" + whatsAppConfig.getPhoneNumberId() + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(whatsAppConfig.getAccessToken());

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




