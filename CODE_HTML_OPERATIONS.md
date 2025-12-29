# 📝 Code HTML à Ajouter - Opérations Bancaires

## 🎯 Instructions

Ajoutez ce code dans le template du composant `account-list.component.ts`

---

## 1️⃣ Boutons d'Opérations (à ajouter dans la carte de compte)

**Trouvez cette section** (ligne ~83) :
```html
<div class="mt-auto pt-3 border-top">
  <div class="small text-muted mb-1">Solde disponible</div>
  <div class="h3 mb-0 fw-bold" [class.text-primary]="acc.solde >= 0" [class.text-danger]="acc.solde < 0">
    {{ acc.solde | number }} <small class="fs-6 fw-normal">FCFA</small>
  </div>
</div>
```

**Ajoutez APRÈS cette section** :
```html
<!-- Boutons d'opérations (clients uniquement) -->
<div *ngIf="!authService.isAdmin()" class="mt-3">
  <div class="d-grid gap-2">
    <button class="btn btn-success btn-sm" (click)="openDepositModal(acc)">
      <i class="fas fa-plus-circle me-2"></i> Dépôt
    </button>
    <button class="btn btn-warning btn-sm text-white" (click)="openWithdrawModal(acc)">
      <i class="fas fa-minus-circle me-2"></i> Retrait
    </button>
    <button class="btn btn-primary btn-sm" (click)="openTransferModal(acc)">
      <i class="fas fa-exchange-alt me-2"></i> Virement
    </button>
  </div>
</div>
```

---

## 2️⃣ Modals (à ajouter à la fin du template, avant la balise fermante)

**Trouvez la fin du template** (ligne ~143) et ajoutez AVANT la balise fermante `` :

```html
<!-- MODAL : Dépôt -->
<div *ngIf="showDepositModal" class="custom-modal-backdrop" (click)="showDepositModal = false">
  <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
    <h4 class="mb-4">
      <i class="fas fa-plus-circle text-success me-2"></i> Faire un Dépôt
    </h4>
    <form (ngSubmit)="submitDeposit()" #depositForm="ngForm">
      <div class="mb-3">
        <label class="form-label fw-bold">Compte</label>
        <input type="text" class="form-control" [value]="selectedAccount?.numeroCompte" readonly>
        <small class="text-muted">Solde actuel : {{ selectedAccount?.solde | number }} FCFA</small>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Montant à déposer (FCFA)</label>
        <input type="number" [(ngModel)]="depositAmount" name="amount" class="form-control form-control-lg" placeholder="50000" required min="100" autofocus>
      </div>
      <div class="alert alert-info border-0">
        <i class="fas fa-info-circle me-2"></i>
        <strong>Montant minimum :</strong> 100 FCFA
      </div>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-secondary flex-fill" (click)="showDepositModal = false">
          <i class="fas fa-times me-2"></i> Annuler
        </button>
        <button type="submit" class="btn btn-success flex-fill" [disabled]="!depositForm.form.valid || depositAmount < 100">
          <i class="fas fa-check me-2"></i> Confirmer le Dépôt
        </button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL : Retrait -->
<div *ngIf="showWithdrawModal" class="custom-modal-backdrop" (click)="showWithdrawModal = false">
  <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
    <h4 class="mb-4">
      <i class="fas fa-minus-circle text-warning me-2"></i> Faire un Retrait
    </h4>
    <form (ngSubmit)="submitWithdraw()" #withdrawForm="ngForm">
      <div class="mb-3">
        <label class="form-label fw-bold">Compte</label>
        <input type="text" class="form-control" [value]="selectedAccount?.numeroCompte" readonly>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Solde disponible</label>
        <div class="h4 text-primary mb-0">{{ selectedAccount?.solde | number }} FCFA</div>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Montant à retirer (FCFA)</label>
        <input type="number" [(ngModel)]="withdrawAmount" name="amount" class="form-control form-control-lg" placeholder="10000" required min="100" [max]="selectedAccount?.solde || 0" autofocus>
      </div>
      <div class="alert alert-warning border-0" *ngIf="withdrawAmount > 0">
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Solde après retrait :</strong> {{ (selectedAccount?.solde || 0) - (withdrawAmount || 0) | number }} FCFA
      </div>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-secondary flex-fill" (click)="showWithdrawModal = false">
          <i class="fas fa-times me-2"></i> Annuler
        </button>
        <button type="submit" class="btn btn-warning text-white flex-fill" [disabled]="!withdrawForm.form.valid || withdrawAmount > (selectedAccount?.solde || 0)">
          <i class="fas fa-check me-2"></i> Confirmer le Retrait
        </button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL : Virement -->
<div *ngIf="showTransferModal" class="custom-modal-backdrop" (click)="showTransferModal = false">
  <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
    <h4 class="mb-4">
      <i class="fas fa-exchange-alt text-primary me-2"></i> Faire un Virement
    </h4>
    <form (ngSubmit)="submitTransfer()" #transferForm="ngForm">
      <div class="mb-3">
        <label class="form-label fw-bold">Compte source</label>
        <input type="text" class="form-control" [value]="selectedAccount?.numeroCompte" readonly>
        <small class="text-muted">Solde disponible : {{ selectedAccount?.solde | number }} FCFA</small>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Compte destinataire (IBAN)</label>
        <input type="text" [(ngModel)]="transferDestination" name="destination" class="form-control form-control-lg" placeholder="TG..." required minlength="10">
        <small class="text-muted">Saisissez l'IBAN du bénéficiaire</small>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Montant (FCFA)</label>
        <input type="number" [(ngModel)]="transferAmount" name="amount" class="form-control form-control-lg" placeholder="5000" required min="100" [max]="selectedAccount?.solde || 0" autofocus>
      </div>
      <div class="alert alert-info border-0">
        <i class="fas fa-info-circle me-2"></i>
        Le virement sera effectué <strong>immédiatement</strong> et de manière <strong>irréversible</strong>.
      </div>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-secondary flex-fill" (click)="showTransferModal = false">
          <i class="fas fa-times me-2"></i> Annuler
        </button>
        <button type="submit" class="btn btn-primary flex-fill" [disabled]="!transferForm.form.valid || transferAmount > (selectedAccount?.solde || 0)">
          <i class="fas fa-paper-plane me-2"></i> Envoyer le Virement
        </button>
      </div>
    </form>
  </div>
</div>
```

---

## ✅ Résultat Attendu

Après ces modifications, chaque carte de compte client affichera :

```
┌─────────────────────────────────────────────────┐
│  💳 Compte Courant                              │
│  IBAN: TG1234567890123456                       │
│                                                 │
│  Solde disponible                               │
│  50 000 FCFA                                    │
│                                                 │
│  [🟢 Dépôt]                                     │
│  [🟡 Retrait]                                   │
│  [🔵 Virement]                                  │
│                                                 │
│  ⋮ Menu (Relevé PDF, Historique)               │
└─────────────────────────────────────────────────┘
```

---

**Date** : 27 décembre 2025  
**Version** : 1.0  
**Auteur** : Équipe EGA BANK
