package com.ega.bank.service;

import com.ega.bank.config.JwtUtils;
import com.ega.bank.dto.AuthRequestDTO;
import com.ega.bank.entity.Client;
import com.ega.bank.entity.User;
import com.ega.bank.repository.ClientRepository;
import com.ega.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
        private final UserRepository userRepository;
        private final ClientRepository clientRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;
        private final EmailService emailService;

        @Transactional
        public void register(AuthRequestDTO request) {
                // 1. Création du profil client (KYC)
                Client client = Client.builder()
                                .nom(request.getNom())
                                .prenom(request.getPrenom())
                                .email(request.getEmail())
                                .telephone(request.getTelephone())
                                .adresse(request.getAdresse())
                                .dateNaissance(request.getDateNaissance())
                                .sexe(request.getSexe())
                                .nationalite(request.getNationalite())
                                .build();

                client = clientRepository.save(client);

                // 2. Création du compte utilisateur associé
                User user = User.builder()
                                .username(request.getUsername())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role("ROLE_CLIENT")
                                .client(client)
                                .enabled(false) // Nécessite validation admin
                                .build();

                userRepository.save(user);
        }

        public String login(AuthRequestDTO request) {
                System.out.println("DEBUG: Tentative de connexion pour l'utilisateur: " + request.getUsername());
                var user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> {
                                        System.err.println("CRITICAL: Utilisateur non trouvé dans la DB: '"
                                                        + request.getUsername() + "'");
                                        return new RuntimeException("Utilisateur non trouvé");
                                });

                if (!user.isEnabled()) {
                        throw new RuntimeException("Votre compte est en attente de validation par un administrateur.");
                }

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

                Map<String, Object> claims = new java.util.HashMap<>();
                claims.put("role", user.getRole());

                return jwtUtils.generateToken(claims, new org.springframework.security.core.userdetails.User(
                                user.getUsername(), user.getPassword(),
                                java.util.Collections.singletonList(
                                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                user.getRole()))));
        }

        @Transactional
        public void activateUser(String username) {
                var user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + username));
                user.setEnabled(true);
                userRepository.save(user);

                System.out.println("DEBUG: Utilisateur " + username + " a été activé.");

                // Envoyer un email de confirmation
                if (user.getClient() != null) {
                        String clientName = user.getClient().getPrenom() + " " + user.getClient().getNom();
                        emailService.sendApprovalEmail(user.getClient().getEmail(), clientName, username);
                }
        }

        @Transactional
        public void rejectUser(String username, String reason) {
                var user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + username));

                // Envoyer un email de rejet avant la suppression
                if (user.getClient() != null) {
                        String clientName = user.getClient().getPrenom() + " " + user.getClient().getNom();
                        emailService.sendRejectionEmail(user.getClient().getEmail(), clientName, username, reason);

                        // Supprimer le client associé (la cascade supprimera l'utilisateur si
                        // configuré,
                        // mais ici on le fait manuellement pour être sûr)
                        Client client = user.getClient();
                        userRepository.delete(user);
                        clientRepository.delete(client);
                        System.out.println("DEBUG: Utilisateur " + username
                                        + " et son profil client ont été rejetés et supprimés.");
                } else {
                        userRepository.delete(user);
                        System.out.println("DEBUG: Utilisateur " + username
                                        + " (sans profil client) a été rejeté et supprimé.");
                }
        }

        public List<User> getPendingUsers() {
                return userRepository.findAll().stream()
                                .filter(u -> !u.isEnabled())
                                .collect(Collectors.toList());
        }

        public User getUserByUsername(String username) {
                return userRepository.findByUsername(username).orElseThrow();
        }

        public List<String> getAllUsernames() {
                return userRepository.findAll().stream().map(User::getUsername).collect(Collectors.toList());
        }
}
