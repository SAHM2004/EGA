package com.ega.bank.service;

import com.ega.bank.dto.AccountDTO;
import com.ega.bank.entity.Account;
import com.ega.bank.entity.Client;
import com.ega.bank.entity.CurrentAccount;
import com.ega.bank.entity.SavingsAccount;
import com.ega.bank.enums.AccountType;
import com.ega.bank.exception.ResourceNotFoundException;
import com.ega.bank.entity.User;
import com.ega.bank.repository.AccountRepository;
import com.ega.bank.repository.ClientRepository;
import com.ega.bank.repository.UserRepository;
import com.ega.bank.util.IbanGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final IbanGenerator ibanGenerator;
    private final com.ega.bank.repository.TransactionRepository transactionRepository;

    public AccountDTO createAccount(AccountDTO accountDTO) {
        Client client = clientRepository.findById(accountDTO.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé: " + accountDTO.getClientId()));

        Account account;
        if (accountDTO.getType() == AccountType.SAVINGS) {
            SavingsAccount sa = new SavingsAccount();
            sa.setTauxInteret(accountDTO.getTauxInteret());
            account = sa;
        } else {
            CurrentAccount ca = new CurrentAccount();
            ca.setDecouvert(accountDTO.getDecouvert());
            account = ca;
        }

        account.setNumeroCompte(ibanGenerator.generateIban());
        account.setDateCreation(LocalDate.now());
        account.setSolde(accountDTO.getSolde()); // Utilise le solde passé (peut être le dépôt initial)
        account.setType(accountDTO.getType());
        account.setClient(client);

        // Informations KYC bancaires
        account.setProfession(accountDTO.getProfession());
        account.setRevenusMensuels(accountDTO.getRevenusMensuels());
        account.setEmployeur(accountDTO.getEmployeur());
        account.setObjectifCompte(accountDTO.getObjectifCompte());
        account.setAgenceRattachement(accountDTO.getAgenceRattachement());
        account.setPersonneUrgence(accountDTO.getPersonneUrgence());
        account.setTelephoneUrgence(accountDTO.getTelephoneUrgence());

        Account savedAccount = accountRepository.save(account);

        // Si solde initial > 0, on crée une transaction de versement initial
        if (savedAccount.getSolde() > 0) {
            com.ega.bank.entity.Transaction initialTransaction = new com.ega.bank.entity.Transaction();
            initialTransaction.setMontant(savedAccount.getSolde());
            initialTransaction.setDateOperation(java.time.LocalDateTime.now());
            initialTransaction.setType(com.ega.bank.enums.TransactionType.DEPOSIT);
            initialTransaction.setCompte(savedAccount);
            transactionRepository.save(initialTransaction);
            System.out.println("DEBUG: Transaction de dépôt initial créée pour " + savedAccount.getNumeroCompte());
        }

        return mapToDTO(savedAccount);
    }

    public AccountDTO getAccount(String numeroInfo) {
        Account account = accountRepository.findById(numeroInfo)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + numeroInfo));
        return mapToDTO(account);
    }

    public List<AccountDTO> getAccountsByClient(Long clientId) {
        return accountRepository.findByClientId(clientId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AccountDTO> getAccountsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        if (user.getClient() == null) {
            return java.util.Collections.emptyList();
        }
        return getAccountsByClient(user.getClient().getId());
    }

    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AccountDTO mapToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setNumeroCompte(account.getNumeroCompte());
        dto.setDateCreation(account.getDateCreation());
        dto.setSolde(account.getSolde());
        dto.setType(account.getType());
        dto.setClientId(account.getClient().getId());

        // Informations KYC bancaires
        dto.setProfession(account.getProfession());
        dto.setRevenusMensuels(account.getRevenusMensuels());
        dto.setEmployeur(account.getEmployeur());
        dto.setObjectifCompte(account.getObjectifCompte());
        dto.setAgenceRattachement(account.getAgenceRattachement());
        dto.setPersonneUrgence(account.getPersonneUrgence());
        dto.setTelephoneUrgence(account.getTelephoneUrgence());

        if (account instanceof SavingsAccount) {
            dto.setTauxInteret(((SavingsAccount) account).getTauxInteret());
        } else if (account instanceof CurrentAccount) {
            dto.setDecouvert(((CurrentAccount) account).getDecouvert());
        }
        return dto;
    }
}
