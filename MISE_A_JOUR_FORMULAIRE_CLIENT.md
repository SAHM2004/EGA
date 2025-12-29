# 📋 Mise à Jour du Formulaire de Création de Client (Admin)

## 🎯 Objectif
Mettre à jour le formulaire de création de client par l'administrateur pour qu'il contienne les mêmes informations KYC que le formulaire d'inscription.

## 📊 Champs à Inclure

### ✅ Champs Actuels (Déjà Présents)
- Nom
- Prénom  
- Email
- Téléphone
- Adresse
- Date de naissance
- Sexe
- Nationalité

### ➕ Champs à Ajouter (Si Manquants dans le Template)
- Username (identifiant de connexion)
- Password (mot de passe initial)

## 🔧 Modifications à Apporter

### 1. Backend (Déjà OK ✅)
Le backend accepte déjà tous ces champs dans `ClientDTO`.

### 2. Frontend - Variables TypeScript (Déjà OK ✅)
```typescript
newClient = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  adresse: '',
  dateNaissance: '',
  sexe: 'M',
  nationalite: ''
};
```

### 3. Frontend - Template HTML (À Vérifier/Mettre à Jour)

Le template doit contenir un formulaire similaire à celui de l'inscription avec :

#### Section 1 : Informations Personnelles
- Nom (required)
- Prénom (required)
- Date de naissance (required)
- Sexe (M/F) (required)
- Nationalité (required)

#### Section 2 : Contact
- Email (required, type="email")
- Téléphone (required)
- Adresse (required)

#### Section 3 : Identifiants (OPTIONNEL pour l'admin)
- Username (optionnel - peut être généré automatiquement)
- Password (optionnel - peut être généré automatiquement)

## 📝 Code HTML Complet du Modal

```html
<!-- MODAL : Créer un Client -->
<div *ngIf="showCreateClientModal" class="custom-modal-backdrop" (click)="showCreateClientModal = false">
  <div class="custom-modal-content premium-card shadow-lg" style="max-width: 800px;" (click)="$event.stopPropagation()">
    <h4 class="mb-4">
      <i class="fas fa-user-plus text-success me-2"></i> Créer un Nouveau Client
    </h4>
    
    <form (ngSubmit)="createClient()" #clientForm="ngForm">
      <div class="row">
        <!-- Section 1: Informations Personnelles -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold">Nom de famille</label>
          <input [(ngModel)]="newClient.nom" name="nom" class="form-control" placeholder="ex: KOFFI" required>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold">Prénom(s)</label>
          <input [(ngModel)]="newClient.prenom" name="prenom" class="form-control" placeholder="ex: Jean" required>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold">Date de naissance</label>
          <input type="date" [(ngModel)]="newClient.dateNaissance" name="dateNaissance" class="form-control" required>
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label fw-bold">Sexe</label>
          <select [(ngModel)]="newClient.sexe" name="sexe" class="form-select" required>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label fw-bold">Nationalité</label>
          <input [(ngModel)]="newClient.nationalite" name="nationalite" class="form-control" placeholder="Togolaise" required>
        </div>

        <!-- Section 2: Contact -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold">Email</label>
          <input type="email" [(ngModel)]="newClient.email" name="email" class="form-control" placeholder="jean.koffi@email.com" required>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold">Téléphone</label>
          <input [(ngModel)]="newClient.telephone" name="telephone" class="form-control" placeholder="+228 XX XX XX XX" required>
        </div>
        <div class="col-12 mb-3">
          <label class="form-label fw-bold">Adresse de résidence</label>
          <input [(ngModel)]="newClient.adresse" name="adresse" class="form-control" placeholder="Quartier, Rue, Ville" required>
        </div>
      </div>

      <div class="alert alert-info border-0 mt-3">
        <i class="fas fa-info-circle me-2"></i>
        <strong>Note :</strong> Le client sera créé avec le statut "actif" et pourra se connecter immédiatement.
      </div>

      <div class="d-flex gap-2 mt-4">
        <button type="button" class="btn btn-secondary flex-fill" (click)="showCreateClientModal = false">
          <i class="fas fa-times me-2"></i> Annuler
        </button>
        <button type="submit" class="btn btn-success flex-fill" [disabled]="!clientForm.form.valid">
          <i class="fas fa-check me-2"></i> Créer le Client
        </button>
      </div>
    </form>
  </div>
</div>
```

## ✅ Résultat Attendu

Après cette mise à jour, l'administrateur pourra créer un client avec toutes les informations KYC complètes, exactement comme lors de l'inscription.

---

**Date** : 27 décembre 2025  
**Version** : 1.0  
**Auteur** : Équipe EGA BANK
