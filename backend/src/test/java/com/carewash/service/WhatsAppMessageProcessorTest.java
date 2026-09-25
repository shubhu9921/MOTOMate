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

    @Mock
    private com.carewash.repository.WhatsAppConversationRepository conversationRepository;

    @Mock
    private com.carewash.repository.ServiceRepository serviceRepository;

    private WhatsAppConversation conversation;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        conversation = WhatsAppConversation.builder()
                .id(1L)
                .phoneNumber("1234567890")
                .userId(10L)
                .currentState(WhatsAppConversationState.NEW)
                .build();
        
        when(conversationService.getOrCreateConversation(any())).thenReturn(conversation);
        when(conversationService.isDuplicateMessage(any())).thenReturn(false);
    }

    @Test
    public void testDuplicateMessage() {
        when(conversationService.isDuplicateMessage("dup-id")).thenReturn(true);
        WhatsAppIncomingMessage msg = WhatsAppIncomingMessage.builder()
                .messageId("dup-id")
                .build();
        
        processor.processIncomingMessage(msg);
        
        verify(conversationService, never()).getOrCreateConversation(any());
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
        
        verify(conversationService).clearSession(1L);
        verify(conversationRepository).save(argThat(c -> c.getCurrentState() == WhatsAppConversationState.MAIN_MENU));
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("MotorMate Menu"));
        verify(conversationService).saveOutgoingMessage(eq(1L), contains("MotorMate Menu"), eq(com.carewash.entity.WhatsAppMessageStatus.SENT));
    }

    @Test
    public void testMenuOption1() {
        conversation.setCurrentState(WhatsAppConversationState.MAIN_MENU);
        WhatsAppIncomingMessage msg = WhatsAppIncomingMessage.builder()
                .messageId("msg1")
                .messageType("text")
                .text("1")
                .build();
        
        // Mock a service so the list isn't empty
        com.carewash.entity.Service service = new com.carewash.entity.Service();
        service.setName("Basic Wash");
        service.setPrice(499.0);
        service.setActive(true);
        when(serviceRepository.findAll()).thenReturn(new java.util.ArrayList<>(java.util.Collections.singletonList(service)));
        
        processor.processIncomingMessage(msg);
        
        verify(conversationRepository).save(argThat(c -> c.getCurrentState() == WhatsAppConversationState.SELECTING_SERVICE));
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("Select a service to book"));
    }

    @Test
    public void testMenuOption1_UnlinkedUser() {
        conversation.setCurrentState(WhatsAppConversationState.MAIN_MENU);
        conversation.setUserId(null);
        WhatsAppIncomingMessage msg = WhatsAppIncomingMessage.builder()
                .messageId("msg2")
                .messageType("text")
                .text("1")
                .build();
        
        processor.processIncomingMessage(msg);
        
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("not linked to a MotorMate account"));
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
        
        verify(conversationRepository).save(argThat(c -> c.getCurrentState() == WhatsAppConversationState.SUPPORT));
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("MotorMate Support"));
        verify(conversationService).saveOutgoingMessage(eq(1L), contains("MotorMate Support"), eq(com.carewash.entity.WhatsAppMessageStatus.SENT));
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
        
        verify(conversationService).clearSession(1L);
        verify(conversationRepository).save(argThat(c -> c.getCurrentState() == WhatsAppConversationState.MAIN_MENU));
        verify(whatsAppService).sendWhatsAppMessage(any(), contains("MotorMate Menu"));
        verify(conversationService).saveOutgoingMessage(eq(1L), contains("MotorMate Menu"), eq(com.carewash.entity.WhatsAppMessageStatus.SENT));
    }
}

