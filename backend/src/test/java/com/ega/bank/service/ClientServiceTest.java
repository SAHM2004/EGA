package com.ega.bank.service;

import com.ega.bank.dto.ClientDTO;
import com.ega.bank.entity.Client;
import com.ega.bank.repository.ClientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientService clientService;

    @Test
    void shouldCreateClient() {
        ClientDTO dto = new ClientDTO();
        dto.setNom("Doe");
        dto.setPrenom("John");

        Client client = new Client();
        client.setId(1L);
        client.setNom("Doe");
        client.setPrenom("John");

        when(clientRepository.save(any(Client.class))).thenReturn(client);

        ClientDTO result = clientService.createClient(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Doe", result.getNom());
    }

    @Test
    void shouldGetClient() {
        Client client = new Client();
        client.setId(1L);
        client.setNom("Doe");

        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));

        ClientDTO result = clientService.getClientById(1L);

        assertEquals("Doe", result.getNom());
    }
}
