package com.carewash.repository;

import com.carewash.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    Optional<OtpEntity> findTopByEmailAndPurposeOrderByCreatedAtDesc(String email, OtpEntity.OtpPurpose purpose);
    Optional<OtpEntity> findByResetToken(String resetToken);
}
