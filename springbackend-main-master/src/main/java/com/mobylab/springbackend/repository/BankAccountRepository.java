package com.mobylab.springbackend.repository;

import com.mobylab.springbackend.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    List<BankAccount> findAllByUserId(Long userId);

    Optional<BankAccount> findByIban(String iban);

    boolean existsByIban(String iban);
}
