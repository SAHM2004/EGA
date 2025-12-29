package com.ega.bank.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    @JsonIgnore
    private String password;

    private String role; // ROLE_ADMIN, ROLE_CLIENT

    @OneToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @Builder.Default
    private boolean enabled = false;
}
