# 🧪 Guide de Tests Complets - EGA BANK (Sans Navigateur)

## 🎯 Objectif
Tester toutes les fonctionnalités de l'application EGA BANK en utilisant **Postman** ou **curl** (ligne de commande).

---

## 📋 Prérequis

### Option 1 : Postman (Recommandé - Interface Graphique)
1. Téléchargez Postman : https://www.postman.com/downloads/
2. Installez et lancez Postman
3. Créez une nouvelle collection "EGA BANK Tests"

### Option 2 : curl (Ligne de Commande)
- Déjà installé sur Windows PowerShell
- Utilisez les commandes ci-dessous directement

### Serveur
- Backend : `http://localhost:8080`
- Frontend : `http://localhost:4200` (pas nécessaire pour les tests API)

---

## 🔐 PARTIE 1 : TESTS ADMIN

### Test 1.1 : Connexion Admin

**Postman** :
```
POST http://localhost:8080/api/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "username": "admin",
  "password": "password123"
}
```

**curl** :
```powershell
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"password123\"}'
```

**Résultat Attendu** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ROLE_ADMIN"
}
```

⚠️ **IMPORTANT** : Copiez le `token`, vous en aurez besoin pour tous les tests suivants !

---

### Test 1.2 : Voir les Inscriptions en Attente

**Postman** :
```
GET http://localhost:8080/api/auth/pending-users
Headers:
  Authorization: Bearer VOTRE_TOKEN_ICI
```

**curl** :
```powershell
curl -X GET http://localhost:8080/api/auth/pending-users `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

**Résultat Attendu** :
```json
[
  {
    "id": 1,
    "username": "test_user",
    "role": "ROLE_CLIENT",
    "enabled": false,
    "client": {
      "nom": "Test",
      "prenom": "User",
      "email": "test@example.com",
      ...
    }
  }
]
```

---

### Test 1.3 : Valider un Utilisateur (Envoie Email)

**Postman** :
```
POST http://localhost:8080/api/auth/activate/test_user
Headers:
  Authorization: Bearer VOTRE_TOKEN_ICI
```

**curl** :
```powershell
curl -X POST http://localhost:8080/api/auth/activate/test_user `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

**Résultat Attendu** :
```json
{
  "message": "Compte activé avec succès."
}
```

✅ **Vérifiez Mailtrap** : Un email de bienvenue a été envoyé !

---

### Test 1.4 : Rejeter un Utilisateur (Envoie Email)

**Postman** :
```
POST http://localhost:8080/api/auth/reject/test_user2
Headers:
  Authorization: Bearer VOTRE_TOKEN_ICI
  Content-Type: application/json
Body (raw JSON):
{
  "reason": "Informations incomplètes - Date de naissance manquante"
}
```

**curl** :
```powershell
curl -X POST http://localhost:8080/api/auth/reject/test_user2 `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" `
  -H "Content-Type: application/json" `
  -d '{\"reason\":\"Informations incomplètes\"}'
```

**Résultat Attendu** :
```json
{
  "message": "Compte rejeté et utilisateur notifié par email."
}
```

✅ **Vérifiez Mailtrap** : Un email de rejet avec le motif a été envoyé !

---

### Test 1.5 : Créer un Client Directement

**Postman** :
```
POST http://localhost:8080/api/clients
Headers:
  Authorization: Bearer VOTRE_TOKEN_ICI
  Content-Type: application/json
Body (raw JSON):
{
  "nom": "KOFFI",
  "prenom": "Jean",
  "email": "jean.koffi@example.com",
  "telephone": "+228 90 12 34 56",
  "adresse": "Lomé, Quartier Administratif",
  "dateNaissance": "1990-05-15",
  "sexe": "M",
  "nationalite": "Togolaise"
}
```

**curl** :
```powershell
curl -X POST http://localhost:8080/api/clients `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" `
  -H "Content-Type: application/json" `
  -d '{\"nom\":\"KOFFI\",\"prenom\":\"Jean\",\"email\":\"jean.koffi@example.com\",\"telephone\":\"+228 90 12 34 56\",\"adresse\":\"Lomé\",\"dateNaissance\":\"1990-05-15\",\"sexe\":\"M\",\"nationalite\":\"Togolaise\"}'
```

**Résultat Attendu** :
```json
{
  "id": 5,
  "nom": "KOFFI",
  "prenom": "Jean",
  "email": "jean.koffi@example.com",
  ...
}
```

---

### Test 1.6 : Lister Tous les Clients

**Postman** :
```
GET http://localhost:8080/api/clients
Headers:
  Authorization: Bearer VOTRE_TOKEN_ICI
```

**curl** :
```powershell
curl -X GET http://localhost:8080/api/clients `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

**Résultat Attendu** :
```json
[
  {
    "id": 1,
    "nom": "SAHM",
    "prenom": "Memounatou",
    ...
  },
  {
    "id": 5,
    "nom": "KOFFI",
    "prenom": "Jean",
    ...
  }
]
```

---

### Test 1.7 : Créer un Compte Bancaire (avec KYC)

**Postman** :
```
POST http://localhost:8080/api/accounts
Headers:
  Authorization: Bearer VOTRE_TOKEN_ICI
  Content-Type: application/json
Body (raw JSON):
{
  "clientId": 5,
  "type": "CURRENT",
  "decouvert": 10000,
  "profession": "Enseignant",
  "revenusMensuels": 250000,
  "employeur": "Ministère de l'Éducation",
  "objectifCompte": "Compte Salaire",
  "agenceRattachement": "Lomé Centre",
  "personneUrgence": "KOFFI Marie (Épouse)",
  "telephoneUrgence": "+228 90 98 76 54"
}
```

**curl** :
```powershell
curl -X POST http://localhost:8080/api/accounts `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" `
  -H "Content-Type: application/json" `
  -d '{\"clientId\":5,\"type\":\"CURRENT\",\"decouvert\":10000,\"profession\":\"Enseignant\",\"revenusMensuels\":250000,\"employeur\":\"Ministère de l Education\",\"objectifCompte\":\"Compte Salaire\",\"agenceRattachement\":\"Lomé Centre\",\"personneUrgence\":\"KOFFI Marie\",\"telephoneUrgence\":\"+228 90 98 76 54\"}'
```

**Résultat Attendu** :
```json
{
  "numeroCompte": "TG1234567890123456",
  "dateCreation": "2025-12-27",
  "solde": 0.0,
  "type": "CURRENT",
  "clientId": 5,
  "decouvert": 10000,
  "profession": "Enseignant",
  "revenusMensuels": 250000,
  ...
}
```

✅ **Vérifiez** : Le solde initial est bien **0 FCFA** !

---

### Test 1.8 : Lister Tous les Comptes

**Postman** :
```
GET http://localhost:8080/api/accounts
Headers:
  Authorization: Bearer VOTRE_TOKEN_ICI
```

**curl** :
```powershell
curl -X GET http://localhost:8080/api/accounts `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

### Test 1.9 : Voir Toutes les Transactions

**Postman** :
```
GET http://localhost:8080/api/transactions
Headers:
  Authorization: Bearer VOTRE_TOKEN_ICI
```

**curl** :
```powershell
curl -X GET http://localhost:8080/api/transactions `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## 👤 PARTIE 2 : TESTS CLIENT

### Test 2.1 : Inscription d'un Nouveau Client

**Postman** :
```
POST http://localhost:8080/api/auth/register
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "username": "client_test",
  "password": "test123",
  "client": {
    "nom": "AGBEKO",
    "prenom": "Paul",
    "email": "paul.agbeko@example.com",
    "telephone": "+228 90 11 22 33",
    "adresse": "Kara, Quartier Résidentiel",
    "dateNaissance": "1995-08-20",
    "sexe": "M",
    "nationalite": "Togolaise"
  }
}
```

**curl** :
```powershell
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"client_test\",\"password\":\"test123\",\"client\":{\"nom\":\"AGBEKO\",\"prenom\":\"Paul\",\"email\":\"paul.agbeko@example.com\",\"telephone\":\"+228 90 11 22 33\",\"adresse\":\"Kara\",\"dateNaissance\":\"1995-08-20\",\"sexe\":\"M\",\"nationalite\":\"Togolaise\"}}'
```

**Résultat Attendu** :
```json
{
  "message": "Inscription réussie. Votre compte est en attente de validation par un administrateur."
}
```

---

### Test 2.2 : Connexion Client (Avant Validation - Devrait Échouer)

**Postman** :
```
POST http://localhost:8080/api/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "username": "client_test",
  "password": "test123"
}
```

**Résultat Attendu** :
```json
{
  "error": "User is disabled"
}
```

✅ **Normal** : Le compte n'est pas encore validé par l'admin !

---

### Test 2.3 : Connexion Client (Après Validation par Admin)

1. **D'abord, validez le compte** (Test 1.3 avec `client_test`)
2. **Puis, connectez-vous** :

**Postman** :
```
POST http://localhost:8080/api/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "username": "client_test",
  "password": "test123"
}
```

**Résultat Attendu** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ROLE_CLIENT"
}
```

⚠️ **Copiez le token client** pour les tests suivants !

---

### Test 2.4 : Voir Mes Comptes (Client)

**Postman** :
```
GET http://localhost:8080/api/accounts/client/CLIENT_ID
Headers:
  Authorization: Bearer TOKEN_CLIENT
```

**curl** :
```powershell
curl -X GET http://localhost:8080/api/accounts/client/6 `
  -H "Authorization: Bearer TOKEN_CLIENT"
```

**Résultat Attendu** :
```json
[
  {
    "numeroCompte": "TG9876543210987654",
    "solde": 0.0,
    "type": "CURRENT",
    ...
  }
]
```

---

### Test 2.5 : Faire un Dépôt

**Postman** :
```
POST http://localhost:8080/api/transactions/deposit/TG9876543210987654
Headers:
  Authorization: Bearer TOKEN_CLIENT
  Content-Type: application/json
Body (raw JSON):
{
  "amount": 50000
}
```

**curl** :
```powershell
curl -X POST "http://localhost:8080/api/transactions/deposit/TG9876543210987654" `
  -H "Authorization: Bearer TOKEN_CLIENT" `
  -H "Content-Type: application/json" `
  -d '{\"amount\":50000}'
```

**Résultat Attendu** :
```json
{
  "id": 1,
  "montant": 50000,
  "dateOperation": "2025-12-27T12:45:00",
  "type": "DEPOSIT",
  "accountId": "TG9876543210987654"
}
```

✅ **Vérifiez** : Le solde du compte est maintenant **50 000 FCFA** !

---

### Test 2.6 : Faire un Retrait

**Postman** :
```
POST http://localhost:8080/api/transactions/withdraw/TG9876543210987654
Headers:
  Authorization: Bearer TOKEN_CLIENT
  Content-Type: application/json
Body (raw JSON):
{
  "amount": 10000
}
```

**curl** :
```powershell
curl -X POST "http://localhost:8080/api/transactions/withdraw/TG9876543210987654" `
  -H "Authorization: Bearer TOKEN_CLIENT" `
  -H "Content-Type: application/json" `
  -d '{\"amount\":10000}'
```

**Résultat Attendu** :
```json
{
  "id": 2,
  "montant": 10000,
  "dateOperation": "2025-12-27T12:50:00",
  "type": "WITHDRAWAL",
  "accountId": "TG9876543210987654"
}
```

✅ **Vérifiez** : Le solde est maintenant **40 000 FCFA** !

---

### Test 2.7 : Faire un Virement

**Prérequis** : Créez un deuxième compte pour le test

**Postman** :
```
POST http://localhost:8080/api/transactions/transfer
Headers:
  Authorization: Bearer TOKEN_CLIENT
  Content-Type: application/json
Body (raw JSON):
{
  "sourceId": "TG9876543210987654",
  "destId": "TG1234567890123456",
  "amount": 15000
}
```

**curl** :
```powershell
curl -X POST http://localhost:8080/api/transactions/transfer `
  -H "Authorization: Bearer TOKEN_CLIENT" `
  -H "Content-Type: application/json" `
  -d '{\"sourceId\":\"TG9876543210987654\",\"destId\":\"TG1234567890123456\",\"amount\":15000}'
```

**Résultat Attendu** :
```
Status: 200 OK
```

✅ **Vérifiez** :
- Compte source : **25 000 FCFA** (40 000 - 15 000)
- Compte destination : **15 000 FCFA** (0 + 15 000)

---

### Test 2.8 : Voir l'Historique de Mes Transactions

**Postman** :
```
GET http://localhost:8080/api/transactions/account/TG9876543210987654?start=2025-12-01T00:00:00&end=2025-12-31T23:59:59
Headers:
  Authorization: Bearer TOKEN_CLIENT
```

**curl** :
```powershell
curl -X GET "http://localhost:8080/api/transactions/account/TG9876543210987654?start=2025-12-01T00:00:00&end=2025-12-31T23:59:59" `
  -H "Authorization: Bearer TOKEN_CLIENT"
```

**Résultat Attendu** :
```json
[
  {
    "id": 1,
    "montant": 50000,
    "type": "DEPOSIT",
    "dateOperation": "2025-12-27T12:45:00"
  },
  {
    "id": 2,
    "montant": 10000,
    "type": "WITHDRAWAL",
    "dateOperation": "2025-12-27T12:50:00"
  },
  {
    "id": 3,
    "montant": 15000,
    "type": "WITHDRAWAL",
    "dateOperation": "2025-12-27T12:55:00"
  }
]
```

---

## 📊 SCÉNARIO COMPLET DE TEST

### Scénario : Nouveau Client → Validation → Opérations

```
1. Client s'inscrit (Test 2.1)
   → Compte créé, enabled=false

2. Admin voit l'inscription (Test 1.2)
   → Client apparaît dans pending-users

3. Admin valide le compte (Test 1.3)
   → Email de bienvenue envoyé
   → enabled=true

4. Client se connecte (Test 2.3)
   → Reçoit un token

5. Admin crée un compte bancaire pour le client (Test 1.7)
   → Solde initial = 0 FCFA
   → IBAN généré

6. Client fait un dépôt (Test 2.5)
   → Solde = 50 000 FCFA

7. Client fait un retrait (Test 2.6)
   → Solde = 40 000 FCFA

8. Client fait un virement (Test 2.7)
   → Solde = 25 000 FCFA

9. Client consulte son historique (Test 2.8)
   → Voit toutes les transactions
```

---

## ✅ Checklist de Tests

### Tests Admin
- [ ] Connexion admin
- [ ] Voir inscriptions en attente
- [ ] Valider un utilisateur + Email
- [ ] Rejeter un utilisateur + Email
- [ ] Créer un client
- [ ] Lister tous les clients
- [ ] Créer un compte (solde = 0)
- [ ] Lister tous les comptes
- [ ] Voir toutes les transactions

### Tests Client
- [ ] Inscription
- [ ] Connexion (avant validation = échec)
- [ ] Connexion (après validation = succès)
- [ ] Voir mes comptes
- [ ] Faire un dépôt
- [ ] Faire un retrait
- [ ] Faire un virement
- [ ] Voir mon historique

### Tests Email (Mailtrap)
- [ ] Email de validation reçu
- [ ] Email de rejet reçu avec motif

---

## 🔧 Conseils de Débogage

### Si un test échoue :

1. **Vérifiez le backend** :
   ```powershell
   # Regardez les logs dans le terminal où mvn spring-boot:run tourne
   ```

2. **Vérifiez le token** :
   - Le token expire après 24h
   - Reconnectez-vous pour obtenir un nouveau token

3. **Vérifiez les IDs** :
   - Utilisez les bons IDs de client/compte
   - Listez d'abord les ressources pour voir les IDs disponibles

4. **Vérifiez les autorisations** :
   - Token admin pour les opérations admin
   - Token client pour les opérations client

---

**Date de création** : 27 décembre 2025  
**Version** : 1.0  
**Auteur** : Équipe EGA BANK

**Bon tests ! 🧪**
