# 💰 Guide des Opérations Bancaires - Client EGA BANK

## 🎯 Fonctionnalités Disponibles

Votre compte EGA BANK vous permet d'effectuer toutes les opérations bancaires courantes :

---

## 📋 Création de Compte

### Comment ça marche ?

1. **L'admin crée votre compte** après validation de votre inscription
2. **Solde initial = 0 FCFA** (comme dans une vraie banque)
3. **Vous recevez un IBAN unique** (ex: `TG12345678901234567890`)

### Types de Comptes

#### 💳 Compte Courant
- ✅ Solde initial : 0 FCFA
- ✅ Découvert autorisé (ex: 10 000 FCFA)
- ✅ Idéal pour les opérations quotidiennes

#### 💎 Compte Épargne
- ✅ Solde initial : 0 FCFA
- ✅ Taux d'intérêt (ex: 3.5%)
- ✅ Idéal pour économiser

---

## 💵 1. DÉPÔT (Alimenter votre compte)

### Comment faire un dépôt ?

**Via l'interface web :**
1. Connectez-vous à votre espace client
2. Allez sur "Mes Comptes"
3. Sélectionnez le compte à alimenter
4. Cliquez sur "Dépôt" ou "Alimenter"
5. Entrez le montant (ex: 50 000 FCFA)
6. Confirmez

**Résultat :**
```
Solde avant : 0 FCFA
Dépôt       : +50 000 FCFA
Solde après : 50 000 FCFA
```

### API Backend
```
POST /api/transactions/deposit/{accountId}
Body: { "amount": 50000 }
```

---

## 💸 2. RETRAIT (Retirer de l'argent)

### Comment faire un retrait ?

**Via l'interface web :**
1. Connectez-vous à votre espace client
2. Allez sur "Mes Comptes"
3. Sélectionnez le compte
4. Cliquez sur "Retrait"
5. Entrez le montant (ex: 10 000 FCFA)
6. Confirmez

**Résultat :**
```
Solde avant : 50 000 FCFA
Retrait     : -10 000 FCFA
Solde après : 40 000 FCFA
```

### Règles de Retrait

#### Compte Courant avec Découvert
```
Solde actuel : 5 000 FCFA
Découvert    : 10 000 FCFA
Maximum retirable : 15 000 FCFA
```

#### Compte Épargne (Pas de découvert)
```
Solde actuel : 5 000 FCFA
Maximum retirable : 5 000 FCFA
```

### API Backend
```
POST /api/transactions/withdraw/{accountId}
Body: { "amount": 10000 }
```

---

## 🔄 3. VIREMENT (Transférer de l'argent)

### Comment faire un virement ?

**Via l'interface web :**
1. Connectez-vous à votre espace client
2. Allez sur "Virements" ou "Transferts"
3. Sélectionnez le compte source (votre compte)
4. Entrez l'IBAN du bénéficiaire
5. Entrez le montant (ex: 20 000 FCFA)
6. Ajoutez un motif (optionnel)
7. Confirmez

**Résultat :**
```
Votre compte :
  Solde avant : 40 000 FCFA
  Virement   : -20 000 FCFA
  Solde après : 20 000 FCFA

Compte bénéficiaire :
  Solde avant : 10 000 FCFA
  Virement   : +20 000 FCFA
  Solde après : 30 000 FCFA
```

### API Backend
```
POST /api/transactions/transfer
Body: {
  "sourceAccountId": "TG12345...",
  "destinationAccountId": "TG67890...",
  "amount": 20000
}
```

---

## 📊 4. CONSULTER SON SOLDE

### Comment consulter votre solde ?

**Méthode 1 : Dashboard**
1. Connectez-vous
2. Le solde s'affiche automatiquement sur la page d'accueil

**Méthode 2 : Page "Mes Comptes"**
1. Allez sur "Mes Comptes"
2. Vous voyez tous vos comptes avec leurs soldes

**Méthode 3 : Détails du Compte**
1. Cliquez sur un compte
2. Vous voyez :
   - Solde actuel
   - IBAN
   - Type de compte
   - Date de création
   - Historique des transactions

### API Backend
```
GET /api/accounts/client/{clientId}
Réponse: [
  {
    "numeroCompte": "TG12345...",
    "solde": 20000,
    "type": "CURRENT",
    "dateCreation": "2025-12-27"
  }
]
```

---

## 📜 5. HISTORIQUE DES TRANSACTIONS

### Que pouvez-vous consulter ?

Pour chaque transaction, vous voyez :
- 📅 **Date et heure** de l'opération
- 💰 **Montant** (positif pour dépôt, négatif pour retrait)
- 🏷️ **Type** : DÉPÔT, RETRAIT, VIREMENT
- 💳 **Compte** concerné
- 📊 **Solde après** l'opération

### Exemple d'Historique
```
┌────────────────────────────────────────────────────────┐
│  Date         │ Type     │ Montant    │ Solde après   │
├────────────────────────────────────────────────────────┤
│  27/12 14:30  │ DÉPÔT    │ +50 000    │ 50 000 FCFA   │
│  27/12 15:15  │ RETRAIT  │ -10 000    │ 40 000 FCFA   │
│  27/12 16:00  │ VIREMENT │ -20 000    │ 20 000 FCFA   │
└────────────────────────────────────────────────────────┘
```

### API Backend
```
GET /api/transactions/account/{accountId}?start=2025-12-01&end=2025-12-31
```

---

## 🔒 Sécurité et Limites

### Limites de Retrait

| Type de Compte | Limite |
|----------------|--------|
| Compte Courant | Solde + Découvert autorisé |
| Compte Épargne | Solde uniquement (pas de découvert) |

### Exemple Pratique

**Compte Courant :**
```
Solde actuel : 5 000 FCFA
Découvert    : 10 000 FCFA
─────────────────────────────
Retrait possible : 15 000 FCFA maximum
```

**Compte Épargne :**
```
Solde actuel : 5 000 FCFA
Découvert    : 0 FCFA (non autorisé)
─────────────────────────────
Retrait possible : 5 000 FCFA maximum
```

### Messages d'Erreur

❌ **"Solde insuffisant"**
- Vous essayez de retirer plus que votre solde disponible

❌ **"Compte non trouvé"**
- L'IBAN saisi est incorrect

❌ **"Montant invalide"**
- Le montant doit être positif et supérieur à 0

---

## 🎯 Scénario Complet : Premier Mois

### Jour 1 : Création du compte
```
Solde : 0 FCFA
```

### Jour 2 : Premier dépôt (salaire)
```
Dépôt : +150 000 FCFA
Solde : 150 000 FCFA
```

### Jour 5 : Retrait au guichet
```
Retrait : -20 000 FCFA
Solde : 130 000 FCFA
```

### Jour 10 : Virement (loyer)
```
Virement vers propriétaire : -50 000 FCFA
Solde : 80 000 FCFA
```

### Jour 15 : Virement (facture électricité)
```
Virement : -15 000 FCFA
Solde : 65 000 FCFA
```

### Jour 20 : Retrait
```
Retrait : -10 000 FCFA
Solde : 55 000 FCFA
```

### Jour 30 : Consultation du solde
```
Solde final : 55 000 FCFA
Total dépôts : 150 000 FCFA
Total retraits : 30 000 FCFA
Total virements : 65 000 FCFA
```

---

## 📱 Interface Client (À venir)

### Dashboard
- 💰 Solde total de tous vos comptes
- 📊 Graphique des dépenses du mois
- 📜 Dernières transactions
- 🔔 Notifications

### Mes Comptes
- 📋 Liste de tous vos comptes
- 💳 Détails de chaque compte
- ➕ Boutons : Dépôt, Retrait, Virement

### Virements
- 🔄 Faire un virement
- 📋 Historique des virements
- 👥 Bénéficiaires enregistrés

### Historique
- 📜 Toutes vos transactions
- 🔍 Filtres par date, type, montant
- 📥 Télécharger en PDF

---

## ✅ Checklist des Fonctionnalités

### Backend (Déjà Implémenté)
- [x] Création de compte avec solde = 0
- [x] Dépôt (deposit)
- [x] Retrait (withdraw)
- [x] Virement (transfer)
- [x] Consultation du solde
- [x] Historique des transactions
- [x] Gestion du découvert (compte courant)
- [x] Validation des montants

### Frontend (À Finaliser)
- [ ] Interface de dépôt
- [ ] Interface de retrait
- [ ] Interface de virement
- [ ] Affichage du solde en temps réel
- [ ] Historique des transactions
- [ ] Téléchargement de relevés PDF

---

## 🚀 Prochaines Étapes

1. **Tester les opérations** via Postman ou l'interface
2. **Créer l'interface client** pour les dépôts/retraits
3. **Ajouter des notifications** pour chaque opération
4. **Implémenter les virements programmés**
5. **Ajouter des limites de transaction** (ex: max 500 000 FCFA/jour)

---

**Date de création** : 27 décembre 2025  
**Version** : 1.0  
**Statut** : ✅ Backend Opérationnel  
**Auteur** : Équipe EGA BANK
