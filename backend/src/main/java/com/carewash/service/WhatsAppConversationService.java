package com.carewash.service;

import com.carewash.entity.*;
import com.carewash.repository.UserRepository;
import com.carewash.repository.WhatsAppConversationRepository;
import com.carewash.repository.WhatsAppMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class WhatsAppConversationService {

    @Autowired
    private WhatsAppConversationRepository conversationRepository;

    @Autowired
    private WhatsAppMessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public WhatsAppConversation getOrCreateConversation(String phoneNumber) {
        return conversationRepository.findByPhoneNumber(phoneNumber)
                .orElseGet(() -> {
                    WhatsAppConversation newConversation = new WhatsAppConversation();
                    newConversation.setPhoneNumber(phoneNumber);
                    newConversation.setCurrentState(WhatsAppConversationState.NEW);
                    newConversation.setLastMessageAt(LocalDateTime.now());

                    // Try to link to an existing user
                    Optional<User> userOpt = userRepository.findByPhone(phoneNumber);
                    userOpt.ifPresent(user -> newConversation.setUserId(user.getId()));

                    return conversationRepository.save(newConversation);
                });
    }

    @Transactional
    public WhatsAppConversation updateConversationState(Long conversationId, WhatsAppConversationState newState) {
        WhatsAppConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        conversation.setCurrentState(newState);
        conversation.setLastMessageAt(LocalDateTime.now());
        return conversationRepository.save(conversation);
    }

    public boolean isDuplicateMessage(String messageId) {
        return messageRepository.existsByMessageId(messageId);
    }

    @Transactional
    public WhatsAppMessage saveIncomingMessage(Long conversationId, String messageId, String text, String messageType) {
        if (isDuplicateMessage(messageId)) {
            return null; // Ignore duplicate
        }

        WhatsAppMessage message = WhatsAppMessage.builder()
                .conversationId(conversationId)
                .messageId(messageId)
                .direction(WhatsAppMessageDirection.INBOUND)
                .messageType(messageType)
                .messageText(text)
                .status(WhatsAppMessageStatus.RECEIVED)
                .build();
        
        // Update last message timestamp
        conversationRepository.findById(conversationId).ifPresent(conv -> {
            conv.setLastMessageAt(LocalDateTime.now());
            conversationRepository.save(conv);
        });

        return messageRepository.save(message);
    }

    @Transactional
    public WhatsAppMessage saveOutgoingMessage(Long conversationId, String text, WhatsAppMessageStatus status) {
        WhatsAppMessage message = WhatsAppMessage.builder()
                .conversationId(conversationId)
                .messageId("OUT-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000)) // Generated internal ID
                .direction(WhatsAppMessageDirection.OUTBOUND)
                .messageType("text")
                .messageText(text)
                .status(status)
                .build();
                
        // Update last message timestamp
        conversationRepository.findById(conversationId).ifPresent(conv -> {
            conv.setLastMessageAt(LocalDateTime.now());
            conversationRepository.save(conv);
        });

        return messageRepository.save(message);
    }
}
