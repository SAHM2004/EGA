package com.ega.bank.config;

import com.ega.bank.entity.Client;
import com.ega.bank.entity.User;
import com.ega.bank.repository.ClientRepository;
import com.ega.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

        private final ClientRepository clientRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                // 1. Init Admin par défaut
                updateOrCreateUser("admin", "password123", "ROLE_ADMIN", null);

                // 2. Init ega_admin
                updateOrCreateUser("ega_admin", "admin2025", "ROLE_ADMIN", null);

                // 3. Init Test Clients et leurs comptes utilisateurs
                if (clientRepository.count() == 0) {
                        Client c1 = Client.builder()
                                        .nom("Koffi").prenom("Jean").email("jean.koffi@email.com")
                                        .telephone("+228 90 00 00 01").adresse("Lomé, Quartier Adidogomé")
                                        .dateNaissance(LocalDate.of(1990, 5, 15)).sexe("M").nationalite("Togolaise")
                                        .build();

                        Client c2 = Client.builder()
                                        .nom("Mensah").prenom("Abla").email("abla.mensah@email.com")
                                        .telephone("+228 91 22 33 44").adresse("Lomé, Quartier Agoè")
                                        .dateNaissance(LocalDate.of(1995, 10, 20)).sexe("F").nationalite("Togolaise")
                                        .build();

                        clientRepository.saveAll(Arrays.asList(c1, c2));

                        updateOrCreateUser("jean", "password123", "ROLE_CLIENT", c1);
                        updateOrCreateUser("abla", "password123", "ROLE_CLIENT", c2);
                }

                // 4. Init ega_client (toujours créé si absent ou sans client)
                User egaClientUser = userRepository.findByUsername("ega_client").orElse(null);
                if (egaClientUser == null || egaClientUser.getClient() == null) {
                        Client dummyClient = Client.builder()
                                        .nom("FICTIF").prenom("Utilisateur").email("fictif@egabank.com")
                                        .telephone("+228 00 00 00 00").adresse("Zone Test, EGA Bank")
                                        .dateNaissance(LocalDate.of(2000, 1, 1)).sexe("M").nationalite("EgaLand")
                                        .build();
                        dummyClient = clientRepository.save(dummyClient);
                        updateOrCreateUser("ega_client", "client2025", "ROLE_CLIENT", dummyClient);
                }
        }

        private void updateOrCreateUser(String username, String password, String role, Client client) {
                userRepository.findByUsername(username).ifPresentOrElse(
                                user -> {
                                        user.setEnabled(true);
                                        user.setRole(role);
                                        if (user.getClient() == null && client != null) {
                                                user.setClient(client);
                                        }
                                        userRepository.save(user);
                                        System.out.println(">> Utilisateur '" + username + "' mis à jour.");
                                },
                                () -> {
                                        userRepository.save(User.builder()
                                                        .username(username)
                                                        .password(passwordEncoder.encode(password))
                                                        .role(role)
                                                        .client(client)
                                                        .enabled(true)
                                                        .build());
                                        System.out.println(">> Utilisateur '" + username + "' créé et activé.");
                                });
        }
}
