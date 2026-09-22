package com.carewash.controller;

import com.carewash.config.WhatsAppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/whatsapp")
@PreAuthorize("hasAnyRole('ADMIN', 'OPERATIONS_MANAGER')")
public class AdminWhatsAppController {

    @Autowired
    private WhatsAppConfig whatsAppConfig;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getWhatsAppStatus() {
        Map<String, Object> status = new HashMap<>();
        
        status.put("enabled", whatsAppConfig.isEnabled());
        status.put("configured", whatsAppConfig.isConfigured());
        
        boolean phoneNumberConfigured = whatsAppConfig.getPhoneNumberId() != null && !whatsAppConfig.getPhoneNumberId().trim().isEmpty();
        status.put("phoneNumberConfigured", phoneNumberConfigured);
        
        boolean webhookConfigured = whatsAppConfig.getVerifyToken() != null && !whatsAppConfig.getVerifyToken().trim().isEmpty();
        status.put("webhookConfigured", webhookConfigured);
        
        return ResponseEntity.ok(status);
    }
}
