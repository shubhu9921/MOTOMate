package com.carewash.repository;

import com.carewash.entity.WhatsAppConversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface WhatsAppConversationRepository extends JpaRepository<WhatsAppConversation, Long>, JpaSpecificationExecutor<WhatsAppConversation> {
    Optional<WhatsAppConversation> findByPhoneNumber(String phoneNumber);

    @Query("SELECT COUNT(c) FROM WhatsAppConversation c WHERE c.isActive = true")
    long countActiveConversations();
}
