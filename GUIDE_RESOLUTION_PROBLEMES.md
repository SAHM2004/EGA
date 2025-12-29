# 🔧 Guide de Résolution des Problèmes - EGA BANK

## 🎯 Problèmes Identifiés et Solutions

---

## ❌ PROBLÈME 1 : Le Client Ne Voit Pas Ses Comptes

### Cause
Quand l'admin crée un compte, il doit **associer le compte à un client existant**. Si le client n'a pas de compte bancaire créé pour lui, il ne verra rien.

### Solution

#### Étape 1 : Vérifier que le Client Existe
1. Connectez-vous en **admin**
2. Allez sur **"Gestion Clients"**
3. Vérifiez que le client est dans la liste

#### Étape 2 : Créer un Compte pour le Client
1. Toujours connecté en admin
2. Allez sur **"Comptes"**
3. Cliquez sur **"Ouvrir un Compte"** (bouton bleu)
4. **Sélectionnez le client** dans la liste déroulante
5. Remplissez tous les champs KYC
6. Cliquez sur **"Confirmer l'ouverture du compte"**

#### Étape 3 : Le Client Peut Maintenant Se Connecter
1. Le client se connecte avec son username/password
2. Il va sur **"Mes Comptes"**
3. Il voit maintenant son compte avec :
   - IBAN
   - Solde (0 FCFA au début)
   - Type de compte
   - Actions disponibles

### ✅ Vérification
```
Client connecté → "Mes Comptes" → Voit son compte → Solde = 0 FCFA
```

---

## ❌ PROBLÈME 2 : Le Client Ne Peut Pas Faire de Dépôt/Retrait/Virement

### Cause
Les interfaces pour ces opérations n'existent pas encore dans le frontend client.

### Solution : Créer les Interfaces Client

Nous devons créer :
1. **Page "Mes Opérations"** avec :
   - Bouton "Faire un Dépôt"
   - Bouton "Faire un Retrait"
   - Bouton "Faire un Virement"
2. **Modals pour chaque opération**
3. **Affichage du solde en temps réel**

### Backend (Déjà Prêt ✅)
Les endpoints existent déjà :
- `POST /api/transactions/deposit/{accountId}` - Dépôt
- `POST /api/transactions/withdraw/{accountId}` - Retrait
- `POST /api/transactions/transfer` - Virement

### Frontend (À Créer)
Créer un composant `TransactionsComponent` pour le client avec :
- Formulaire de dépôt
- Formulaire de retrait
- Formulaire de virement
- Historique des transactions

---

## ❌ PROBLÈME 3 : Pas de Protection des Routes

### Cause
Actuellement, on peut accéder aux pages sans être connecté.

### Solution : Guard Angular

Créer un `AuthGuard` qui :
1. Vérifie si l'utilisateur est connecté
2. Redirige vers `/login` si non connecté
3. Vérifie le rôle (ADMIN/CLIENT)
4. Redirige vers la bonne page selon le rôle

### Routes Protégées

**Routes Publiques (Sans Connexion) :**
- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription

**Routes CLIENT (Connexion Requise) :**
- `/accounts` - Mes Comptes
- `/transactions` - Mes Opérations
- `/profile` - Mon Profil

**Routes ADMIN (Connexion + Rôle ADMIN) :**
- `/clients` - Gestion Clients
- `/accounts` - Tous les Comptes
- `/transactions` - Toutes les Transactions
- `/dashboard` - Tableau de Bord

---

## ❌ PROBLÈME 4 : Pas de Page d'Accueil Publique

### Cause
L'application redirige directement vers le dashboard.

### Solution : Créer une Page d'Accueil

Créer un composant `HomeComponent` avec :
- Logo EGA BANK
- Slogan
- Boutons "Se Connecter" et "S'Inscrire"
- Présentation des services
- Footer avec contact

---

## 🔧 PLAN D'ACTION IMMÉDIAT

### Priorité 1 : Créer un Compte pour le Client de Test

**Étapes :**
1. Connectez-vous en admin (`admin` / `password123`)
2. Allez sur "Comptes"
3. Cliquez sur "Ouvrir un Compte"
4. Sélectionnez un client existant
5. Remplissez le formulaire KYC
6. Créez le compte

**Résultat :**
- Le client pourra voir son compte
- Solde initial = 0 FCFA

---

### Priorité 2 : Tester les Opérations via API

En attendant l'interface client, testez avec Postman :

#### Test 1 : Dépôt
```
POST http://localhost:8080/api/transactions/deposit/TG1234567890123456
Headers:
  Authorization: Bearer TOKEN_CLIENT
  Content-Type: application/json
Body:
{
  "amount": 50000
}
```

#### Test 2 : Retrait
```
POST http://localhost:8080/api/transactions/withdraw/TG1234567890123456
Headers:
  Authorization: Bearer TOKEN_CLIENT
  Content-Type: application/json
Body:
{
  "amount": 10000
}
```

#### Test 3 : Virement
```
POST http://localhost:8080/api/transactions/transfer
Headers:
  Authorization: Bearer TOKEN_CLIENT
  Content-Type: application/json
Body:
{
  "sourceId": "TG1234567890123456",
  "destId": "TG9876543210987654",
  "amount": 5000
}
```

---

### Priorité 3 : Créer l'Interface Client pour les Opérations

**Fichiers à créer :**
1. `client-operations.component.ts` - Composant principal
2. `deposit-modal.component.ts` - Modal de dépôt
3. `withdraw-modal.component.ts` - Modal de retrait
4. `transfer-modal.component.ts` - Modal de virement

**Fonctionnalités :**
- Sélection du compte
- Saisie du montant
- Validation
- Confirmation
- Message de succès
- Rafraîchissement du solde

---

### Priorité 4 : Protéger les Routes

**Fichiers à créer :**
1. `auth.guard.ts` - Guard de connexion
2. `admin.guard.ts` - Guard admin
3. Modifier `app.routes.ts` pour ajouter les guards

**Exemple :**
```typescript
{
  path: 'accounts',
  component: AccountListComponent,
  canActivate: [AuthGuard]
}
```

---

### Priorité 5 : Créer la Page d'Accueil

**Fichier à créer :**
1. `home.component.ts` - Page d'accueil publique

**Contenu :**
- Hero section avec logo
- Boutons CTA (Se Connecter / S'Inscrire)
- Services offerts
- Témoignages
- Footer

---

## 📊 SCÉNARIO COMPLET DE TEST

### Scénario : Nouveau Client → Compte → Opérations

#### 1. Inscription (Client)
```
Client → /register → Remplit le formulaire → Soumet
Résultat : Compte créé, enabled=false
```

#### 2. Validation (Admin)
```
Admin → /clients → Voir Détails KYC → Valider
Résultat : enabled=true, email envoyé
```

#### 3. Création de Compte Bancaire (Admin)
```
Admin → /accounts → Ouvrir un Compte → Sélectionne le client → Remplit KYC → Crée
Résultat : Compte bancaire créé, solde=0
```

#### 4. Connexion (Client)
```
Client → /login → username/password → Connexion
Résultat : Token reçu, redirigé vers /accounts
```

#### 5. Voir Mes Comptes (Client)
```
Client → /accounts → Voit son compte
Résultat : IBAN, Solde=0, Type
```

#### 6. Faire un Dépôt (Client - via API pour l'instant)
```
POST /api/transactions/deposit/{accountId}
Body: {"amount": 50000}
Résultat : Solde=50000
```

#### 7. Faire un Retrait (Client - via API)
```
POST /api/transactions/withdraw/{accountId}
Body: {"amount": 10000}
Résultat : Solde=40000
```

#### 8. Imprimer le Relevé (Client)
```
Client → /accounts → Menu ⋮ → Relevé PDF
Résultat : PDF téléchargé
```

---

## ✅ CHECKLIST DE VÉRIFICATION

### Backend
- [x] Endpoint `/api/accounts/my` existe
- [x] Endpoint `/api/transactions/deposit` existe
- [x] Endpoint `/api/transactions/withdraw` existe
- [x] Endpoint `/api/transactions/transfer` existe
- [x] Endpoint `/api/transactions/account/{id}` existe (historique)

### Frontend
- [x] Service `getMyAccounts()` existe
- [ ] Interface de dépôt (à créer)
- [ ] Interface de retrait (à créer)
- [ ] Interface de virement (à créer)
- [ ] Protection des routes (à créer)
- [ ] Page d'accueil publique (à créer)

### Tests
- [ ] Client peut voir ses comptes
- [ ] Client peut faire un dépôt
- [ ] Client peut faire un retrait
- [ ] Client peut faire un virement
- [ ] Client peut imprimer son relevé
- [ ] Routes protégées fonctionnent
- [ ] Page d'accueil accessible sans connexion

---

## 🚀 PROCHAINES ÉTAPES

1. **Immédiat** : Créer un compte bancaire pour un client de test
2. **Court terme** : Créer les interfaces client (dépôt, retrait, virement)
3. **Moyen terme** : Protéger les routes avec AuthGuard
4. **Long terme** : Créer la page d'accueil publique

---

**Date** : 27 décembre 2025  
**Version** : 1.0  
**Auteur** : Équipe EGA BANK
