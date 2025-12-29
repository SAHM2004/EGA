package com.ega.bank.service;

import com.ega.bank.dto.AccountDTO;
import com.ega.bank.entity.AccountRequest;
import com.ega.bank.entity.Client;
import com.ega.bank.entity.User;
import com.ega.bank.exception.ResourceNotFoundException;
import com.ega.bank.repository.AccountRequestRepository;
import com.ega.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountRequestService {
    private final AccountRequestRepository requestRepository;
    private final AccountService accountService;
    private final UserRepository userRepository;
    private final EmailService emailService; // ✅ Ajout du service email

    @Transactional
    public AccountRequest createRequest(String username, Map<String, Object> data) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé: " + username));

        System.out.println("DEBUG: createRequest - Username: " + username + ", UserID: " + user.getId() + ", Client: "
                + (user.getClient() != null ? user.getClient().getId() : "NULL"));

        if (user.getClient() == null) {
            throw new RuntimeException("Votre profil client est incomplet. Veuillez contacter le support.");
        }

        String type = (String) data.get("type");
        Object depositObj = data.get("initialDeposit");
        Double initialDeposit = 0.0;
        if (depositObj != null) {
            try {
                initialDeposit = Double.parseDouble(depositObj.toString());
            } catch (NumberFormatException e) {
                System.err.println("DEBUG: Format de dépôt initial invalide: " + depositObj);
            }
        }

        AccountRequest request = AccountRequest.builder()
                .client(user.getClient())
                .requestedType(com.ega.bank.enums.AccountType.valueOf(type.toUpperCase()))
                .initialDeposit(initialDeposit)
                .requestDate(LocalDateTime.now())
                .status("PENDING")
                .profession((String) data.get("profession"))
                .revenusMensuels(
                        data.get("revenusMensuels") != null ? Double.parseDouble(data.get("revenusMensuels").toString())
                                : null)
                .employeur((String) data.get("employeur"))
                .objectifCompte((String) data.get("objectifCompte"))
                .agenceRattachement((String) data.get("agenceRattachement"))
                .personneUrgence((String) data.get("personneUrgence"))
                .telephoneUrgence((String) data.get("telephoneUrgence"))
                .build();

        return requestRepository.save(request);
    }

    public List<AccountRequest> getAllPending() {
        return requestRepository.findByStatus("PENDING");
    }

    public List<AccountRequest> getMyRequests(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        if (user.getClient() == null) {
            return java.util.Collections.emptyList();
        }
        return requestRepository.findByClientId(user.getClient().getId());
    }

    @Transactional
    public void approveRequest(Long requestId) {
        AccountRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Cette demande a déjà été traitée.");
        }

        // Création du compte réel
        if (request.getClient() == null) {
            throw new RuntimeException("Impossible d'approuver une demande sans profil client associé.");
        }

        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setClientId(request.getClient().getId());
        accountDTO.setType(request.getRequestedType());
        accountDTO.setSolde(request.getInitialDeposit() != null ? request.getInitialDeposit() : 0.0);

        // Transfert des infos KYC
        accountDTO.setProfession(request.getProfession());
        accountDTO.setRevenusMensuels(request.getRevenusMensuels());
        accountDTO.setEmployeur(request.getEmployeur());
        accountDTO.setObjectifCompte(request.getObjectifCompte());
        accountDTO.setAgenceRattachement(request.getAgenceRattachement());
        accountDTO.setPersonneUrgence(request.getPersonneUrgence());
        accountDTO.setTelephoneUrgence(request.getTelephoneUrgence());

        // Valeurs par défaut selon le type
        if (request.getRequestedType() == com.ega.bank.enums.AccountType.SAVINGS) {
            accountDTO.setTauxInteret(3.5); // Taux standard
        } else {
            accountDTO.setDecouvert(50000.0); // Découvert standard
        }

        System.out.println("DEBUG: Tentative de création du compte pour le client " + request.getClient().getId());
        AccountDTO createdAccount = accountService.createAccount(accountDTO);
        System.out.println("DEBUG: Compte créé avec succès: " + createdAccount.getNumeroCompte());

        request.setStatus("APPROVED");
        requestRepository.save(request);
        System.out.println("DEBUG: Statut de la demande mis à jour vers APPROVED");

        // ✅ Envoi de l'email d'approbation
        try {
            Client client = request.getClient();
            if (client == null || client.getEmail() == null) {
                System.err.println(
                        "ERREUR: Impossible d'envoyer l'email d'approbation car le client ou son email est NULL");
                return;
            }

            String accountType = request.getRequestedType() == com.ega.bank.enums.AccountType.SAVINGS
                    ? "Compte Épargne"
                    : "Compte Courant";

            emailService.sendAccountApprovalEmail(
                    client.getEmail(),
                    client.getNom() + " " + client.getPrenom(),
                    accountType,
                    createdAccount.getNumeroCompte());
        } catch (Exception e) {
            // Log l'erreur mais ne bloque pas la transaction
            System.err.println("Erreur lors de l'envoi de l'email d'approbation : " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional
    public void rejectRequest(Long requestId, String reason) {
        AccountRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée: " + requestId));

        request.setStatus("REJECTED");
        request.setAdminMessage(reason);
        requestRepository.save(request);

        System.out.println("DEBUG: Demande de compte " + requestId + " rejetée. Motif: " + reason);

        // ✅ Envoi de l'email de rejet
        try {
            Client client = request.getClient();
            if (client == null || client.getEmail() == null) {
                System.err.println("ERREUR: Impossible d'envoyer l'email de rejet car le client ou son email est NULL");
                return;
            }

            String accountType = request.getRequestedType() == com.ega.bank.enums.AccountType.SAVINGS
                    ? "Compte Épargne"
                    : "Compte Courant";

            emailService.sendAccountRejectionEmail(
                    client.getEmail(),
                    client.getNom() + " " + client.getPrenom(),
                    accountType,
                    reason);
        } catch (Exception e) {
            // Log l'erreur mais ne bloque pas la transaction
            System.err.println("Erreur lors de l'envoi de l'email de rejet : " + e.getMessage());
            e.printStackTrace();
        }
    }
}
