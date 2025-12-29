# 🏦 Guide du Système d'Inscription KYC - EGA BANK

## 📋 Vue d'ensemble

Le système d'inscription a été transformé pour refléter la **réalité bancaire** avec un processus complet de **KYC (Know Your Customer)** et de validation administrative.

---

## ✨ Nouvelles Fonctionnalités

### 1. Formulaire d'Inscription Enrichi

Le formulaire d'inscription collecte désormais **toutes les informations requises** par une banque réelle :

#### Informations Personnelles
- **Nom de famille** (obligatoire)
- **Prénom(s)** (obligatoire)
- **Date de naissance** (obligatoire)
- **Sexe** : Masculin / Féminin (obligatoire)
- **Nationalité** (obligatoire)

#### Informations de Contact
- **Email** (obligatoire, unique)
- **Téléphone** (obligatoire)
- **Adresse de résidence** (obligatoire)

#### Identifiants de Connexion
- **Nom d'utilisateur** (obligatoire, unique)
- **Mot de passe** (obligatoire)
- **Confirmation du mot de passe** (obligatoire)

---

### 2. Processus de Validation en 3 Étapes

#### Étape 1 : Inscription du Client
1. Le client remplit le formulaire complet sur `/register`
2. Les données sont envoyées au backend
3. Un **profil Client** est créé en base de données
4. Un **compte Utilisateur** associé est créé avec `enabled = false`
5. Le client reçoit un message : *"Votre demande a été envoyée ! Un administrateur va vérifier vos informations KYC sous 24h."*

#### Étape 2 : Validation par l'Administrateur
1. L'admin se connecte sur `/login` avec ses identifiants
2. Il est redirigé vers `/clients` (Portail d'Administration)
3. Une **bannière d'alerte** s'affiche en haut avec les inscriptions en attente
4. L'admin voit :
   - Le nom complet du client
   - Son email
   - Sa nationalité
5. L'admin clique sur **"Valider l'accès"** pour approuver

#### Étape 3 : Activation et Connexion
1. Le compte utilisateur passe à `enabled = true`
2. Le client peut maintenant se connecter avec ses identifiants
3. Il accède à son espace personnel

---

## 🔐 Identifiants de Test

### Administrateurs
| Utilisateur | Mot de passe | Description |
|------------|--------------|-------------|
| `admin` | `password123` | Administrateur principal |
| `ega_admin` | `admin2025` | Administrateur EGA |

### Clients (Pré-validés)
| Utilisateur | Mot de passe | Nom complet |
|------------|--------------|-------------|
| `jean` | `password123` | Jean Koffi |
| `abla` | `password123` | Abla Mensah |
| `ega_client` | `client2025` | Utilisateur Fictif |

---

## 🎯 Scénario de Test Complet

### Test 1 : Inscription d'un Nouveau Client

1. **Ouvrez** `http://localhost:4200/register`
2. **Remplissez** tous les champs :
   ```
   Nom : MENSAH
   Prénom : Kofi
   Date de naissance : 1998-03-15
   Sexe : Masculin
   Nationalité : Togolaise
   Email : kofi.mensah@email.com
   Téléphone : +228 90 11 22 33
   Adresse : Lomé, Quartier Bè
   Identifiant : kofi
   Mot de passe : test123
   ```
3. **Cliquez** sur "Envoyer ma demande d'adhésion"
4. **Vérifiez** le message de confirmation
5. **Essayez** de vous connecter → Vous verrez : *"Votre compte est en attente de validation par un administrateur."*

### Test 2 : Validation par l'Admin

1. **Connectez-vous** en tant qu'admin (`admin` / `password123`)
2. **Vous êtes redirigé** vers `/clients`
3. **Observez** la section "Inscriptions à valider (1)" en haut
4. **Vous voyez** :
   - Nom : Kofi MENSAH
   - Email : kofi.mensah@email.com
   - Nationalité : Togolaise
5. **Cliquez** sur "Valider l'accès"
6. **Confirmez** l'action
7. **La carte disparaît** de la section en attente

### Test 3 : Connexion du Client Validé

1. **Déconnectez-vous** de l'admin
2. **Connectez-vous** avec `kofi` / `test123`
3. **Succès !** Vous accédez à l'espace client

---

## 🏗️ Architecture Technique

### Backend (Spring Boot)

#### Entités Modifiées
- **`User`** : Ajout du champ `enabled` (boolean)
- **`Client`** : Contient toutes les informations KYC

#### Services
- **`AuthService.register()`** : Crée Client + User en une transaction
- **`AuthService.getPendingUsers()`** : Retourne les users avec `enabled = false`
- **`AuthService.activateUser()`** : Passe `enabled` à `true`

#### Endpoints
```java
POST /api/auth/register          // Inscription avec KYC complet
POST /api/auth/login             // Connexion (vérifie enabled)
GET  /api/auth/pending-users     // Liste des inscriptions en attente (ADMIN)
POST /api/auth/activate/{username} // Validation d'un compte (ADMIN)
```

### Frontend (Angular)

#### Composants Modifiés
- **`RegisterComponent`** : Formulaire étendu avec tous les champs KYC
- **`ClientListComponent`** : Affichage des inscriptions en attente + liste clients

#### Services
- **`AuthService`** : Méthodes `getPendingUsers()` et `activateUser()`

---

## 🔒 Sécurité

### Mesures Implémentées
1. **Mot de passe hashé** avec BCrypt
2. **Champ password masqué** dans les réponses JSON (`@JsonIgnore`)
3. **Validation côté serveur** de tous les champs obligatoires
4. **Endpoints protégés** par rôle (ADMIN / CLIENT)
5. **Comptes désactivés par défaut** jusqu'à validation

### Messages d'Erreur Clairs
- Si compte non validé : *"Votre compte est en attente de validation par un administrateur."*
- Si identifiants incorrects : *"Utilisateur non trouvé"*
- Si erreur serveur : Message spécifique du backend

---

## 📊 Données en Base

### Table `users`
```sql
id | username | password (hash) | role        | enabled | client_id
---|----------|-----------------|-------------|---------|----------
1  | admin    | $2a$10$...     | ROLE_ADMIN  | true    | NULL
2  | jean     | $2a$10$...     | ROLE_CLIENT | true    | 1
3  | kofi     | $2a$10$...     | ROLE_CLIENT | false   | 3  ← En attente
```

### Table `client`
```sql
id | nom    | prenom | email                  | nationalite | ...
---|--------|--------|------------------------|-------------|----
1  | Koffi  | Jean   | jean.koffi@email.com   | Togolaise   | ...
3  | MENSAH | Kofi   | kofi.mensah@email.com  | Togolaise   | ...
```

---

## 🎨 Interface Utilisateur

### Page d'Inscription
- **Design moderne** avec formulaire en 2 colonnes
- **Champs groupés** par catégorie (Personnel, Contact, Identifiants)
- **Message informatif** sur le processus de validation
- **Validation en temps réel** (mot de passe identique)

### Portail Admin
- **Bannière d'alerte** pour les inscriptions en attente
- **Cartes détaillées** avec informations KYC
- **Actions rapides** : Valider / Rejeter
- **Liste complète** des clients avec filtres

---

## 🚀 Prochaines Améliorations Possibles

1. **Email de notification** à l'admin lors d'une nouvelle inscription
2. **Email de confirmation** au client après validation
3. **Upload de documents** (pièce d'identité, justificatif de domicile)
4. **Motif de rejet** avec message personnalisé
5. **Historique des validations** (qui a validé, quand)
6. **Niveau de vérification KYC** (Basic, Intermédiaire, Complet)

---

## ✅ Conformité Bancaire

Ce système respecte les standards bancaires :
- ✅ Collecte d'informations KYC complètes
- ✅ Validation manuelle par un agent habilité
- ✅ Traçabilité des actions (logs Hibernate)
- ✅ Séparation des rôles (Admin ≠ Client)
- ✅ Sécurité des données sensibles

---

**Date de mise à jour** : 26 décembre 2025  
**Version** : 1.0  
**Auteur** : Équipe EGA BANK
