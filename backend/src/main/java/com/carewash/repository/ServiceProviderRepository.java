package com.carewash.repository;

import com.carewash.entity.ServiceProvider;
import com.carewash.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    Optional<ServiceProvider> findByUser(User user);
    Optional<ServiceProvider> findByUserId(Long userId);
    boolean existsByEmployeeCode(String employeeCode);
    List<ServiceProvider> findByStatus(com.carewash.entity.ProviderStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ServiceProvider s WHERE s.id = :id")
    Optional<ServiceProvider> findByIdWithPessimisticWriteLock(@Param("id") Long id);
}
