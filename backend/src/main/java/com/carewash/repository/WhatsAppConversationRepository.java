package com.carewash.repository;

import com.carewash.entity.WhatsAppConversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WhatsAppConversationRepository extends JpaRepository<WhatsAppConversation, Long> {
    Optional<WhatsAppConversation> findByPhoneNumber(String phoneNumber);
}
