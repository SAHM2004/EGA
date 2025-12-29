package com.ega.bank.controller;

import com.ega.bank.entity.AccountRequest;
import com.ega.bank.service.AccountRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/account-requests")
@RequiredArgsConstructor
public class AccountRequestController {
    private final AccountRequestService requestService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<AccountRequest> createRequest(Principal principal, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(requestService.createRequest(principal.getName(), body));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<AccountRequest>> getMyRequests(Principal principal) {
        return ResponseEntity.ok(requestService.getMyRequests(principal.getName()));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AccountRequest>> getPending() {
        List<AccountRequest> requests = requestService.getAllPending();
        System.out.println("DEBUG: Nombre de demandes trouvees: " + requests.size());
        for (AccountRequest req : requests) {
            System.out.println("DEBUG: Demande ID: " + req.getId() + ", Client: "
                    + (req.getClient() != null ? req.getClient().getNom() : "NULL"));
        }
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approve(@PathVariable Long id) {
        requestService.approveRequest(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        requestService.rejectRequest(id, body.get("reason"));
        return ResponseEntity.ok().build();
    }
}
