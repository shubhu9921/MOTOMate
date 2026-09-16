package com.carewash.repository;

import com.carewash.entity.ServiceProvider;
import com.carewash.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    Optional<ServiceProvider> findByUser(User user);
    Optional<ServiceProvider> findByUserId(Long userId);
    boolean existsByEmployeeCode(String employeeCode);
    List<ServiceProvider> findByStatus(com.carewash.entity.ProviderStatus status);
}
