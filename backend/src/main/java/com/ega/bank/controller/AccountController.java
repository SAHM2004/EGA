package com.ega.bank.controller;

import com.ega.bank.dto.AccountDTO;
import com.ega.bank.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO accountDTO) {
        return ResponseEntity.ok(accountService.createAccount(accountDTO));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AccountDTO>> getMyAccounts(java.security.Principal principal) {
        return ResponseEntity.ok(accountService.getAccountsByUsername(principal.getName()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{numero}")
    public ResponseEntity<AccountDTO> getAccount(@PathVariable String numero) {
        return ResponseEntity.ok(accountService.getAccount(numero));
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AccountDTO>> getAccountsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(accountService.getAccountsByClient(clientId));
    }
}
