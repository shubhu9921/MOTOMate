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
public class ReviewDto {
    private Long id;
    private Long bookingId;
    private Long userId;
    private String userName;
    private Long serviceId;
    private Integer rating;
    private String comment;
    private Boolean visible;
    private LocalDateTime createdAt;
}
