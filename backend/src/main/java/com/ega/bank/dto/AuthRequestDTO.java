package com.ega.bank.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AuthRequestDTO {
    private String username;
    private String password;

    // Détails du client pour l'inscription (KYC)
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private LocalDate dateNaissance;
    private String sexe;
    private String nationalite;
}
