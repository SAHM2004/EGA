# 📧 Guide Complet : Configuration Gmail pour EGA BANK

## 🎯 Objectif
Créer un compte Gmail dédié pour envoyer automatiquement des emails depuis votre application bancaire EGA BANK.

---

## 📝 ÉTAPE 1 : Créer un Nouveau Compte Gmail

### 1.1 Ouvrir le formulaire d'inscription
1. Ouvrez votre navigateur
2. Allez sur : **https://accounts.google.com/signup**
3. OU tapez "créer compte gmail" dans Google

### 1.2 Remplir le formulaire
Remplissez les informations suivantes :

**Informations personnelles :**
- **Prénom** : EGA
- **Nom** : Bank
- **Nom d'utilisateur** : Choisissez un nom unique, par exemple :
  - `egabank.notifications@gmail.com`
  - `egabank.noreply@gmail.com`
  - `contact.egabank@gmail.com`
  - `ega.bank.togo@gmail.com`

**Mot de passe :**
- Créez un mot de passe fort (au moins 8 caractères)
- Notez-le dans un endroit sûr !

### 1.3 Vérification du numéro de téléphone
- Google vous demandera un numéro de téléphone
- Entrez votre numéro (ex: +228 XX XX XX XX)
- Vous recevrez un code par SMS
- Entrez le code de vérification

### 1.4 Informations supplémentaires
- **Email de récupération** : (optionnel) Votre email personnel
- **Date de naissance** : Entrez une date (doit être majeur)
- **Sexe** : Choisissez une option

### 1.5 Accepter les conditions
- Lisez les conditions d'utilisation
- Cliquez sur "J'accepte"

**✅ Votre compte Gmail est créé !**

---

## 🔐 ÉTAPE 2 : Activer l'Authentification à 2 Facteurs

### 2.1 Accéder aux paramètres de sécurité
1. Allez sur : **https://myaccount.google.com/security**
2. OU cliquez sur votre photo de profil → "Gérer votre compte Google" → "Sécurité"

### 2.2 Activer la validation en 2 étapes
1. Faites défiler jusqu'à "**Validation en 2 étapes**"
2. Cliquez sur "**Validation en 2 étapes**"
3. Cliquez sur "**Commencer**"
4. Connectez-vous à nouveau si demandé
5. Entrez votre numéro de téléphone
6. Choisissez "**Message texte (SMS)**"
7. Cliquez sur "**Envoyer**"
8. Entrez le code reçu par SMS
9. Cliquez sur "**Activer**"

**✅ L'authentification à 2 facteurs est activée !**

---

## 🔑 ÉTAPE 3 : Générer un Mot de Passe d'Application

### 3.1 Accéder aux mots de passe d'application
1. Retournez sur : **https://myaccount.google.com/security**
2. Faites défiler jusqu'à "**Validation en 2 étapes**"
3. Cliquez sur "**Mots de passe des applications**"
4. Connectez-vous à nouveau si demandé

### 3.2 Créer un mot de passe d'application
1. Dans "**Sélectionner l'application**", choisissez "**Autre (nom personnalisé)**"
2. Tapez : **EGA Bank Notifications**
3. Cliquez sur "**Générer**"

### 3.3 Copier le mot de passe
- Google affichera un mot de passe de **16 caractères** (ex: `abcd efgh ijkl mnop`)
- **COPIEZ CE MOT DE PASSE IMMÉDIATEMENT !**
- Vous ne pourrez plus le voir après avoir fermé cette fenêtre
- Collez-le dans un fichier texte temporaire

**✅ Votre mot de passe d'application est généré !**

---

## ⚙️ ÉTAPE 4 : Configurer Spring Boot

### 4.1 Ouvrir le fichier de configuration
Ouvrez le fichier :
```
c:\Users\user\Desktop\SAHM\Projet_springBoot\Ega\backend\src\main\resources\application.properties
```

### 4.2 Modifier la configuration email
Remplacez la section email par ceci :

```properties
# Email Configuration - Gmail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=VOTRE_EMAIL@gmail.com
spring.mail.password=VOTRE_MOT_DE_PASSE_APPLICATION
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
```

### 4.3 Remplacer les valeurs
Remplacez :
- `VOTRE_EMAIL@gmail.com` → Votre email créé (ex: `egabank.notifications@gmail.com`)
- `VOTRE_MOT_DE_PASSE_APPLICATION` → Le mot de passe de 16 caractères (SANS espaces !)

**Exemple :**
```properties
spring.mail.username=egabank.notifications@gmail.com
spring.mail.password=abcdefghijklmnop
```

### 4.4 Sauvegarder le fichier
- Appuyez sur **Ctrl + S** pour sauvegarder

**✅ Configuration terminée !**

---

## 🚀 ÉTAPE 5 : Redémarrer le Backend

### 5.1 Arrêter le serveur actuel
Dans le terminal où le backend tourne :
- Appuyez sur **Ctrl + C**
- Tapez **O** (Oui) pour confirmer

### 5.2 Redémarrer le serveur
```bash
cd c:\Users\user\Desktop\SAHM\Projet_springBoot\Ega\backend
mvn spring-boot:run
```

### 5.3 Vérifier les logs
Vous devriez voir dans les logs :
```
INFO - JavaMailSenderImpl - Successfully connected to smtp.gmail.com
```

**✅ Le backend est prêt à envoyer des emails !**

---

## 🧪 ÉTAPE 6 : Tester l'Envoi d'Email

### 6.1 Créer un utilisateur de test
1. Allez sur `http://localhost:4200/register`
2. Inscrivez-vous avec **VOTRE VRAI EMAIL** (pour recevoir le test)
3. Remplissez tous les champs
4. Cliquez sur "Envoyer ma demande"

### 6.2 Rejeter l'utilisateur (pour tester)
1. Connectez-vous en admin (`admin` / `password123`)
2. Allez sur "Gestion Clients"
3. Cliquez sur "Voir Détails KYC" pour votre utilisateur de test
4. Cliquez sur "Rejeter"
5. Saisissez un motif : "Test d'envoi d'email"
6. Confirmez

### 6.3 Vérifier votre boîte email
1. Ouvrez votre boîte email (celle que vous avez utilisée pour l'inscription)
2. Vérifiez les **Courriers indésirables** (Spam) aussi !
3. Vous devriez recevoir un email de `egabank.notifications@gmail.com`

**✅ Si vous recevez l'email, tout fonctionne parfaitement !**

---

## 🔍 Dépannage

### Problème 1 : "Authentication failed"
**Solution :**
- Vérifiez que le mot de passe d'application est correct (16 caractères, sans espaces)
- Vérifiez que l'authentification à 2 facteurs est activée
- Régénérez un nouveau mot de passe d'application

### Problème 2 : "Connection timeout"
**Solution :**
- Vérifiez votre connexion Internet
- Vérifiez que le port 587 n'est pas bloqué par votre pare-feu
- Essayez avec le port 465 (SSL) :
```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
```

### Problème 3 : Email dans les Spams
**Solution :**
- C'est normal pour un nouveau compte Gmail
- Marquez l'email comme "Non spam"
- Après quelques envois, Gmail apprendra que ce n'est pas du spam

### Problème 4 : "Less secure app access"
**Solution :**
- Google a désactivé cette option
- Vous DEVEZ utiliser un mot de passe d'application
- Ne cherchez pas à activer "Accès moins sécurisé", ça ne fonctionne plus

---

## 📊 Exemple de Configuration Complète

Voici à quoi devrait ressembler votre `application.properties` :

```properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/ega_bank?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT
jwt.secret=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b
jwt.expiration=86400000

# Email Configuration - Gmail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=egabank.notifications@gmail.com
spring.mail.password=abcdefghijklmnop
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
```

---

## ⚠️ Sécurité - IMPORTANT !

### ❌ NE JAMAIS :
- Partager le mot de passe d'application
- Commiter le fichier `application.properties` sur GitHub avec le mot de passe
- Utiliser votre compte Gmail personnel

### ✅ TOUJOURS :
- Utiliser un compte Gmail dédié pour l'application
- Garder le mot de passe d'application secret
- Utiliser des variables d'environnement en production :
```properties
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

---

## 🎯 Récapitulatif des Identifiants

Notez ces informations dans un endroit sûr :

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPTE GMAIL EGA BANK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email : egabank.notifications@gmail.com
Mot de passe Gmail : [votre mot de passe Gmail]
Mot de passe d'application : [16 caractères]
Téléphone de récupération : +228 XX XX XX XX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ✅ Checklist Finale

Avant de tester, vérifiez que vous avez fait :

- [ ] Créé un compte Gmail dédié
- [ ] Activé l'authentification à 2 facteurs
- [ ] Généré un mot de passe d'application
- [ ] Modifié `application.properties` avec les bons identifiants
- [ ] Sauvegardé le fichier
- [ ] Redémarré le backend
- [ ] Testé avec un vrai email

---

**Date de création** : 27 décembre 2025  
**Version** : 1.0  
**Auteur** : Équipe EGA BANK

**Besoin d'aide ?** Relisez ce guide étape par étape ! 📧
