package com.carewash.controller;

import com.carewash.config.WhatsAppConfig;
import com.carewash.dto.whatsapp.*;
import com.carewash.service.AdminWhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @Autowired
    private AdminWhatsAppService adminWhatsAppService;

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

    @GetMapping("/statistics")
    public ResponseEntity<WhatsAppStatsDto> getWhatsAppStatistics() {
        return ResponseEntity.ok(adminWhatsAppService.getStatistics());
    }

    @GetMapping("/conversations")
    public ResponseEntity<Page<WhatsAppConversationDto>> getConversations(@PageableDefault(size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(adminWhatsAppService.getConversations(pageable));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ConversationDetailDto> getConversationDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminWhatsAppService.getConversationDetail(id));
    }

    @GetMapping("/messages")
    public ResponseEntity<Page<WhatsAppMessageDto>> getMessages(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(adminWhatsAppService.getMessages(pageable));
    }

    @GetMapping("/notifications")
    public ResponseEntity<Page<WhatsAppNotificationEventDto>> getNotifications(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(adminWhatsAppService.getNotifications(pageable));
    }
}



