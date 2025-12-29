# ========================================
# Script de Test API - Utilisateur "mouna"
# ========================================
# Ce script teste si l'API retourne bien les comptes de mouna
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test API - Utilisateur mouna" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Étape 1 : Connexion
Write-Host "Étape 1 : Connexion en tant que mouna..." -ForegroundColor Yellow

$loginBody = @{
    username = "mouna"
    password = "VOTRE_MOT_DE_PASSE_ICI"  # ⚠️ REMPLACEZ PAR LE VRAI MOT DE PASSE
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody

    $token = $loginResponse.token
    Write-Host "✅ Connexion réussie !" -ForegroundColor Green
    Write-Host "Token : $token" -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "❌ Erreur de connexion !" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

# Étape 2 : Récupération des comptes
Write-Host "Étape 2 : Récupération des comptes..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $accountsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/accounts/my" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ Requête réussie !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Nombre de comptes trouvés : $($accountsResponse.Count)" -ForegroundColor Cyan
    Write-Host ""

    if ($accountsResponse.Count -eq 0) {
        Write-Host "⚠️ PROBLÈME : Aucun compte trouvé !" -ForegroundColor Red
        Write-Host "La base de données contient 2 comptes, mais l'API n'en retourne aucun." -ForegroundColor Red
        Write-Host ""
        Write-Host "Causes possibles :" -ForegroundColor Yellow
        Write-Host "1. Le backend ne récupère pas correctement le client_id du token JWT" -ForegroundColor Yellow
        Write-Host "2. La méthode getAccountsByUsername() a un problème" -ForegroundColor Yellow
        Write-Host "3. Le username dans le token ne correspond pas à 'mouna'" -ForegroundColor Yellow
    }
    else {
        Write-Host "✅ Comptes trouvés :" -ForegroundColor Green
        foreach ($account in $accountsResponse) {
            Write-Host ""
            Write-Host "  📋 Compte $($account.type)" -ForegroundColor Cyan
            Write-Host "     IBAN : $($account.numeroCompte)" -ForegroundColor White
            Write-Host "     Solde : $($account.solde) FCFA" -ForegroundColor White
            Write-Host "     Date : $($account.dateCreation)" -ForegroundColor White
        }
    }
}
catch {
    Write-Host "❌ Erreur lors de la récupération des comptes !" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fin du test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
