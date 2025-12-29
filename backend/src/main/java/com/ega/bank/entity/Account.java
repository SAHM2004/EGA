package com.ega.bank.entity;

import com.ega.bank.enums.AccountType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "account_type_discriminator", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Account {
    @Id
    private String numeroCompte;

    private LocalDate dateCreation;
    private double solde;

    @Enumerated(EnumType.STRING)
    private AccountType type;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    // Informations supplémentaires (KYC bancaire)
    private String profession; // Ex: Enseignant, Commerçant, Étudiant
    private Double revenusMensuels; // Revenus mensuels estimés
    private String employeur; // Nom de l'employeur/entreprise
    private String objectifCompte; // Ex: Épargne, Salaire, Commerce
    private String agenceRattachement; // Agence de gestion du compte
    private String personneUrgence; // Personne à contacter en cas d'urgence
    private String telephoneUrgence; // Téléphone de la personne d'urgence
}
