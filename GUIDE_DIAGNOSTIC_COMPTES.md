# 🔍 Guide de Diagnostic - Client ne voit pas ses comptes

## 🎯 Problème
Vous avez créé 2 comptes pour un client en tant qu'admin, mais quand le client se connecte, il ne voit rien.

---

## 🔧 Diagnostic Étape par Étape

### Étape 1 : Vérifier que les comptes existent dans la base de données

**En tant qu'admin :**
1. Connectez-vous en admin
2. Allez sur "Comptes"
3. Vérifiez que les 2 comptes apparaissent dans la liste
4. Notez le **clientId** de ces comptes

### Étape 2 : Vérifier l'association Client-User

**Le problème le plus probable :**
- Le compte bancaire est créé pour un **Client** (ID dans la table `client`)
- Mais le **User** (table `users`) n'est pas lié à ce Client

**Vérification :**
```sql
-- Dans MySQL, vérifiez :
SELECT u.id, u.username, u.client_id, c.nom, c.prenom 
FROM users u 
LEFT JOIN client c ON u.client_id = c.id 
WHERE u.username = 'USERNAME_DU_CLIENT';
```

**Si `client_id` est NULL**, c'est le problème !

### Étape 3 : Vérifier l'endpoint API

**Test avec curl :**
```powershell
# 1. Connectez-vous en tant que client
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"USERNAME_CLIENT\",\"password\":\"PASSWORD_CLIENT\"}'

# Copiez le token reçu

# 2. Récupérez les comptes du client
curl -X GET http://localhost:8080/api/accounts/my `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

**Résultat attendu :**
- Si vous recevez `[]` (tableau vide) → Le user n'est pas lié au client
- Si vous recevez une erreur → Problème d'authentification
- Si vous recevez les comptes → Le problème est dans le frontend

---

## 🛠️ Solutions

### Solution 1 : Lier le User au Client (Si client_id est NULL)

**Option A : Via SQL (Rapide)**
```sql
-- Trouvez l'ID du client
SELECT id, nom, prenom FROM client WHERE nom = 'NOM_DU_CLIENT';

-- Liez le user au client
UPDATE users SET client_id = ID_DU_CLIENT WHERE username = 'USERNAME_CLIENT';
```

**Option B : Recréer l'inscription**
1. Supprimez le user actuel
2. Le client se réinscrit via `/register`
3. L'admin valide l'inscription
4. Le lien user-client sera créé automatiquement

### Solution 2 : Vérifier le Frontend

**Ouvrez la console du navigateur (F12) :**
1. Connectez-vous en tant que client
2. Allez sur "Mes Comptes"
3. Regardez l'onglet "Network"
4. Cherchez la requête `GET /api/accounts/my`
5. Vérifiez la réponse

**Si la réponse est vide `[]` :**
- Le problème est dans le backend (user pas lié au client)

**Si la réponse contient les comptes :**
- Le problème est dans le frontend (affichage)

---

## 🎯 Problème 2 : Formulaire de Demande de Compte Incomplet

Le formulaire actuel pour les clients est basique. Il faut le mettre à jour avec tous les champs KYC.

**Fichier à modifier :**
`frontend/src/app/accounts/account-list/account-list.component.ts`

**Section à modifier :**
Lignes ~95-120 (Modal de demande de compte client)

---

## 🎯 Problème 3 : Validation Admin des Demandes de Compte

Actuellement, les demandes de compte sont stockées mais pas affichées correctement pour validation.

**À implémenter :**
1. Section "Demandes de compte en attente" pour l'admin
2. Boutons "Valider" et "Rejeter" pour chaque demande
3. Formulaire de complétion des informations KYC par l'admin

---

## 📊 Scénario Complet (Comment ça devrait fonctionner)

### Scénario A : Admin crée le compte directement
```
1. Admin → Comptes → "Ouvrir un Compte"
2. Admin sélectionne le client
3. Admin remplit TOUS les champs KYC
4. Compte créé immédiatement
5. Client se connecte → Voit son compte ✅
```

**Prérequis :** Le user doit être lié au client !

### Scénario B : Client demande un compte
```
1. Client → Comptes → "Demander un compte"
2. Client choisit le type (Courant/Épargne)
3. Client remplit les informations KYC
4. Demande envoyée à l'admin
5. Admin → Voit la demande → Valide ou Rejette
6. Si validé → Compte créé
7. Client se connecte → Voit son compte ✅
```

---

## ✅ Checklist de Vérification

### Backend
- [ ] Le user a un `client_id` non null
- [ ] Le client existe dans la table `client`
- [ ] Les comptes existent dans la table `account`
- [ ] Les comptes ont le bon `client_id`
- [ ] L'endpoint `/api/accounts/my` retourne les comptes

### Frontend
- [ ] Le client peut se connecter
- [ ] Le token est valide
- [ ] La requête `/api/accounts/my` est envoyée
- [ ] La réponse contient les comptes
- [ ] Les comptes s'affichent dans l'interface

### Workflow
- [ ] Le client peut demander un compte
- [ ] L'admin voit les demandes en attente
- [ ] L'admin peut valider/rejeter
- [ ] Le compte est créé après validation

---

## 🚀 Action Immédiate

**Pour débloquer rapidement :**

1. **Vérifiez le lien user-client :**
   ```sql
   SELECT u.username, u.client_id, c.nom 
   FROM users u 
   LEFT JOIN client c ON u.client_id = c.id;
   ```

2. **Si client_id est NULL, corrigez :**
   ```sql
   -- Remplacez les valeurs
   UPDATE users 
   SET client_id = (SELECT id FROM client WHERE email = 'EMAIL_DU_CLIENT') 
   WHERE username = 'USERNAME_CLIENT';
   ```

3. **Reconnectez-vous en tant que client**

4. **Vérifiez que les comptes apparaissent**

---

**Date** : 27 décembre 2025  
**Version** : 1.0  
**Auteur** : Équipe EGA BANK
