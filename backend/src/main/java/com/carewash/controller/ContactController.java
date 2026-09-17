package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.ContactRequest;
import com.carewash.entity.ContactMessage;
import com.carewash.entity.MessageStatus;
import com.carewash.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submitContactMessage(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setPhone(request.getPhone());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());
        message.setStatus(MessageStatus.NEW);
                
        contactMessageRepository.save(message);
        
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Message submitted successfully")
                .build());
    }
}
