package com.carewash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String addressLine;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    private Double latitude;
    private Double longitude;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static AddressBuilder builder() {
        return new AddressBuilder();
    }

    public static class AddressBuilder {
        private Long id;
        private User user;
        private String addressLine;
        private String city;
        private String state;
        private String pincode;
        private Double latitude;
        private Double longitude;
        private LocalDateTime createdAt;

        AddressBuilder() {}

        public AddressBuilder id(Long id) { this.id = id; return this; }
        public AddressBuilder user(User user) { this.user = user; return this; }
        public AddressBuilder addressLine(String addressLine) { this.addressLine = addressLine; return this; }
        public AddressBuilder city(String city) { this.city = city; return this; }
        public AddressBuilder state(String state) { this.state = state; return this; }
        public AddressBuilder pincode(String pincode) { this.pincode = pincode; return this; }
        public AddressBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public AddressBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public AddressBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Address build() {
            Address address = new Address();
            address.setId(id);
            address.setUser(user);
            address.setAddressLine(addressLine);
            address.setCity(city);
            address.setState(state);
            address.setPincode(pincode);
            address.setLatitude(latitude);
            address.setLongitude(longitude);
            address.setCreatedAt(createdAt);
            return address;
        }
    }
}
