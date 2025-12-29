package com.ega.bank.repository;

import com.ega.bank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCompteNumeroCompteAndDateOperationBetween(String numeroCompte, LocalDateTime start,
            LocalDateTime end);
}
