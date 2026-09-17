package com.carewash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportRequestDto {
    private Long id;
    private String category;
    private String subject;
    private String description;
    private String status;
    private Long bookingId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
