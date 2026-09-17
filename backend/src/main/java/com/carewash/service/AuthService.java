package com.carewash.service;

import com.carewash.dto.AuthRequest;
import com.carewash.dto.AuthResponse;
import com.carewash.dto.RegisterRequest;
import com.carewash.entity.Role;
import com.carewash.entity.User;
import com.carewash.exception.BadRequestException;
import com.carewash.repository.UserRepository;
import com.carewash.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        List<String> permissions = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> !auth.startsWith("ROLE_"))
                .collect(Collectors.toList());

        AuthResponse response = new AuthResponse();
        response.setToken(jwt);
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setPermissions(permissions);
        return response;
    }

    public AuthResponse registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPhone(signUpRequest.getPhone());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(Role.CUSTOMER);

        userRepository.save(user);

        // Auto login after registration
        return authenticateUser(new AuthRequest(signUpRequest.getEmail(), signUpRequest.getPassword()));
    }

    public User getUserFromToken(String token) {
        String email = jwtUtils.getUserNameFromJwtToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
    }
}
