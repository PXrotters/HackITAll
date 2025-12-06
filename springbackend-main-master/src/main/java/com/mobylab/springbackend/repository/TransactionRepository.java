package com.mobylab.springbackend.repository;

import com.mobylab.springbackend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByAccountIdOrderByCreatedAtDesc(Long accountId);
}
