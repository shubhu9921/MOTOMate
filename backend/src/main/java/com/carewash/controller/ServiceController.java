package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.ServiceDto;
import com.carewash.service.CarWashService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private CarWashService carWashService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getAllServices() {
        List<ServiceDto> services = carWashService.getAllActiveServices();
        return ResponseEntity.ok(ApiResponse.<List<ServiceDto>>builder()
                .success(true)
                .message("Services fetched successfully")
                .data(services)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceDto>> getServiceById(@PathVariable Long id) {
        ServiceDto service = carWashService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.<ServiceDto>builder()
                .success(true)
                .message("Service fetched successfully")
                .data(service)
                .build());
    }
}
