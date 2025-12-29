package com.ega.bank.repository;

import com.ega.bank.entity.AccountRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRequestRepository extends JpaRepository<AccountRequest, Long> {
    List<AccountRequest> findByClientId(Long clientId);

    List<AccountRequest> findByStatus(String status);
}
