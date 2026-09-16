package com.carewash.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ServiceDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer durationMinutes;
    private Boolean active;
    private Double averageRating;
    private Long totalReviews;
}
