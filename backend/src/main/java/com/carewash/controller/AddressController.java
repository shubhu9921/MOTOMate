package com.carewash.controller;

import com.carewash.dto.AddressDto;
import com.carewash.dto.AddressRequest;
import com.carewash.dto.ApiResponse;
import com.carewash.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(@Valid @RequestBody AddressRequest request, Authentication authentication) {
        AddressDto address = addressService.addAddress(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.<AddressDto>builder()
                .success(true)
                .message("Address added successfully")
                .data(address)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressDto>>> getUserAddresses(Authentication authentication) {
        List<AddressDto> addresses = addressService.getUserAddresses(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<List<AddressDto>>builder()
                .success(true)
                .message("Addresses fetched successfully")
                .data(addresses)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(@PathVariable Long id, @Valid @RequestBody AddressRequest request, Authentication authentication) {
        AddressDto address = addressService.updateAddress(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.<AddressDto>builder()
                .success(true)
                .message("Address updated successfully")
                .data(address)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id, Authentication authentication) {
        addressService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Address deleted successfully")
                .build());
    }
}
