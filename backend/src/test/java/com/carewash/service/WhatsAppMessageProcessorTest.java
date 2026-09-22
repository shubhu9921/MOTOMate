package com.carewash.service;

import com.carewash.dto.WhatsAppIncomingMessage;
import com.carewash.entity.WhatsAppConversation;
import com.carewash.entity.WhatsAppConversationState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class WhatsAppMessageProcessorTest {

    @InjectMocks
    private WhatsAppMessageProcessor processor;

    @Mock
    private WhatsAppConversationService conversationService;

    @Mock
    private WhatsAppService whatsAppService;

    private WhatsAppConversation conversation;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        conversation = WhatsAppConversation.builder()
                .id(1L)
                .phoneNumber("1234567890")
                .currentState(WhatsAppConversationState.NEW)
                .build();
        
        when(conversationService.getOrCreateConversation(anyString())).thenReturn(conversation);
        when(conversationService.isDuplicateMessage(anyString())).thenReturn(false);
    }

    @Test
    public void testDuplicateMessage() {
        when(conversationService.isDuplicateMessage("dup-id")).thenReturn(true);
        WhatsAppIncomingMessage msg = WhatsAppIncomingMessage.builder()
                .messageId("dup-id")
                .build();
        
        processor.processIncomingMessage(msg);
        
        verify(conversationService, never()).getOrCreateConversation(anyString());
    }

    @Test
    public void testUnsupportedMessageType() {
        WhatsAppIncomingMessage msg = WhatsAppIncomingMessage.builder()
                .messageId("msg1")
                .messageType("image")
                .build();
        
        processor.processIncomingMessage(msg);
        
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("support text messages only"));
    }

    @Test
    public void testHiMessageTransitionsToMainMenu() {
        WhatsAppIncomingMessage msg = WhatsAppIncomingMessage.builder()
                .messageId("msg1")
                .messageType("text")
                .text("Hi")
                .build();
        
        processor.processIncomingMessage(msg);
        
        verify(conversationService).updateConversationState(1L, WhatsAppConversationState.MAIN_MENU);
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("Welcome to MotorMate"));
    }

    @Test
    public void testMenuOption1() {
        conversation.setCurrentState(WhatsAppConversationState.MAIN_MENU);
        WhatsAppIncomingMessage msg = WhatsAppIncomingMessage.builder()
                .messageId("msg1")
                .messageType("text")
                .text("1")
                .build();
        
        processor.processIncomingMessage(msg);
        
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("Booking a car wash is coming next"));
    }

    @Test
    public void testSupportOption5() {
        conversation.setCurrentState(WhatsAppConversationState.MAIN_MENU);
        WhatsAppIncomingMessage msg = WhatsAppIncomingMessage.builder()
                .messageId("msg1")
                .messageType("text")
                .text("5")
                .build();
        
        processor.processIncomingMessage(msg);
        
        verify(conversationService).updateConversationState(1L, WhatsAppConversationState.SUPPORT);
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("MotorMate Support"));
    }

    @Test
    public void testReturnToMenuFromSupport() {
        conversation.setCurrentState(WhatsAppConversationState.SUPPORT);
        WhatsAppIncomingMessage msg = WhatsAppIncomingMessage.builder()
                .messageId("msg1")
                .messageType("text")
                .text("MENU")
                .build();
        
        processor.processIncomingMessage(msg);
        
        verify(conversationService).updateConversationState(1L, WhatsAppConversationState.MAIN_MENU);
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("Welcome to MotorMate"));
    }
}
