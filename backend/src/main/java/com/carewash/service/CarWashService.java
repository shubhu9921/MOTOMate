package com.carewash.service;

import com.carewash.dto.ServiceDto;
import com.carewash.entity.Service;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

import com.carewash.repository.ReviewRepository;

@org.springframework.stereotype.Service
public class CarWashService {

    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;

    public List<ServiceDto> getAllActiveServices() {
        return serviceRepository.findByActiveTrue().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ServiceDto getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        return mapToDto(service);
    }

    private ServiceDto mapToDto(Service service) {
        Double avgRating = reviewRepository.getAverageRatingForService(service.getId());
        Long totalReviews = reviewRepository.getReviewCountForService(service.getId());
        
        return ServiceDto.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .price(service.getPrice())
                .durationMinutes(service.getDurationMinutes())
                .active(service.getActive())
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalReviews(totalReviews != null ? totalReviews : 0L)
                .build();
    }
}
