package com.ega.bank.controller;

import com.ega.bank.dto.AuthRequestDTO;
import com.ega.bank.entity.User;
import com.ega.bank.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody AuthRequestDTO request) {
        authService.register(request);
        return ResponseEntity.ok(Map.of("message",
                "Inscription réussie. Votre compte est en attente de validation par un administrateur."));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequestDTO request) {
        String token = authService.login(request);
        var user = authService.getUserByUsername(request.getUsername());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole()));
    }

    @GetMapping("/pending-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(authService.getPendingUsers());
    }

    @PostMapping("/activate/{username:.+}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateUser(@PathVariable String username) {
        authService.activateUser(username);
        return ResponseEntity.ok(Map.of("message", "Compte activé avec succès."));
    }

    @PostMapping("/reject/{username:.+}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> rejectUser(
            @PathVariable String username,
            @RequestBody Map<String, String> payload) {
        String reason = payload.getOrDefault("reason", "Informations incomplètes ou incorrectes");
        authService.rejectUser(username, reason);
        return ResponseEntity.ok(Map.of("message", "Compte rejeté et utilisateur notifié par email."));
    }

    @GetMapping("/debug-users")
    public List<String> debugUsers() {
        return authService.getAllUsernames();
    }
}
