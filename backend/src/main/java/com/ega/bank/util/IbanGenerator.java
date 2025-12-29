package com.ega.bank.util;

import org.springframework.stereotype.Component;
import java.util.Random;

@Component
public class IbanGenerator {

    public String generateIban() {
        // Generating a random mock IBAN FR76 ...
        Random random = new Random();
        StringBuilder sb = new StringBuilder("FR76");
        for (int i = 0; i < 23; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
