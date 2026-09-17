package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.VehicleDto;
import com.carewash.dto.VehicleRequest;
import com.carewash.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleDto>> addVehicle(@Valid @RequestBody VehicleRequest request, Authentication authentication) {
        VehicleDto vehicle = vehicleService.addVehicle(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.<VehicleDto>builder()
                .success(true)
                .message("Vehicle added successfully")
                .data(vehicle)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleDto>>> getUserVehicles(Authentication authentication) {
        List<VehicleDto> vehicles = vehicleService.getUserVehicles(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<List<VehicleDto>>builder()
                .success(true)
                .message("Vehicles fetched successfully")
                .data(vehicles)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleDto>> getVehicleById(@PathVariable Long id, Authentication authentication) {
        VehicleDto vehicle = vehicleService.getVehicleById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.<VehicleDto>builder()
                .success(true)
                .message("Vehicle fetched successfully")
                .data(vehicle)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleDto>> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequest request, Authentication authentication) {
        VehicleDto vehicle = vehicleService.updateVehicle(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.<VehicleDto>builder()
                .success(true)
                .message("Vehicle updated successfully")
                .data(vehicle)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long id, Authentication authentication) {
        vehicleService.deleteVehicle(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Vehicle deleted successfully")
                .build());
    }
}
