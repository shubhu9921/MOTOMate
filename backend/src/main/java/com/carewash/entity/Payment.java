package com.carewash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Using OneToOne instead of ManyToOne since ideally one primary payment per booking,
    // though retries could change this. We'll stick to a simple model where one booking has one payment record.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    @Builder.Default
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    private String transactionId;

    private Double amountReceived;

    private LocalDateTime receivedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by")
    private User receivedBy;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Double getAmountReceived() { return amountReceived; }
    public void setAmountReceived(Double amountReceived) { this.amountReceived = amountReceived; }

    public LocalDateTime getReceivedAt() { return receivedAt; }
    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }

    public User getReceivedBy() { return receivedBy; }
    public void setReceivedBy(User receivedBy) { this.receivedBy = receivedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static PaymentBuilder builder() {
        return new PaymentBuilder();
    }

    public static class PaymentBuilder {
        private Long id;
        private Booking booking;
        private Double amount;
        private String currency = "INR";
        private PaymentMethod method;
        private PaymentStatus status = PaymentStatus.PENDING;
        private String transactionId;
        private Double amountReceived;
        private LocalDateTime receivedAt;
        private User receivedBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        PaymentBuilder() {}

        public PaymentBuilder id(Long id) { this.id = id; return this; }
        public PaymentBuilder booking(Booking booking) { this.booking = booking; return this; }
        public PaymentBuilder amount(Double amount) { this.amount = amount; return this; }
        public PaymentBuilder currency(String currency) { this.currency = currency; return this; }
        public PaymentBuilder method(PaymentMethod method) { this.method = method; return this; }
        public PaymentBuilder status(PaymentStatus status) { this.status = status; return this; }
        public PaymentBuilder transactionId(String transactionId) { this.transactionId = transactionId; return this; }
        public PaymentBuilder amountReceived(Double amountReceived) { this.amountReceived = amountReceived; return this; }
        public PaymentBuilder receivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; return this; }
        public PaymentBuilder receivedBy(User receivedBy) { this.receivedBy = receivedBy; return this; }
        public PaymentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PaymentBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Payment build() {
            Payment payment = new Payment();
            payment.setId(id);
            payment.setBooking(booking);
            payment.setAmount(amount);
            if (currency != null) {
                payment.setCurrency(currency);
            }
            payment.setMethod(method);
            if (status != null) {
                payment.setStatus(status);
            }
            payment.setTransactionId(transactionId);
            payment.setAmountReceived(amountReceived);
            payment.setReceivedAt(receivedAt);
            payment.setReceivedBy(receivedBy);
            payment.setCreatedAt(createdAt);
            payment.setUpdatedAt(updatedAt);
            return payment;
        }
    }
}
