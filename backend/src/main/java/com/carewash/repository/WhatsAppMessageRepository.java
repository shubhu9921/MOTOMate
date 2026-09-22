package com.carewash.repository;

import com.carewash.entity.WhatsAppMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WhatsAppMessageRepository extends JpaRepository<WhatsAppMessage, Long> {
    Optional<WhatsAppMessage> findByMessageId(String messageId);
    boolean existsByMessageId(String messageId);
}
