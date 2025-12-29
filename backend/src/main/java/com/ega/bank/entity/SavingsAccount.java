package com.ega.bank.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("SAVINGS")
@Data
@EqualsAndHashCode(callSuper = true)
public class SavingsAccount extends Account {
    private double tauxInteret;
}
