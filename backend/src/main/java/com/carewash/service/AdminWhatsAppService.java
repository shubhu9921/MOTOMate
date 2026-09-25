package com.carewash.service;

import com.carewash.dto.whatsapp.*;
import com.carewash.entity.WhatsAppConversation;
import com.carewash.entity.WhatsAppMessage;
import com.carewash.entity.WhatsAppNotificationEvent;
import com.carewash.entity.WhatsAppNotificationEventStatus;
import com.carewash.repository.WhatsAppConversationRepository;
import com.carewash.repository.WhatsAppMessageRepository;
import com.carewash.repository.WhatsAppNotificationEventRepository;
import com.carewash.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.carewash.repository.UserRepository;
import com.carewash.repository.WhatsAppConversationRepository;

@Service
public class AdminWhatsAppService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WhatsAppConversationRepository conversationRepository;

    @Autowired
    private WhatsAppMessageRepository messageRepository;

    @Autowired
    private WhatsAppNotificationEventRepository notificationEventRepository;

    public WhatsAppStatsDto getStatistics() {
        WhatsAppStatsDto stats = new WhatsAppStatsDto();
        
        stats.setTotalMessages(messageRepository.count());
        stats.setIncomingMessages(messageRepository.countByDirection("INCOMING"));
        stats.setOutgoingMessages(messageRepository.countByDirection("OUTGOING"));
        
        stats.setTotalConversations(conversationRepository.count());
        stats.setActiveConversations(conversationRepository.countActiveConversations());
        
        stats.setNotificationsSent(notificationEventRepository.countByStatus(WhatsAppNotificationEventStatus.SENT));
        stats.setNotificationsFailed(notificationEventRepository.countByStatus(WhatsAppNotificationEventStatus.FAILED));
        stats.setNotificationsRetrying(notificationEventRepository.countByStatus(WhatsAppNotificationEventStatus.RETRYING));
        stats.setNotificationsPending(notificationEventRepository.countByStatus(WhatsAppNotificationEventStatus.PENDING));

        LocalDateTime now = LocalDateTime.now();
        stats.setTodayMessages(messageRepository.countMessagesSince(now.toLocalDate().atStartOfDay()));
        stats.setLast7DaysMessages(messageRepository.countMessagesSince(now.minusDays(7)));
        stats.setLast30DaysMessages(messageRepository.countMessagesSince(now.minusDays(30)));
        
        return stats;
    }

    public Page<WhatsAppConversationDto> getConversations(Pageable pageable) {
        return conversationRepository.findAll(pageable).map(this::mapToConversationDto);
    }

    public ConversationDetailDto getConversationDetail(Long id) {
        WhatsAppConversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        
        List<WhatsAppMessage> messages = messageRepository.findTop50ByConversationIdOrderByCreatedAtDesc(id);
        Collections.reverse(messages); // Show oldest first in the UI, but bounded to 50 latest

        ConversationDetailDto detail = new ConversationDetailDto();
        detail.setConversation(mapToConversationDto(conversation));
        detail.setMessages(messages.stream().map(this::mapToMessageDto).collect(Collectors.toList()));
        
        if (conversation.getSelectedServiceId() != null) {
            detail.setSelectedService("Service ID: " + conversation.getSelectedServiceId());
        }
        if (conversation.getSelectedVehicleId() != null) {
            detail.setSelectedVehicle("Vehicle ID: " + conversation.getSelectedVehicleId());
        }
        if (conversation.getSelectedAddressId() != null) {
            detail.setSelectedAddress("Address ID: " + conversation.getSelectedAddressId());
        }
        
        return detail;
    }

    public Page<WhatsAppMessageDto> getMessages(Pageable pageable) {
        return messageRepository.findAll(pageable).map(this::mapToMessageDto);
    }

    public Page<WhatsAppNotificationEventDto> getNotifications(Pageable pageable) {
        return notificationEventRepository.findAll(pageable).map(this::mapToNotificationDto);
    }

    private WhatsAppConversationDto mapToConversationDto(WhatsAppConversation entity) {
        WhatsAppConversationDto dto = new WhatsAppConversationDto();
        dto.setId(entity.getId());
        dto.setMaskedPhoneNumber(entity.getPhoneNumber());
        dto.setState(entity.getCurrentState() != null ? entity.getCurrentState().name() : null);
        if (entity.getUserId() != null) {
            userRepository.findById(entity.getUserId()).ifPresent(user -> dto.setCustomerName(user.getName()));
        } else {
            dto.setCustomerName("Customer");
        }
        dto.setLastMessageAt(entity.getUpdatedAt());
        dto.setActive(entity.getCurrentState() != com.carewash.entity.WhatsAppConversationState.COMPLETED);
        return dto;
    }

    private WhatsAppMessageDto mapToMessageDto(WhatsAppMessage entity) {
        WhatsAppMessageDto dto = new WhatsAppMessageDto();
        dto.setId(entity.getId());
        dto.setDirection(entity.getDirection() != null ? entity.getDirection().name() : null);
        dto.setMessageType(entity.getMessageType());
        dto.setText(entity.getText());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    private WhatsAppNotificationEventDto mapToNotificationDto(WhatsAppNotificationEvent entity) {
        WhatsAppNotificationEventDto dto = new WhatsAppNotificationEventDto();
        dto.setId(entity.getId());
        dto.setBookingId(entity.getBookingId());
        dto.setEventType(entity.getEventType() != null ? entity.getEventType().name() : null);
        dto.setEventKey(entity.getEventKey());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        dto.setAttemptCount(entity.getAttemptCount());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getLastAttemptAt() != null ? entity.getLastAttemptAt() : entity.getCreatedAt());
        return dto;
    }
}




