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
    public BookingDto createBooking(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        return bookingService.createBooking(authentication.getName(), request);
    }

    @GetMapping
    public List<BookingDto> getUserBookings(Authentication authentication) {
        return bookingService.getUserBookings(authentication.getName());
    }

    @GetMapping("/{id}")
    public BookingDto getBookingById(@PathVariable Long id, Authentication authentication) {
        return bookingService.getBookingById(authentication.getName(), id);
    }

    @PutMapping("/{id}/cancel")
    public BookingDto cancelBooking(@PathVariable Long id, Authentication authentication) {
        return bookingService.cancelBooking(authentication.getName(), id);
    }
}
