package com.ega.bank.service;

import com.ega.bank.dto.TransactionDTO;
import com.ega.bank.entity.Account;
import com.ega.bank.entity.CurrentAccount;
import com.ega.bank.entity.Transaction;
import com.ega.bank.enums.TransactionType;
import com.ega.bank.exception.InsufficientBalanceException;
import com.ega.bank.exception.ResourceNotFoundException;
import com.ega.bank.repository.AccountRepository;
import com.ega.bank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final com.ega.bank.repository.UserRepository userRepository;

    @Transactional
    public TransactionDTO deposit(String username, String accountId, double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + accountId));

        // Vérification de propriété
        com.ega.bank.entity.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (account.getClient() == null || !account.getClient().getId().equals(user.getClient().getId())) {
            throw new RuntimeException("Accès non autorisé à ce compte");
        }

        account.setSolde(account.getSolde() + amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setMontant(amount);
        transaction.setDateOperation(LocalDateTime.now());
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setCompte(account);

        System.out.println("DEBUG: Dépôt de " + amount + " sur le compte " + accountId + " par " + username);

        return mapToDTO(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionDTO withdraw(String username, String accountId, double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + accountId));

        // Vérification de propriété
        com.ega.bank.entity.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (account.getClient() == null || !account.getClient().getId().equals(user.getClient().getId())) {
            throw new RuntimeException("Accès non autorisé à ce compte");
        }

        double availableBalance = account.getSolde();
        if (account instanceof CurrentAccount) {
            availableBalance += ((CurrentAccount) account).getDecouvert();
        }

        if (availableBalance < amount) {
            throw new InsufficientBalanceException("Solde insuffisant");
        }

        account.setSolde(account.getSolde() - amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setMontant(amount);
        transaction.setDateOperation(LocalDateTime.now());
        transaction.setType(TransactionType.WITHDRAWAL);
        transaction.setCompte(account);

        System.out.println("DEBUG: Retrait de " + amount + " sur le compte " + accountId + " par " + username);

        return mapToDTO(transactionRepository.save(transaction));
    }

    @Transactional
    public void transfer(String username, String sourceId, String destId, double amount) {
        withdraw(username, sourceId, amount);

        // Pour le dépôt destination, on ne vérifie pas le username (car c'est un
        // destinataire tiers)
        Account destAccount = accountRepository.findById(destId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte de destination non trouvé: " + destId));

        destAccount.setSolde(destAccount.getSolde() + amount);
        accountRepository.save(destAccount);

        Transaction transaction = new Transaction();
        transaction.setMontant(amount);
        transaction.setDateOperation(LocalDateTime.now());
        transaction.setType(TransactionType.TRANSFER); // Changement ici
        transaction.setCompte(destAccount);
        transactionRepository.save(transaction);

        System.out.println(
                "DEBUG: Transfert de " + amount + " de " + sourceId + " vers " + destId + " initié par " + username);
    }

    private TransactionDTO mapToDTO(Transaction t) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(t.getId());
        dto.setMontant(t.getMontant());
        dto.setDateOperation(t.getDateOperation());
        dto.setType(t.getType());
        if (t.getCompte() != null) {
            dto.setAccountId(t.getCompte().getNumeroCompte());
        }
        return dto;
    }

    public List<TransactionDTO> getTransactions(String accountId, LocalDateTime start, LocalDateTime end) {
        try {
            System.out.println("DEBUG: Fetching transactions for account " + accountId);
            List<Transaction> transactions = transactionRepository.findByCompteNumeroCompteAndDateOperationBetween(accountId, start, end);
            System.out.println("DEBUG: Found " + transactions.size() + " transactions in DB");
            return transactions.stream()
                    .map(t -> {
                        try {
                            return this.mapToDTO(t);
                        } catch (Exception e) {
                            System.err.println("DEBUG: Error mapping transaction ID " + t.getId() + ": " + e.getMessage());
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("DEBUG: Error in getTransactions: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
