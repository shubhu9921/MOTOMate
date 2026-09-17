package com.carewash.service;

import com.carewash.dto.CreateSupportRequestDto;
import com.carewash.dto.SupportRequestDto;
import com.carewash.entity.Booking;
import com.carewash.entity.SupportRequest;
import com.carewash.entity.User;
import com.carewash.repository.BookingRepository;
import com.carewash.repository.SupportRequestRepository;
import com.carewash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportRequestService {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public SupportRequestDto createRequest(String email, CreateSupportRequestDto requestDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = null;
        if (requestDto.getBookingId() != null) {
            booking = bookingRepository.findById(requestDto.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            if (!booking.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Booking does not belong to user");
            }
        }

        SupportRequest supportRequest = SupportRequest.builder()
                .user(user)
                .relatedBooking(booking)
                .category(requestDto.getCategory())
                .subject(requestDto.getSubject())
                .description(requestDto.getDescription())
                .status("OPEN")
                .build();

        supportRequest = supportRequestRepository.save(supportRequest);
        return mapToDto(supportRequest);
    }

    public List<SupportRequestDto> getUserRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return supportRequestRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private SupportRequestDto mapToDto(SupportRequest request) {
        return SupportRequestDto.builder()
                .id(request.getId())
                .category(request.getCategory())
                .subject(request.getSubject())
                .description(request.getDescription())
                .status(request.getStatus())
                .bookingId(request.getRelatedBooking() != null ? request.getRelatedBooking().getId() : null)
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
