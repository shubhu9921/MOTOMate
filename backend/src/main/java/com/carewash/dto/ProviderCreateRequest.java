package com.carewash.dto;

import com.carewash.entity.ProviderSpecialization;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProviderCreateRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Employee code is required")
    private String employeeCode;

    private ProviderSpecialization specialization;
    private Boolean providesHomeService = true;
    private Boolean providesStationService = true;
    private Double serviceAreaRadius = 15.0; // default to 15km
}
