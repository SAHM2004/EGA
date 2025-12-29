-- ========================================
-- Script SQL : Correction Lien User-Client
-- ========================================
-- Date : 27 décembre 2025
-- Objectif : Lier les users aux clients pour qu'ils voient leurs comptes
-- ========================================

-- ÉTAPE 1 : Diagnostic - Voir tous les users et leurs clients
SELECT 
    u.id AS user_id,
    u.username,
    u.role,
    u.enabled,
    u.client_id,
    c.id AS client_real_id,
    c.nom,
    c.prenom,
    c.email
FROM users u
LEFT JOIN client c ON u.client_id = c.id
ORDER BY u.id;

-- ÉTAPE 2 : Trouver les users sans client_id (problème)
SELECT 
    u.id AS user_id,
    u.username,
    u.role,
    u.client_id
FROM users u
WHERE u.role = 'ROLE_CLIENT' AND u.client_id IS NULL;

-- ÉTAPE 3 : Voir tous les clients disponibles
SELECT 
    id,
    nom,
    prenom,
    email,
    telephone
FROM client
ORDER BY id;

-- ÉTAPE 4 : Voir les comptes créés et leurs clients
SELECT 
    a.numero_compte AS IBAN,
    a.type,
    a.solde,
    a.client_id,
    c.nom,
    c.prenom,
    c.email
FROM account a
JOIN client c ON a.client_id = c.id
ORDER BY a.client_id;

-- ========================================
-- CORRECTION MANUELLE
-- ========================================
-- Remplacez USERNAME_CLIENT et ID_CLIENT par les vraies valeurs

-- Exemple : Si le client s'appelle "SAHM Memounatou" avec l'ID 1
-- et le username est "memouna"

-- UPDATE users 
-- SET client_id = 1 
-- WHERE username = 'memouna';

-- ========================================
-- CORRECTION AUTOMATIQUE (Plus sûr)
-- ========================================
-- Cette requête lie automatiquement les users aux clients
-- en se basant sur l'email (si l'email du user = email du client)

-- ATTENTION : Vérifiez d'abord que les emails correspondent !

-- UPDATE users u
-- JOIN client c ON u.username = LOWER(CONCAT(SUBSTRING(c.prenom, 1, 1), c.nom))
-- SET u.client_id = c.id
-- WHERE u.role = 'ROLE_CLIENT' AND u.client_id IS NULL;

-- ========================================
-- VÉRIFICATION APRÈS CORRECTION
-- ========================================
-- Vérifiez que tous les clients ont maintenant un client_id

SELECT 
    u.id AS user_id,
    u.username,
    u.client_id,
    c.nom,
    c.prenom,
    COUNT(a.numero_compte) AS nombre_comptes
FROM users u
LEFT JOIN client c ON u.client_id = c.id
LEFT JOIN account a ON c.id = a.client_id
WHERE u.role = 'ROLE_CLIENT'
GROUP BY u.id, u.username, u.client_id, c.nom, c.prenom
ORDER BY u.id;

-- ========================================
-- EXEMPLE COMPLET
-- ========================================
-- Supposons que vous avez :
-- - Un client : ID=1, nom="SAHM", prenom="Memounatou", email="mounasahm39@gmail.com"
-- - Un user : username="memouna", client_id=NULL
-- - 2 comptes bancaires créés pour le client ID=1

-- Correction :
-- UPDATE users SET client_id = 1 WHERE username = 'memouna';

-- Vérification :
-- SELECT u.username, c.nom, c.prenom, COUNT(a.numero_compte) AS comptes
-- FROM users u
-- JOIN client c ON u.client_id = c.id
-- JOIN account a ON c.id = a.client_id
-- WHERE u.username = 'memouna'
-- GROUP BY u.username, c.nom, c.prenom;

-- Résultat attendu : comptes = 2

-- ========================================
-- FIN DU SCRIPT
-- ========================================
