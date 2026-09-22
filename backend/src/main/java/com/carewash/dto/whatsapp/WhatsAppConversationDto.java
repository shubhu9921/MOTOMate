package com.carewash.dto.whatsapp;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WhatsAppConversationDto {
    private Long id;
    private String phoneNumber;
    private String state;
    private String customerName;
    private LocalDateTime lastMessageAt;
    private boolean active;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    // For masking phone numbers securely
    public void setMaskedPhoneNumber(String phone) {
        if (phone == null || phone.length() < 4) {
            this.phoneNumber = phone;
            return;
        }
        String last4 = phone.substring(phone.length() - 4);
        String prefix = phone.substring(0, phone.length() - 4).replaceAll("[0-9]", "*");
        this.phoneNumber = prefix + last4;
    }
}
