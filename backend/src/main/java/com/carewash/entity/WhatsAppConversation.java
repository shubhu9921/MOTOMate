package com.carewash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "whatsapp_conversations")
public class WhatsAppConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "user_id")
    private Long userId; // Nullable if unknown user

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WhatsAppConversationState currentState = WhatsAppConversationState.NEW;

    private LocalDateTime lastMessageAt;

    private Long selectedServiceId;
    private Long selectedVehicleId;
    private Long selectedAddressId;
    private LocalDate selectedDate;
    private LocalTime selectedTime;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Explicit getters added to avoid IDE/compiler issues with Lombok
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public WhatsAppConversationState getCurrentState() {
        return currentState;
    }

    public void setCurrentState(WhatsAppConversationState currentState) {
        this.currentState = currentState;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getSelectedServiceId() { return selectedServiceId; }
    public void setSelectedServiceId(Long selectedServiceId) { this.selectedServiceId = selectedServiceId; }

    public Long getSelectedVehicleId() { return selectedVehicleId; }
    public void setSelectedVehicleId(Long selectedVehicleId) { this.selectedVehicleId = selectedVehicleId; }

    public Long getSelectedAddressId() { return selectedAddressId; }
    public void setSelectedAddressId(Long selectedAddressId) { this.selectedAddressId = selectedAddressId; }

    public LocalDate getSelectedDate() { return selectedDate; }
    public void setSelectedDate(LocalDate selectedDate) { this.selectedDate = selectedDate; }

    public LocalTime getSelectedTime() { return selectedTime; }
    public void setSelectedTime(LocalTime selectedTime) { this.selectedTime = selectedTime; }
}
