package com.carewash.repository;

import com.carewash.entity.WhatsAppMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface WhatsAppMessageRepository extends JpaRepository<WhatsAppMessage, Long>, JpaSpecificationExecutor<WhatsAppMessage> {
    Optional<WhatsAppMessage> findByMessageId(String messageId);
    boolean existsByMessageId(String messageId);

    List<WhatsAppMessage> findTop50ByConversationIdOrderByCreatedAtDesc(Long conversationId);

    long countByDirection(String direction);

    @Query("SELECT COUNT(m) FROM WhatsAppMessage m WHERE m.createdAt >= :startDate")
    long countMessagesSince(@Param("startDate") LocalDateTime startDate);
}




