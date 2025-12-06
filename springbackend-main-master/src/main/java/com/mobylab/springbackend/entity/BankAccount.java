package com.mobylab.springbackend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_accounts")
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(unique = true)
    private String iban;

    @Column(nullable = false)
    private String currency; // RON, EUR

    @Column(nullable = false)
    private BigDecimal balance = BigDecimal.ZERO;

    private String name;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public BankAccount setId(Long id) {
        this.id = id;
        return this;
    }

    public User getUser() {
        return user;
    }

    public BankAccount setUser(User user) {
        this.user = user;
        return this;
    }

    public String getIban() {
        return iban;
    }

    public BankAccount setIban(String iban) {
        this.iban = iban;
        return this;
    }

    public String getCurrency() {
        return currency;
    }

    public BankAccount setCurrency(String currency) {
        this.currency = currency;
        return this;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public BankAccount setBalance(BigDecimal balance) {
        this.balance = balance;
        return this;
    }

    public String getName() {
        return name;
    }

    public BankAccount setName(String name) {
        this.name = name;
        return this;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public BankAccount setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }
}
