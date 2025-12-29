package com.ega.bank.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("CURRENT")
@Data
@EqualsAndHashCode(callSuper = true)
public class CurrentAccount extends Account {
    private double decouvert;
}
