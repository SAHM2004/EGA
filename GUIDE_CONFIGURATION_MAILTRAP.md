# 📧 Configuration Mailtrap pour EGA BANK - Guide Rapide

## 🎯 Pourquoi Mailtrap ?

✅ **Gratuit** pour toujours  
✅ **Aucune configuration compliquée**  
✅ **Voir les emails sans les envoyer réellement**  
✅ **Parfait pour les tests**  
✅ **Pas besoin de mot de passe d'application**  

---

## 🚀 ÉTAPE 1 : Créer un Compte Mailtrap (2 minutes)

### 1.1 Ouvrir Mailtrap
1. Ouvrez votre navigateur
2. Allez sur : **https://mailtrap.io**
3. Cliquez sur **"Sign Up"** (S'inscrire) en haut à droite

### 1.2 S'inscrire
Vous avez 3 options :

**Option A : Avec Google (Le plus rapide)** ⚡
- Cliquez sur "Sign up with Google"
- Choisissez votre compte Google
- Autorisez Mailtrap
- ✅ C'est fait !

**Option B : Avec GitHub**
- Cliquez sur "Sign up with GitHub"
- Connectez-vous à GitHub
- Autorisez Mailtrap

**Option C : Avec Email**
- Entrez votre email
- Créez un mot de passe
- Cliquez sur "Sign Up"
- Vérifiez votre email et cliquez sur le lien de confirmation

### 1.3 Compléter le profil
- **Nom** : EGA Bank
- **Type de compte** : Developer (Développeur)
- **Taille de l'équipe** : Just me (Juste moi)
- Cliquez sur "Continue"

✅ **Compte créé !**

---

## 📬 ÉTAPE 2 : Récupérer les Identifiants SMTP (1 minute)

### 2.1 Accéder à votre Inbox
Après l'inscription, vous serez automatiquement sur la page "Inbox".

Si ce n'est pas le cas :
1. Allez sur : **https://mailtrap.io/inboxes**
2. Cliquez sur "My Inbox" (ou "Demo Inbox")

### 2.2 Copier les identifiants SMTP
1. Dans la section "**SMTP Settings**" (à droite ou en bas)
2. Dans le menu déroulant "**Integrations**", sélectionnez **"Spring Boot"** ou **"Java"**
3. Vous verrez quelque chose comme :

```
Host: smtp.mailtrap.io
Port: 2525
Username: 1a2b3c4d5e6f7g
Password: 9h8i7j6k5l4m3n
```

### 2.3 Copier ces informations
**Copiez** ces 4 valeurs :
- Host
- Port
- Username
- Password

📋 **Gardez cette page ouverte**, vous en aurez besoin !

---

## ⚙️ ÉTAPE 3 : Configurer Spring Boot (2 minutes)

### 3.1 Ouvrir le fichier de configuration
Ouvrez le fichier :
```
c:\Users\user\Desktop\SAHM\Projet_springBoot\Ega\backend\src\main\resources\application.properties
```

### 3.2 Modifier la configuration email
Trouvez la section "Email Configuration" et **remplacez-la** par :

```properties
# Email Configuration - Mailtrap (Development)
spring.mail.host=smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=VOTRE_USERNAME_MAILTRAP
spring.mail.password=VOTRE_PASSWORD_MAILTRAP
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 3.3 Remplacer les valeurs
Remplacez :
- `VOTRE_USERNAME_MAILTRAP` → Le username que vous avez copié
- `VOTRE_PASSWORD_MAILTRAP` → Le password que vous avez copié

**Exemple réel :**
```properties
spring.mail.host=smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=1a2b3c4d5e6f7g
spring.mail.password=9h8i7j6k5l4m3n
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 3.4 Sauvegarder
- Appuyez sur **Ctrl + S**

✅ **Configuration terminée !**

---

## 🔄 ÉTAPE 4 : Redémarrer le Backend (1 minute)

### 4.1 Arrêter le serveur
Dans le terminal où le backend tourne :
- Appuyez sur **Ctrl + C**
- Tapez **O** (Oui) pour confirmer

### 4.2 Redémarrer
```bash
cd c:\Users\user\Desktop\SAHM\Projet_springBoot\Ega\backend
mvn spring-boot:run
```

### 4.3 Vérifier les logs
Attendez que le serveur démarre. Vous devriez voir :
```
INFO - Started BankApplication in X seconds
```

✅ **Backend redémarré !**

---

## 🧪 ÉTAPE 5 : Tester l'Envoi d'Email (2 minutes)

### 5.1 Créer un utilisateur de test
1. Ouvrez votre navigateur
2. Allez sur `http://localhost:4200/register`
3. Inscrivez-vous avec **n'importe quel email** (ex: `test@example.com`)
4. Remplissez tous les champs
5. Cliquez sur "Envoyer ma demande"

### 5.2 Rejeter l'utilisateur
1. Allez sur `http://localhost:4200/login`
2. Connectez-vous en admin : `admin` / `password123`
3. Cliquez sur "Gestion Clients"
4. Trouvez votre utilisateur de test
5. Cliquez sur "Voir Détails KYC"
6. Cliquez sur "Rejeter"
7. Saisissez un motif : "Test Mailtrap"
8. Confirmez

### 5.3 Vérifier l'email dans Mailtrap
1. Retournez sur **https://mailtrap.io/inboxes**
2. Cliquez sur "My Inbox"
3. **Vous devriez voir votre email !** 📧

Cliquez dessus pour voir :
- Le contenu complet de l'email
- L'expéditeur : `noreply@egabank.com`
- Le destinataire : `test@example.com`
- Le motif du rejet

✅ **Ça marche !** 🎉

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

# Email Configuration - Mailtrap (Development)
spring.mail.host=smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=1a2b3c4d5e6f7g
spring.mail.password=9h8i7j6k5l4m3n
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 🎨 Interface Mailtrap

Dans Mailtrap, vous pourrez :

### Voir les Emails
- **Inbox** : Tous les emails envoyés
- **HTML** : Version HTML de l'email
- **Text** : Version texte
- **Raw** : Code source complet

### Analyser
- **Headers** : En-têtes de l'email
- **Spam Analysis** : Score anti-spam
- **HTML Check** : Validation du HTML

### Tester
- **Forward** : Transférer vers un vrai email
- **Share** : Partager avec votre équipe

---

## 🔍 Dépannage

### Problème 1 : "Authentication failed"
**Solution :**
- Vérifiez que vous avez copié le bon username et password
- Vérifiez qu'il n'y a pas d'espaces avant ou après
- Régénérez les identifiants dans Mailtrap

### Problème 2 : "Connection refused"
**Solution :**
- Vérifiez que le port est bien `2525`
- Vérifiez votre connexion Internet
- Vérifiez que votre pare-feu n'bloque pas le port

### Problème 3 : Email non reçu dans Mailtrap
**Solution :**
- Vérifiez les logs du backend pour voir si l'email a été envoyé
- Rafraîchissez la page Mailtrap (F5)
- Vérifiez que vous êtes dans le bon inbox

---

## 📸 Captures d'Écran Textuelles

### Page Mailtrap - SMTP Settings
```
┌─────────────────────────────────────────────────┐
│  SMTP Settings                                  │
├─────────────────────────────────────────────────┤
│  Integrations: [Spring Boot ▼]                 │
│                                                 │
│  Host:     smtp.mailtrap.io                     │
│  Port:     2525                                 │
│  Username: 1a2b3c4d5e6f7g                       │
│  Password: 9h8i7j6k5l4m3n                       │
│  Auth:     Plain                                │
│                                                 │
│  [Copy Configuration]                           │
└─────────────────────────────────────────────────┘
```

### Email Reçu dans Mailtrap
```
┌─────────────────────────────────────────────────┐
│  From: noreply@egabank.com                      │
│  To:   test@example.com                         │
│  Subject: EGA BANK - Votre demande d'ouverture │
│                                                 │
│  Bonjour Test User,                             │
│                                                 │
│  Nous avons bien reçu votre demande...          │
│  Malheureusement, nous ne pouvons pas valider   │
│  votre compte pour le motif suivant :           │
│                                                 │
│  Test Mailtrap                                  │
│                                                 │
│  Pour régulariser votre situation...            │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist Finale

- [ ] Compte Mailtrap créé
- [ ] Identifiants SMTP copiés
- [ ] `application.properties` modifié
- [ ] Fichier sauvegardé
- [ ] Backend redémarré
- [ ] Utilisateur de test créé
- [ ] Email de rejet envoyé
- [ ] Email visible dans Mailtrap

---

## 🎯 Avantages de Mailtrap

| Fonctionnalité | Mailtrap | Gmail |
|----------------|----------|-------|
| Configuration | ⚡ 5 min | ⏱️ 15 min |
| Sécurité | ✅ Simple | 🔐 2FA requis |
| Voir les emails | ✅ Interface web | ❌ Envoi réel |
| Tests illimités | ✅ Gratuit | ⚠️ Limites |
| Spam check | ✅ Inclus | ❌ Non |
| Équipe | ✅ Partage facile | ❌ Compliqué |

---

## 🚀 Prochaines Étapes

Une fois que Mailtrap fonctionne :

1. **Testez la validation** (email de bienvenue)
2. **Testez le rejet** (email avec motif)
3. **Vérifiez le contenu** des emails
4. **Partagez avec votre équipe** si besoin

En production, vous pourrez facilement passer à :
- SendGrid
- Mailgun
- Ou Gmail

---

**Date de création** : 27 décembre 2025  
**Version** : 1.0  
**Temps estimé** : ⏱️ 5-10 minutes  
**Auteur** : Équipe EGA BANK

**C'est parti ! 🚀**
