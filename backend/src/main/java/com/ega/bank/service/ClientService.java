package com.ega.bank.service;

import com.ega.bank.dto.ClientDTO;
import com.ega.bank.entity.Client;
import com.ega.bank.exception.ResourceNotFoundException;
import com.ega.bank.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final com.ega.bank.repository.UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé: " + id));
        return mapToDTO(client);
    }

    public ClientDTO createClient(ClientDTO clientDTO) {
        Client client = new Client();
        // Map DTO to Entity
        client.setNom(clientDTO.getNom());
        client.setPrenom(clientDTO.getPrenom());
        client.setDateNaissance(clientDTO.getDateNaissance());
        client.setSexe(clientDTO.getSexe());
        client.setAdresse(clientDTO.getAdresse());
        client.setTelephone(clientDTO.getTelephone());
        client.setEmail(clientDTO.getEmail());
        client.setNationalite(clientDTO.getNationalite());

        Client savedClient = clientRepository.save(client);
        return mapToDTO(savedClient);
    }

    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Client non trouvé: " + id);
        }
        clientRepository.deleteById(id);
    }

    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé: " + id));

        client.setNom(clientDTO.getNom());
        client.setPrenom(clientDTO.getPrenom());
        client.setDateNaissance(clientDTO.getDateNaissance());
        client.setSexe(clientDTO.getSexe());
        client.setAdresse(clientDTO.getAdresse());
        client.setTelephone(clientDTO.getTelephone());
        client.setEmail(clientDTO.getEmail());
        client.setNationalite(clientDTO.getNationalite());

        return mapToDTO(clientRepository.save(client));
    }

    public void toggleActivation(Long clientId) {
        userRepository.findByClientId(clientId).ifPresent(user -> {
            user.setEnabled(!user.isEnabled());
            userRepository.save(user);
            System.out.println("DEBUG: Status du client " + clientId + " changé vers " + user.isEnabled());
        });
    }

    private ClientDTO mapToDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setNom(client.getNom());
        dto.setPrenom(client.getPrenom());
        dto.setDateNaissance(client.getDateNaissance());
        dto.setSexe(client.getSexe());
        dto.setAdresse(client.getAdresse());
        dto.setTelephone(client.getTelephone());
        dto.setEmail(client.getEmail());
        dto.setNationalite(client.getNationalite());

        // Rechercher le statut "enabled" dans la table User
        userRepository.findByClientId(client.getId()).ifPresent(user -> {
            dto.setEnabled(user.isEnabled());
        });

        return dto;
    }
}
