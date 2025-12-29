package com.ega.bank.dto;

import com.ega.bank.enums.TransactionType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private Long id;
    private double montant;
    private LocalDateTime dateOperation;
    private TransactionType type;
    private String accountId;
}
