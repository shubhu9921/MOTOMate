package com.carewash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "whatsapp_messages", indexes = {
    @Index(name = "idx_whatsapp_message_id", columnList = "messageId", unique = true)
})
public class WhatsAppMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long conversationId;

    @Column(nullable = false, unique = true)
    private String messageId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WhatsAppMessageDirection direction;

    @Builder.Default
    @Column(nullable = false)
    private String messageType = "text";

    @Column(columnDefinition = "TEXT")
    private String messageText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WhatsAppMessageStatus status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public static WhatsAppMessageBuilder builder() {
        return new WhatsAppMessageBuilder();
    }

    public static class WhatsAppMessageBuilder {
        private Long id;
        private Long conversationId;
        private String messageId;
        private WhatsAppMessageDirection direction;
        private String messageType = "text";
        private String messageText;
        private WhatsAppMessageStatus status;
        private LocalDateTime createdAt;

        WhatsAppMessageBuilder() {}

        public WhatsAppMessageBuilder id(Long id) { this.id = id; return this; }
        public WhatsAppMessageBuilder conversationId(Long conversationId) { this.conversationId = conversationId; return this; }
        public WhatsAppMessageBuilder messageId(String messageId) { this.messageId = messageId; return this; }
        public WhatsAppMessageBuilder direction(WhatsAppMessageDirection direction) { this.direction = direction; return this; }
        public WhatsAppMessageBuilder messageType(String messageType) { this.messageType = messageType; return this; }
        public WhatsAppMessageBuilder messageText(String messageText) { this.messageText = messageText; return this; }
        public WhatsAppMessageBuilder status(WhatsAppMessageStatus status) { this.status = status; return this; }
        public WhatsAppMessageBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public WhatsAppMessage build() {
            WhatsAppMessage m = new WhatsAppMessage();
            m.id = this.id;
            m.conversationId = this.conversationId;
            m.messageId = this.messageId;
            m.direction = this.direction;
            m.messageType = this.messageType;
            m.messageText = this.messageText;
            m.status = this.status;
            m.createdAt = this.createdAt;
            return m;
        }
    }
}
