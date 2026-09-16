package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.BookingDto;
import com.carewash.dto.BookingRequest;
import com.carewash.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        BookingDto booking = bookingService.createBooking(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.<BookingDto>builder()
                .success(true)
                .message("Booking created successfully")
                .data(booking)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingDto>>> getUserBookings(Authentication authentication) {
        List<BookingDto> bookings = bookingService.getUserBookings(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<List<BookingDto>>builder()
                .success(true)
                .message("Bookings fetched successfully")
                .data(bookings)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingById(@PathVariable Long id, Authentication authentication) {
        BookingDto booking = bookingService.getBookingById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.<BookingDto>builder()
                .success(true)
                .message("Booking fetched successfully")
                .data(booking)
                .build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(@PathVariable Long id, Authentication authentication) {
        BookingDto booking = bookingService.cancelBooking(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.<BookingDto>builder()
                .success(true)
                .message("Booking cancelled successfully")
                .data(booking)
                .build());
    }
}
