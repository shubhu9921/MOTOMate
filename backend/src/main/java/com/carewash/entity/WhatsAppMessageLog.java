package com.carewash.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "whatsapp_message_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WhatsAppMessageLog {
    @Id
    private String messageId;
    private String fromNumber;
    private LocalDateTime processedAt;
}




