package com.carewash.service;

import com.carewash.dto.PaymentDto;
import com.carewash.entity.Booking;
import com.carewash.entity.Payment;
import com.carewash.entity.User;
import com.carewash.repository.BookingRepository;
import com.carewash.repository.PaymentRepository;
import com.carewash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<PaymentDto> getUserPayments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> userBookings = bookingRepository.findByUserId(user.getId());
        
        return userBookings.stream()
                .map(booking -> paymentRepository.findByBookingId(booking.getId()).orElse(null))
                .filter(payment -> payment != null)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private PaymentDto mapToDto(Payment payment) {
        return PaymentDto.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .serviceName(payment.getBooking().getService().getName())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
