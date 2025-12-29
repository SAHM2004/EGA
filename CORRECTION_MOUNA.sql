-- ========================================
-- Correction Rapide pour l'utilisateur "mouna"
-- ========================================
-- Problème : mouna ne voit pas ses 2 comptes
-- Cause : Le user "mouna" n'est pas lié au client dans la table users
-- ========================================

-- ÉTAPE 1 : Diagnostic - Voir l'état actuel
SELECT 
    u.id AS user_id,
    u.username,
    u.client_id AS client_id_actuel,
    u.enabled,
    c.id AS client_real_id,
    c.nom,
    c.prenom,
    c.email
FROM users u
LEFT JOIN client c ON u.client_id = c.id
WHERE u.username = 'mouna';

-- Résultat attendu : client_id_actuel = NULL (c'est le problème !)

-- ÉTAPE 2 : Trouver l'ID du client "mouna" (SAHM Memounatou)
SELECT 
    id,
    nom,
    prenom,
    email,
    telephone
FROM client
WHERE nom LIKE '%SAHM%' OR prenom LIKE '%Memounatou%' OR prenom LIKE '%mouna%';

-- Notez l'ID du client (probablement 1, 2, ou 3)

-- ÉTAPE 3 : Voir les comptes créés pour ce client
SELECT 
    a.numero_compte AS IBAN,
    a.type,
    a.solde,
    a.client_id,
    c.nom,
    c.prenom
FROM account a
JOIN client c ON a.client_id = c.id
WHERE c.nom LIKE '%SAHM%' OR c.prenom LIKE '%Memounatou%';

-- Vous devriez voir les 2 comptes ici

-- ========================================
-- CORRECTION (À EXÉCUTER APRÈS AVOIR TROUVÉ L'ID)
-- ========================================

-- Remplacez X par l'ID du client trouvé à l'ÉTAPE 2
-- Par exemple, si l'ID du client est 1 :

UPDATE users 
SET client_id = 1 
WHERE username = 'mouna';

-- ⚠️ IMPORTANT : Remplacez "1" par le vrai ID du client !

-- ========================================
-- VÉRIFICATION APRÈS CORRECTION
-- ========================================

-- Vérifiez que le lien est créé
SELECT 
    u.username,
    u.client_id,
    c.nom,
    c.prenom,
    COUNT(a.numero_compte) AS nombre_comptes
FROM users u
JOIN client c ON u.client_id = c.id
LEFT JOIN account a ON c.id = a.client_id
WHERE u.username = 'mouna'
GROUP BY u.username, u.client_id, c.nom, c.prenom;

-- Résultat attendu : nombre_comptes = 2

-- ========================================
-- EXEMPLE COMPLET AVEC VALEURS RÉELLES
-- ========================================

-- Si après l'ÉTAPE 2, vous trouvez :
-- - Client ID = 1
-- - Nom = SAHM
-- - Prénom = Memounatou

-- Alors exécutez :
-- UPDATE users SET client_id = 1 WHERE username = 'mouna';

-- Puis vérifiez :
-- SELECT u.username, c.nom, c.prenom, COUNT(a.numero_compte) AS comptes
-- FROM users u
-- JOIN client c ON u.client_id = c.id
-- JOIN account a ON c.id = a.client_id
-- WHERE u.username = 'mouna'
-- GROUP BY u.username, c.nom, c.prenom;

-- ========================================
-- FIN DU SCRIPT
-- ========================================
