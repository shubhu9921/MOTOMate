package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.CreateSupportRequestDto;
import com.carewash.dto.SupportRequestDto;
import com.carewash.service.SupportRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Autowired
    private SupportRequestService supportRequestService;

    @PostMapping
    public ResponseEntity<ApiResponse<SupportRequestDto>> createRequest(@Valid @RequestBody CreateSupportRequestDto request, Authentication authentication) {
        SupportRequestDto supportRequest = supportRequestService.createRequest(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.<SupportRequestDto>builder()
                .success(true)
                .message("Support request created successfully")
                .data(supportRequest)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportRequestDto>>> getUserRequests(Authentication authentication) {
        List<SupportRequestDto> requests = supportRequestService.getUserRequests(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<List<SupportRequestDto>>builder()
                .success(true)
                .message("Support requests fetched successfully")
                .data(requests)
                .build());
    }
}
