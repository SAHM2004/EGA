package com.ega.bank.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Envoie un email de notification de rejet de compte
     */
    public void sendRejectionEmail(String toEmail, String clientName, String username, String reason) {
        if (toEmail == null || toEmail.isEmpty()) {
            log.warn("Tentative d'envoi d'email de rejet à une adresse null ou vide pour {}", username);
            return;
        }
        System.out.println("DEBUG: EmailService.sendRejectionEmail vers " + toEmail);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@egabank.com");
            message.setTo(toEmail);
            message.setSubject("EGA BANK - Votre demande d'ouverture de compte");

            String body = String.format(
                    "Bonjour %s,\n\n" +
                            "Nous avons bien reçu votre demande d'ouverture de compte (Identifiant: %s).\n\n" +
                            "Malheureusement, nous ne pouvons pas valider votre compte pour le motif suivant :\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                            "%s\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                            "Pour régulariser votre situation, vous pouvez :\n" +
                            "  • Vérifier et corriger les informations fournies\n" +
                            "  • Nous contacter au +228 XX XX XX XX\n" +
                            "  • Vous présenter en agence avec vos documents d'identité\n\n" +
                            "Nous restons à votre disposition pour toute question.\n\n" +
                            "Cordialement,\n" +
                            "L'équipe EGA BANK\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                            "Cet email est automatique, merci de ne pas y répondre.\n" +
                            "Pour nous contacter : contact@egabank.com",
                    clientName,
                    username,
                    reason);

            message.setText(body);

            mailSender.send(message);
            log.info("Email de rejet envoyé à {} pour l'utilisateur {}", toEmail, username);

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email de rejet à {}: {}", toEmail, e.getMessage());
            // On ne bloque pas le processus si l'email échoue
        }
    }

    /**
     * Envoie un email de confirmation de validation de compte
     */
    public void sendApprovalEmail(String toEmail, String clientName, String username) {
        if (toEmail == null || toEmail.isEmpty()) {
            log.warn("Tentative d'envoi d'email de validation à une adresse null ou vide pour {}", username);
            return;
        }
        System.out.println("DEBUG: EmailService.sendApprovalEmail vers " + toEmail);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@egabank.com");
            message.setTo(toEmail);
            message.setSubject("EGA BANK - Votre compte a été validé !");

            String body = String.format(
                    "Bonjour %s,\n\n" +
                            "Excellente nouvelle ! 🎉\n\n" +
                            "Votre compte EGA BANK a été validé avec succès.\n\n" +
                            "Vous pouvez maintenant vous connecter avec vos identifiants :\n" +
                            "  • Identifiant : %s\n" +
                            "  • Mot de passe : celui que vous avez choisi lors de l'inscription\n\n" +
                            "Connectez-vous sur : http://localhost:4200/login\n\n" +
                            "Prochaines étapes :\n" +
                            "  1. Connectez-vous à votre espace client\n" +
                            "  2. Demandez l'ouverture d'un compte bancaire\n" +
                            "  3. Commencez à utiliser nos services\n\n" +
                            "Bienvenue chez EGA BANK !\n\n" +
                            "Cordialement,\n" +
                            "L'équipe EGA BANK\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                            "Besoin d'aide ? Contactez-nous : contact@egabank.com",
                    clientName,
                    username);

            message.setText(body);

            mailSender.send(message);
            log.info("Email de validation envoyé à {} pour l'utilisateur {}", toEmail, username);

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email de validation à {}: {}", toEmail, e.getMessage());
        }
    }

    /**
     * Envoie un email d'approbation de demande de compte bancaire
     */
    public void sendAccountApprovalEmail(String toEmail, String clientName, String accountType, String iban) {
        if (toEmail == null || toEmail.isEmpty()) {
            log.warn("Tentative d'envoi d'email d'approbation de compte à une adresse null ou vide pour l'IBAN {}", iban);
            return;
        }
        System.out.println("DEBUG: EmailService.sendAccountApprovalEmail vers " + toEmail + " (IBAN: " + iban + ")");
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@egabank.com");
            message.setTo(toEmail);
            message.setSubject("EGA BANK - Votre demande de compte a été approuvée !");

            String body = String.format(
                    "Bonjour %s,\n\n" +
                            "Excellente nouvelle ! 🎉\n\n" +
                            "Votre demande d'ouverture de %s a été approuvée avec succès.\n\n" +
                            "Détails de votre nouveau compte :\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                            "  • Type : %s\n" +
                            "  • IBAN : %s\n" +
                            "  • Solde initial : 0 FCFA\n" +
                            "  • Statut : Actif\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                            "Vous pouvez dès maintenant :\n" +
                            "  ✓ Effectuer des dépôts\n" +
                            "  ✓ Faire des retraits\n" +
                            "  ✓ Réaliser des virements\n" +
                            "  ✓ Consulter votre solde\n" +
                            "  ✓ Imprimer vos relevés bancaires\n\n" +
                            "Connectez-vous sur : http://localhost:4200/login\n\n" +
                            "Bienvenue dans votre nouvelle banque !\n\n" +
                            "Cordialement,\n" +
                            "L'équipe EGA BANK\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                            "Besoin d'aide ? Contactez-nous : contact@egabank.com",
                    clientName,
                    accountType,
                    accountType,
                    iban);

            message.setText(body);
            mailSender.send(message);
            log.info("Email d'approbation de compte envoyé à {} pour le compte {}", toEmail, iban);

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email d'approbation de compte à {}: {}", toEmail, e.getMessage());
        }
    }

    /**
     * Envoie un email de rejet de demande de compte bancaire
     */
    public void sendAccountRejectionEmail(String toEmail, String clientName, String accountType, String reason) {
        if (toEmail == null || toEmail.isEmpty()) {
            log.warn("Tentative d'envoi d'email de rejet de compte à une adresse null ou vide");
            return;
        }
        System.out.println("DEBUG: EmailService.sendAccountRejectionEmail vers " + toEmail);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@egabank.com");
            message.setTo(toEmail);
            message.setSubject("EGA BANK - Votre demande de compte");

            String body = String.format(
                    "Bonjour %s,\n\n" +
                            "Nous avons bien reçu votre demande d'ouverture de %s.\n\n" +
                            "Malheureusement, nous ne pouvons pas approuver votre demande pour le motif suivant :\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                            "%s\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                            "Que faire maintenant ?\n" +
                            "  • Vérifiez les informations de votre profil\n" +
                            "  • Contactez-nous au +228 XX XX XX XX\n" +
                            "  • Présentez-vous en agence avec vos documents\n" +
                            "  • Soumettez une nouvelle demande après correction\n\n" +
                            "Nous restons à votre disposition pour vous accompagner.\n\n" +
                            "Cordialement,\n" +
                            "L'équipe EGA BANK\n" +
                            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                            "Besoin d'aide ? Contactez-nous : contact@egabank.com",
                    clientName,
                    accountType,
                    reason);

            message.setText(body);
            mailSender.send(message);
            log.info("Email de rejet de demande de compte envoyé à {}", toEmail);

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email de rejet de demande de compte à {}: {}", toEmail,
                    e.getMessage());
        }
    }

}
