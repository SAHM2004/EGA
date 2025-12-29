# 🔐 Guide de Validation KYC - EGA BANK

## 📋 Processus de Vérification KYC (Know Your Customer)

### Qu'est-ce que le KYC ?
Le KYC est un processus obligatoire dans le secteur bancaire qui permet de :
- ✅ Vérifier l'identité des clients
- ✅ Prévenir la fraude et le blanchiment d'argent
- ✅ Assurer la conformité réglementaire
- ✅ Protéger la banque et ses clients

---

## 🎯 Critères de Validation

### 1. **Informations Personnelles Complètes**
- ✓ Nom et prénom correspondent à un document d'identité valide
- ✓ Date de naissance indique un âge ≥ 18 ans
- ✓ Sexe est clairement indiqué
- ✓ Nationalité est précisée

### 2. **Coordonnées Valides**
- ✓ Email au format correct (ex: nom@domaine.com)
- ✓ Numéro de téléphone au bon format national (ex: +228 90 XX XX XX pour le Togo)
- ✓ Adresse de résidence complète et vérifiable

### 3. **Cohérence des Informations**
- ✓ Les informations semblent authentiques (pas de données manifestement fausses)
- ✓ L'adresse email correspond au nom du client
- ✓ Pas de signes de fraude évidents

### 4. **Documents Justificatifs** (À implémenter)
Dans une vraie banque, vous demanderiez aussi :
- 📄 Pièce d'identité (CNI, Passeport)
- 📄 Justificatif de domicile (facture d'électricité, quittance de loyer)
- 📄 Photo d'identité récente

---

## ✅ Comment Valider un Compte

### Étape 1 : Consulter les Détails KYC
1. Connectez-vous en tant qu'admin
2. Allez sur "Gestion Clients"
3. Dans la section "Inscriptions à valider", cliquez sur **"Voir Détails KYC"**

### Étape 2 : Vérifier les Informations
La modal affiche :
- 👤 **Identité** : Nom, prénom, date de naissance, sexe
- 🌍 **Informations administratives** : Nationalité, nom d'utilisateur
- 📍 **Contact & Localisation** : Email, téléphone, adresse
- ⚠️ **Points de vérification** : Checklist des critères

### Étape 3 : Prendre une Décision
- Si **TOUT est conforme** → Cliquez sur "Valider ce compte"
- Si **quelque chose est suspect** → Cliquez sur "Rejeter"

---

## ❌ Comment Rejeter un Compte

### Motifs de Rejet Courants
1. **Informations incomplètes** : Des champs manquants ou vides
2. **Informations incohérentes** : Données qui ne correspondent pas entre elles
3. **Âge insuffisant** : Client mineur (< 18 ans)
4. **Suspicion de fraude** : Informations manifestement fausses
5. **Documents manquants** : Pas de pièce d'identité fournie

### Processus de Rejet
1. Cliquez sur **"Rejeter"** (bouton rouge)
2. **Entrez le motif du rejet** dans le prompt (ex: "Informations incomplètes")
3. Confirmez le rejet

---

## 📧 Notification de l'Utilisateur

### Actuellement (Version 1.0)
- ❌ L'utilisateur **n'est PAS encore notifié** automatiquement
- ⚠️ Il voit simplement que son compte est toujours "en attente" quand il essaie de se connecter

### À Implémenter (Version 2.0)

#### Option 1 : Notification par Email
```
Objet : Votre demande d'ouverture de compte EGA BANK

Bonjour [Nom Prénom],

Nous avons bien reçu votre demande d'ouverture de compte.

Malheureusement, nous ne pouvons pas valider votre compte pour le motif suivant :
[MOTIF DU REJET]

Pour régulariser votre situation, veuillez :
1. Vérifier les informations fournies
2. Nous contacter au +228 XX XX XX XX
3. Vous présenter en agence avec vos documents d'identité

Cordialement,
L'équipe EGA BANK
```

#### Option 2 : Notification dans l'Application
- Ajouter un champ `rejectionReason` dans la table `users`
- Afficher le motif sur la page de connexion si le compte est rejeté
- Permettre à l'utilisateur de corriger ses informations

#### Option 3 : SMS
```
EGA BANK: Votre demande de compte a été refusée. 
Motif: [MOTIF]. 
Contactez-nous au +228 XX XX XX XX
```

---

## 🛠️ Implémentation Backend (À faire)

### 1. Ajouter un Endpoint de Rejet
```java
@PostMapping("/reject/{username}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Map<String, String>> rejectUser(
    @PathVariable String username,
    @RequestBody Map<String, String> payload
) {
    String reason = payload.get("reason");
    authService.rejectUser(username, reason);
    // Envoyer email de notification
    emailService.sendRejectionEmail(username, reason);
    return ResponseEntity.ok(Map.of("message", "Compte rejeté et utilisateur notifié."));
}
```

### 2. Modifier l'Entité User
```java
@Entity
public class User {
    // ... autres champs
    
    private boolean enabled = false;
    
    @Enumerated(EnumType.STRING)
    private AccountStatus status; // PENDING, APPROVED, REJECTED
    
    private String rejectionReason;
    
    private LocalDateTime rejectedAt;
}
```

### 3. Service d'Email
```java
@Service
public class EmailService {
    public void sendRejectionEmail(String username, String reason) {
        User user = userRepository.findByUsername(username).orElseThrow();
        String email = user.getClient().getEmail();
        
        String subject = "Votre demande d'ouverture de compte EGA BANK";
        String body = String.format(
            "Bonjour %s %s,\n\n" +
            "Votre demande a été refusée pour le motif suivant :\n%s\n\n" +
            "Cordialement,\nEGA BANK",
            user.getClient().getPrenom(),
            user.getClient().getNom(),
            reason
        );
        
        mailSender.send(email, subject, body);
    }
}
```

---

## 📊 Statistiques de Validation (À implémenter)

### Dashboard Admin
Afficher :
- 📈 Taux d'approbation : 85%
- ⏱️ Temps moyen de traitement : 2h30
- ✅ Comptes validés aujourd'hui : 12
- ❌ Comptes rejetés aujourd'hui : 3
- ⏳ En attente : 5

### Motifs de Rejet les Plus Fréquents
1. Informations incomplètes (40%)
2. Documents manquants (30%)
3. Âge insuffisant (15%)
4. Suspicion de fraude (10%)
5. Autres (5%)

---

## 🔄 Workflow Complet

```
┌─────────────────────────────────────────────────────────┐
│  CLIENT s'inscrit en ligne                              │
│  ↓                                                       │
│  Compte créé avec enabled=false, status=PENDING         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  ADMIN consulte "Inscriptions à valider"                │
│  ↓                                                       │
│  Clique sur "Voir Détails KYC"                          │
│  ↓                                                       │
│  Vérifie toutes les informations                        │
└─────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│  ✅ VALIDATION   │          │  ❌ REJET        │
│  enabled=true    │          │  status=REJECTED │
│  status=APPROVED │          │  + motif         │
└──────────────────┘          └──────────────────┘
        ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│  Email de        │          │  Email de rejet  │
│  confirmation    │          │  avec motif      │
└──────────────────┘          └──────────────────┘
        ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│  Client peut     │          │  Client contacte │
│  se connecter    │          │  la banque       │
└──────────────────┘          └──────────────────┘
```

---

## 🎯 Prochaines Étapes

### Court Terme (Semaine 1)
1. ✅ Afficher les détails KYC complets
2. ⬜ Implémenter l'endpoint de rejet backend
3. ⬜ Ajouter le champ `rejectionReason` dans la BDD
4. ⬜ Envoyer un email de notification

### Moyen Terme (Mois 1)
1. ⬜ Upload de documents (pièce d'identité, justificatif)
2. ⬜ Vérification automatique de l'âge
3. ⬜ Validation de l'email (code de confirmation)
4. ⬜ Dashboard de statistiques KYC

### Long Terme (Trimestre 1)
1. ⬜ Vérification d'identité par IA (reconnaissance faciale)
2. ⬜ Intégration avec des bases de données nationales
3. ⬜ Système de scoring de risque
4. ⬜ Audit trail complet (qui a validé/rejeté, quand, pourquoi)

---

**Date de création** : 26 décembre 2025  
**Version** : 1.0  
**Auteur** : Équipe EGA BANK
