package com.ega.bank.controller;

import com.ega.bank.dto.TransactionDTO;
import com.ega.bank.service.TransactionService;
import com.ega.bank.util.PdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/statements")
@RequiredArgsConstructor
public class StatementController {

    private final TransactionService transactionService;
    private final PdfGenerator pdfGenerator;

    @GetMapping("/{accountNumber}")
    public ResponseEntity<List<TransactionDTO>> getStatement(
            @PathVariable String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        // Convert LocalDate to LocalDateTime
        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt = end.atTime(23, 59, 59);

        return ResponseEntity.ok(transactionService.getTransactions(accountNumber, startDt, endDt));
    }

    @GetMapping(value = "/{accountNumber}/print", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> printStatement(
            @PathVariable String accountNumber,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        if (start == null)
            start = LocalDate.now().minusMonths(1);
        if (end == null)
            end = LocalDate.now();

        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt = end.atTime(23, 59, 59);

        List<TransactionDTO> transactions = transactionService.getTransactions(accountNumber, startDt, endDt);
        ByteArrayInputStream bis = pdfGenerator.generateStatement(transactions, accountNumber);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=releve-" + accountNumber + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
