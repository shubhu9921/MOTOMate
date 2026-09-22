package com.carewash.service;

import com.carewash.dto.WhatsAppIncomingMessage;
import com.carewash.entity.WhatsAppConversation;
import com.carewash.entity.WhatsAppConversationState;
import com.carewash.entity.WhatsAppMessageStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class WhatsAppMessageProcessor {

    @Autowired
    private WhatsAppConversationService conversationService;

    @Autowired
    private WhatsAppService whatsAppService;

    private static final List<String> MAIN_MENU_COMMANDS = Arrays.asList("hi", "hello", "hey", "start", "motormate", "menu");

    public void processIncomingMessage(WhatsAppIncomingMessage incomingMessage) {
        // 1. Check duplicate
        if (conversationService.isDuplicateMessage(incomingMessage.getMessageId())) {
            System.out.println("Duplicate WhatsApp message detected and ignored: " + incomingMessage.getMessageId());
            return;
        }

        // 2. Load or create conversation
        WhatsAppConversation conversation = conversationService.getOrCreateConversation(incomingMessage.getPhoneNumber());

        // 3. Save incoming message
        conversationService.saveIncomingMessage(
                conversation.getId(),
                incomingMessage.getMessageId(),
                incomingMessage.getText(),
                incomingMessage.getMessageType()
        );

        // 4. Handle non-text messages
        if (!"text".equalsIgnoreCase(incomingMessage.getMessageType())) {
            sendAndSaveResponse(conversation, "Sorry, I currently support text messages only.\nPlease reply with Hi to see the MotorMate menu.");
            return;
        }

        // 5. Process state machine
        String text = incomingMessage.getText() != null ? incomingMessage.getText().trim().toLowerCase() : "";

        // Global override commands
        if (MAIN_MENU_COMMANDS.contains(text)) {
            handleMainMenuState(conversation, "menu"); // Force menu
            return;
        }

        WhatsAppConversationState currentState = conversation.getCurrentState();

        switch (currentState) {
            case NEW:
            case MAIN_MENU:
            case COMPLETED:
                handleMainMenuState(conversation, text);
                break;
            case SUPPORT:
                handleSupportState(conversation, text);
                break;
            default:
                // For unhandled Phase 3 states, push back to main menu
                handleMainMenuState(conversation, "menu");
                break;
        }
    }

    private void handleMainMenuState(WhatsAppConversation conversation, String text) {
        if (MAIN_MENU_COMMANDS.contains(text) || conversation.getCurrentState() == WhatsAppConversationState.NEW) {
            conversationService.updateConversationState(conversation.getId(), WhatsAppConversationState.MAIN_MENU);
            String menu = "Welcome to MotorMate 🚗\nHow can we help you?\n1. Book a Car Wash\n2. View Services\n3. My Bookings\n4. Booking Status\n5. Contact Support\n\nReply with a number.";
            sendAndSaveResponse(conversation, menu);
            return;
        }

        switch (text) {
            case "1":
                sendAndSaveResponse(conversation, "Booking a car wash is coming next.\nFor now, please use the MotorMate website to make a booking:\nhttps://motomate-app.netlify.app\n\nPhase 3 will connect WhatsApp directly to the MotorMate booking system.");
                break;
            case "2":
                sendAndSaveResponse(conversation, "MotorMate Services 🚗\nOur available services can be viewed here:\nhttps://motomate-app.netlify.app\n\nDirect WhatsApp service selection will be enabled in Phase 3.");
                break;
            case "3":
                sendAndSaveResponse(conversation, "Your WhatsApp account is not connected to the MotorMate booking system yet.\nThis feature will be enabled in Phase 3.");
                break;
            case "4":
                sendAndSaveResponse(conversation, "Booking status through WhatsApp will be enabled in Phase 3.\nPlease use your MotorMate account for the current booking status.");
                break;
            case "5":
                conversationService.updateConversationState(conversation.getId(), WhatsAppConversationState.SUPPORT);
                sendAndSaveResponse(conversation, "MotorMate Support 🚗\nPlease type your issue and our support team will assist you.\nType MENU to return to the main menu.");
                break;
            default:
                sendAndSaveResponse(conversation, "Please select one of the following:\n1. Book a Car Wash\n2. View Services\n3. My Bookings\n4. Booking Status\n5. Contact Support");
                break;
        }
    }

    private void handleSupportState(WhatsAppConversation conversation, String text) {
        if (text.equals("menu")) {
            handleMainMenuState(conversation, "menu");
        } else {
            // Save as support message logic would go here
            sendAndSaveResponse(conversation, "Thank you for contacting MotorMate Support.\nYour message has been received.\nOur support team will get back to you.\nType MENU to return to the main menu.");
        }
    }

    private void sendAndSaveResponse(WhatsAppConversation conversation, String responseText) {
        // Send via Meta API
        whatsAppService.sendWhatsAppMessage(conversation.getPhoneNumber(), responseText);
        
        // Save outgoing message locally
        conversationService.saveOutgoingMessage(conversation.getId(), responseText, WhatsAppMessageStatus.SENT);
    }
}
