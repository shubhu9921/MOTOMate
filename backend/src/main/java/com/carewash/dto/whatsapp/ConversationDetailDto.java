package com.carewash.dto.whatsapp;

import lombok.Data;
import java.util.List;

@Data
public class ConversationDetailDto {
    private WhatsAppConversationDto conversation;
    private List<WhatsAppMessageDto> messages;
    private String selectedService;
    private String selectedVehicle;
    private String selectedAddress;

    public WhatsAppConversationDto getConversation() { return conversation; }
    public void setConversation(WhatsAppConversationDto conversation) { this.conversation = conversation; }

    public List<WhatsAppMessageDto> getMessages() { return messages; }
    public void setMessages(List<WhatsAppMessageDto> messages) { this.messages = messages; }

    public String getSelectedService() { return selectedService; }
    public void setSelectedService(String selectedService) { this.selectedService = selectedService; }

    public String getSelectedVehicle() { return selectedVehicle; }
    public void setSelectedVehicle(String selectedVehicle) { this.selectedVehicle = selectedVehicle; }

    public String getSelectedAddress() { return selectedAddress; }
    public void setSelectedAddress(String selectedAddress) { this.selectedAddress = selectedAddress; }
}
