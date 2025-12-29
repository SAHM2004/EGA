package com.ega.bank.dto;

import com.ega.bank.enums.AccountType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AccountDTO {
    private String numeroCompte;
    private LocalDate dateCreation;
    private double solde;
    private AccountType type;
    private Long clientId;

    // For specific types
    private double tauxInteret;
    private double decouvert;

    // Informations KYC bancaires
    private String profession;
    private Double revenusMensuels;
    private String employeur;
    private String objectifCompte;
    private String agenceRattachement;
    private String personneUrgence;
    private String telephoneUrgence;
}
