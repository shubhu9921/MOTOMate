package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.PaymentDto;
import com.carewash.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentDto>>> getUserPayments(Authentication authentication) {
        List<PaymentDto> payments = paymentService.getUserPayments(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<List<PaymentDto>>builder()
                .success(true)
                .message("Payments fetched successfully")
                .data(payments)
                .build());
    }
}
