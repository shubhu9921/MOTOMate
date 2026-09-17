package com.carewash.repository;

import com.carewash.entity.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
    List<SupportRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
}
