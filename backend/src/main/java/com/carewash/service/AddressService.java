package com.carewash.service;

import com.carewash.dto.AddressDto;
import com.carewash.dto.AddressRequest;
import com.carewash.entity.Address;
import com.carewash.entity.User;
import com.carewash.exception.BadRequestException;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.AddressRepository;
import com.carewash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public AddressDto addAddress(String email, AddressRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = Address.builder()
                .user(user)
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        return mapToDto(addressRepository.save(address));
    }

    public List<AddressDto> getUserAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return addressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AddressDto updateAddress(String email, Long id, AddressRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to update this address");
        }

        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());

        return mapToDto(addressRepository.save(address));
    }

    public void deleteAddress(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to delete this address");
        }

        addressRepository.delete(address);
    }

    private AddressDto mapToDto(Address address) {
        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setUserId(address.getUser().getId());
        dto.setAddressLine(address.getAddressLine());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPincode(address.getPincode());
        dto.setLatitude(address.getLatitude());
        dto.setLongitude(address.getLongitude());
        return dto;
    }
}
