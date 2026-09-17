package com.carewash.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSupportRequestDto {
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private Long bookingId;
}
