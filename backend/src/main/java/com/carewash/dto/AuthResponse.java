package com.carewash.dto;

import com.carewash.entity.Role;
import lombok.Builder;
import lombok.Data;

import java.util.List;

public class AuthResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private Role role;
    private List<String> permissions;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String name, String email, Role role, List<String> permissions) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.permissions = permissions;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public List<String> getPermissions() { return permissions; }
    public void setPermissions(List<String> permissions) { this.permissions = permissions; }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private Long id;
        private String name;
        private String email;
        private Role role;
        private List<String> permissions;

        AuthResponseBuilder() {}

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder id(Long id) { this.id = id; return this; }
        public AuthResponseBuilder name(String name) { this.name = name; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder role(Role role) { this.role = role; return this; }
        public AuthResponseBuilder permissions(List<String> permissions) { this.permissions = permissions; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, id, name, email, role, permissions);
        }
    }
}
