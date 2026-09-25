package com.carewash.repository;

import com.carewash.entity.WhatsAppNotificationEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.carewash.entity.WhatsAppNotificationEventStatus;

public interface WhatsAppNotificationEventRepository extends JpaRepository<WhatsAppNotificationEvent, Long>, JpaSpecificationExecutor<WhatsAppNotificationEvent> {
    Optional<WhatsAppNotificationEvent> findByEventKey(String eventKey);

    long countByStatus(WhatsAppNotificationEventStatus status);
}




