package com.carewash.repository;

import com.carewash.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByActiveTrue();
    long countByActiveTrue();
}
