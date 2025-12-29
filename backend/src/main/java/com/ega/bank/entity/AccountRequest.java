package com.ega.bank.entity;

import com.ega.bank.enums.AccountType;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) // ✅ Force le chargement du client
    @JoinColumn(name = "client_id")
    private Client client;

    @Enumerated(EnumType.STRING)
    private AccountType requestedType;

    private Double initialDeposit;

    private LocalDateTime requestDate;

    private String status; // PENDING, APPROVED, REJECTED

    private String adminMessage;

    // Informations KYC bancaires ajoutées
    private String profession;
    private Double revenusMensuels;
    private String employeur;
    private String objectifCompte;
    private String agenceRattachement;
    private String personneUrgence;
    private String telephoneUrgence;
}
