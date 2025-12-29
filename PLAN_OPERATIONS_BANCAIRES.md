# 🎯 Implémentation des Opérations Bancaires Client - Plan d'Action

## 📋 Modifications à Apporter

### ✅ 1. Service de Transactions (FAIT)
- [x] Correction des URLs API
- [x] Méthode `deposit(accountId, amount)`
- [x] Méthode `withdraw(accountId, amount)`
- [x] Méthode `transfer(request)`
- [x] Méthode `getAccountHistory(accountId)`

---

### 🔧 2. Composant Account-List (À Modifier)

#### Ajouts au Template

**Boutons d'Action Rapide** (à ajouter dans la carte de chaque compte) :
```html
<!-- Boutons d'opérations (pour les clients uniquement) -->
<div *ngIf="!authService.isAdmin()" class="d-grid gap-2 mt-3">
  <button class="btn btn-success btn-sm" (click)="openDepositModal(acc)">
    <i class="fas fa-plus-circle me-2"></i> Dépôt
  </button>
  <button class="btn btn-warning btn-sm" (click)="openWithdrawModal(acc)">
    <i class="fas fa-minus-circle me-2"></i> Retrait
  </button>
  <button class="btn btn-primary btn-sm" (click)="openTransferModal(acc)">
    <i class="fas fa-exchange-alt me-2"></i> Virement
  </button>
</div>
```

**Modal de Dépôt** :
```html
<!-- MODAL : Dépôt -->
<div *ngIf="showDepositModal" class="custom-modal-backdrop" (click)="showDepositModal = false">
  <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
    <h4 class="mb-4"><i class="fas fa-plus-circle text-success me-2"></i> Faire un Dépôt</h4>
    <form (ngSubmit)="submitDeposit()" #depositForm="ngForm">
      <div class="mb-3">
        <label class="form-label">Compte</label>
        <input type="text" class="form-control" [value]="selectedAccount?.numeroCompte" readonly>
      </div>
      <div class="mb-3">
        <label class="form-label">Montant (FCFA)</label>
        <input type="number" [(ngModel)]="depositAmount" name="amount" class="form-control" placeholder="50000" required min="100">
      </div>
      <div class="alert alert-info">
        <i class="fas fa-info-circle me-2"></i>
        Montant minimum : 100 FCFA
      </div>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-secondary flex-fill" (click)="showDepositModal = false">Annuler</button>
        <button type="submit" class="btn btn-success flex-fill" [disabled]="!depositForm.form.valid">
          <i class="fas fa-check me-2"></i> Confirmer
        </button>
      </div>
    </form>
  </div>
</div>
```

**Modal de Retrait** :
```html
<!-- MODAL : Retrait -->
<div *ngIf="showWithdrawModal" class="custom-modal-backdrop" (click)="showWithdrawModal = false">
  <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
    <h4 class="mb-4"><i class="fas fa-minus-circle text-warning me-2"></i> Faire un Retrait</h4>
    <form (ngSubmit)="submitWithdraw()" #withdrawForm="ngForm">
      <div class="mb-3">
        <label class="form-label">Compte</label>
        <input type="text" class="form-control" [value]="selectedAccount?.numeroCompte" readonly>
      </div>
      <div class="mb-3">
        <label class="form-label">Solde disponible</label>
        <div class="h4 text-primary">{{ selectedAccount?.solde | number }} FCFA</div>
      </div>
      <div class="mb-3">
        <label class="form-label">Montant à retirer (FCFA)</label>
        <input type="number" [(ngModel)]="withdrawAmount" name="amount" class="form-control" placeholder="10000" required min="100" [max]="selectedAccount?.solde || 0">
      </div>
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Solde après retrait : {{ (selectedAccount?.solde || 0) - (withdrawAmount || 0) | number }} FCFA
      </div>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-secondary flex-fill" (click)="showWithdrawModal = false">Annuler</button>
        <button type="submit" class="btn btn-warning flex-fill" [disabled]="!withdrawForm.form.valid">
          <i class="fas fa-check me-2"></i> Confirmer
        </button>
      </div>
    </form>
  </div>
</div>
```

**Modal de Virement** :
```html
<!-- MODAL : Virement -->
<div *ngIf="showTransferModal" class="custom-modal-backdrop" (click)="showTransferModal = false">
  <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
    <h4 class="mb-4"><i class="fas fa-exchange-alt text-primary me-2"></i> Faire un Virement</h4>
    <form (ngSubmit)="submitTransfer()" #transferForm="ngForm">
      <div class="mb-3">
        <label class="form-label">Compte source</label>
        <input type="text" class="form-control" [value]="selectedAccount?.numeroCompte" readonly>
        <small class="text-muted">Solde : {{ selectedAccount?.solde | number }} FCFA</small>
      </div>
      <div class="mb-3">
        <label class="form-label">Compte destinataire (IBAN)</label>
        <input type="text" [(ngModel)]="transferDestination" name="destination" class="form-control" placeholder="TG..." required>
      </div>
      <div class="mb-3">
        <label class="form-label">Montant (FCFA)</label>
        <input type="number" [(ngModel)]="transferAmount" name="amount" class="form-control" placeholder="5000" required min="100" [max]="selectedAccount?.solde || 0">
      </div>
      <div class="alert alert-info">
        <i class="fas fa-info-circle me-2"></i>
        Le virement sera effectué immédiatement.
      </div>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-secondary flex-fill" (click)="showTransferModal = false">Annuler</button>
        <button type="submit" class="btn btn-primary flex-fill" [disabled]="!transferForm.form.valid">
          <i class="fas fa-paper-plane me-2"></i> Envoyer
        </button>
      </div>
    </form>
  </div>
</div>
```

#### Ajouts au TypeScript

**Variables** (à ajouter dans la classe) :
```typescript
// Modals
showDepositModal = false;
showWithdrawModal = false;
showTransferModal = false;

// Formulaires
depositAmount: number = 0;
withdrawAmount: number = 0;
transferAmount: number = 0;
transferDestination: string = '';
```

**Méthodes** (à ajouter dans la classe) :
```typescript
openDepositModal(account: Account) {
  this.selectedAccount = account;
  this.depositAmount = 0;
  this.showDepositModal = true;
}

openWithdrawModal(account: Account) {
  this.selectedAccount = account;
  this.withdrawAmount = 0;
  this.showWithdrawModal = true;
}

openTransferModal(account: Account) {
  this.selectedAccount = account;
  this.transferAmount = 0;
  this.transferDestination = '';
  this.showTransferModal = true;
}

submitDeposit() {
  if (this.selectedAccount && this.depositAmount > 0) {
    this.transactionService.deposit(this.selectedAccount.numeroCompte, this.depositAmount).subscribe({
      next: () => {
        alert(`Dépôt de ${this.depositAmount} FCFA effectué avec succès !`);
        this.showDepositModal = false;
        this.refreshData();
      },
      error: (err) => {
        alert('Erreur lors du dépôt');
        console.error(err);
      }
    });
  }
}

submitWithdraw() {
  if (this.selectedAccount && this.withdrawAmount > 0) {
    if (this.withdrawAmount > this.selectedAccount.solde) {
      alert('Solde insuffisant !');
      return;
    }
    this.transactionService.withdraw(this.selectedAccount.numeroCompte, this.withdrawAmount).subscribe({
      next: () => {
        alert(`Retrait de ${this.withdrawAmount} FCFA effectué avec succès !`);
        this.showWithdrawModal = false;
        this.refreshData();
      },
      error: (err) => {
        alert('Erreur lors du retrait : ' + (err.error?.message || 'Solde insuffisant'));
        console.error(err);
      }
    });
  }
}

submitTransfer() {
  if (this.selectedAccount && this.transferAmount > 0 && this.transferDestination) {
    if (this.transferAmount > this.selectedAccount.solde) {
      alert('Solde insuffisant !');
      return;
    }
    const request = {
      sourceId: this.selectedAccount.numeroCompte,
      destId: this.transferDestination,
      amount: this.transferAmount
    };
    this.transactionService.transfer(request).subscribe({
      next: () => {
        alert(`Virement de ${this.transferAmount} FCFA effectué avec succès !`);
        this.showTransferModal = false;
        this.refreshData();
      },
      error: (err) => {
        alert('Erreur lors du virement : ' + (err.error?.message || 'Compte destinataire introuvable'));
        console.error(err);
      }
    });
  }
}
```

**Import** (à ajouter en haut du fichier) :
```typescript
import { TransactionService } from '../../transactions/transaction.service';
```

**Injection** (à ajouter dans le constructeur) :
```typescript
constructor(
  // ... autres services
  private transactionService: TransactionService
) { }
```

---

## 🎯 Résultat Attendu

Après ces modifications, le client pourra :

1. **Voir ses comptes** avec le solde en temps réel
2. **Cliquer sur "Dépôt"** → Modal s'ouvre → Saisir montant → Confirmer → Solde mis à jour
3. **Cliquer sur "Retrait"** → Modal s'ouvre → Saisir montant → Vérification du solde → Confirmer → Solde mis à jour
4. **Cliquer sur "Virement"** → Modal s'ouvre → Saisir IBAN destinataire + montant → Confirmer → Solde mis à jour
5. **Imprimer son relevé** (déjà fonctionnel)
6. **Voir l'historique** des transactions

---

## 📸 Aperçu Visuel

```
┌─────────────────────────────────────────────────┐
│  💳 Compte Courant                              │
│  IBAN: TG1234567890123456                       │
│                                                 │
│  Solde disponible                               │
│  50 000 FCFA                                    │
│                                                 │
│  [🟢 Dépôt]  [🟡 Retrait]  [🔵 Virement]        │
│                                                 │
│  ⋮ Menu                                         │
│  - Relevé PDF                                   │
│  - Voir mouvements                              │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist d'Implémentation

- [x] Service de transactions corrigé
- [ ] Boutons d'action ajoutés au template
- [ ] Modal de dépôt ajoutée
- [ ] Modal de retrait ajoutée
- [ ] Modal de virement ajoutée
- [ ] Variables ajoutées au TypeScript
- [ ] Méthodes ajoutées au TypeScript
- [ ] Import TransactionService ajouté
- [ ] Tests effectués

---

**Date** : 27 décembre 2025  
**Version** : 1.0  
**Auteur** : Équipe EGA BANK
