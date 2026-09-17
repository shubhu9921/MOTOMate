package com.carewash.repository;

import com.carewash.entity.ProviderSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProviderSlotRepository extends JpaRepository<ProviderSlot, Long> {
    List<ProviderSlot> findByProviderIdAndSlotDate(Long providerId, LocalDate slotDate);
    List<ProviderSlot> findByProviderIdAndSlotDateAndIsBookedFalse(Long providerId, LocalDate slotDate);
}
