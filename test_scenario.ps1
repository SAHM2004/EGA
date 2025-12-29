$adminToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzY2ODUzNzM4LCJleHAiOjE3NjY5NDAxMzh9.nkPXxoUulgG7fDTwn5gOaCJMcafMyJKTMyr6NS178vM"
$baseUrl = "http://localhost:8080/api"

function Show-Header($msg) {
    Write-Host "`n=== $msg ===" -ForegroundColor Cyan
}

# 1. Register a new user
Show-Header "1. Inscription d'un nouveau client"
$timestamp = (Get-Date -Format "yyyyMMddHHmmss")
$username = "test_$timestamp"
$registerBody = @{
    username = $username
    password = "password123"
    client = @{
        nom = "TEST"
        prenom = "User_$timestamp"
        email = "test$timestamp@example.com"
        telephone = "+228 99 99 99 99"
        adresse = "Test Address"
        dateNaissance = "1990-01-01"
        sexe = "M"
        nationalite = "Togo"
    }
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "✅ Inscription réussie: $($regResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec inscription: $_" -ForegroundColor Red
    exit
}

# 2. Get Client ID from Pending List
Show-Header "2. Recherche de l'ID client dans les comptes en attente"
try {
    $adminHeaders = @{Authorization = "Bearer $adminToken"}
    $pending = Invoke-RestMethod -Uri "$baseUrl/auth/pending-users" -Method GET -Headers $adminHeaders
    $myUser = $pending | Where-Object { $_.username -eq $username }
    
    if (-not $myUser) {
        Write-Host "❌ Utilisateur non trouvé dans la liste d'attente !" -ForegroundColor Red
        exit
    }
    
    $clientId = $myUser.client.id
    Write-Host "✅ Client ID trouvé: $clientId" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec récupération pending: $_" -ForegroundColor Red
    exit
}

# 3. Activate the new user
Show-Header "3. Activation de l'utilisateur $username"
try {
    $actResponse = Invoke-RestMethod -Uri "$baseUrl/auth/activate/$username" -Method POST -Headers $adminHeaders
    Write-Host "✅ Activation réussie: $($actResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec activation: $_" -ForegroundColor Red
}

# 4. Create an account (by Admin)
Show-Header "4. Création d'un compte pour le client $clientId"
$accountBody = @{
    clientId = $clientId
    type = "CURRENT"
    decouvert = 50000
    profession = "Testeur"
    revenusMensuels = 100000
    employeur = "Tests Corp"
    objectifCompte = "Tests"
    agenceRattachement = "Lome Nord"
    personneUrgence = "Admin"
    telephoneUrgence = "00000000"
} | ConvertTo-Json

try {
    $accResponse = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method POST -ContentType "application/json" -Headers $adminHeaders -Body $accountBody
    $accountNumber = $accResponse.numeroCompte
    Write-Host "✅ Compte créé: $accountNumber" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec création compte: $_" -ForegroundColor Red
    exit
}

# 5. Login as the new user
Show-Header "5. Connexion de l'utilisateur $username"
$loginBody = @{username=$username; password="password123"} | ConvertTo-Json
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $userToken = $loginResponse.token
    $userHeaders = @{Authorization = "Bearer $userToken"}
    Write-Host "✅ Connexion réussie" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec connexion: $_" -ForegroundColor Red
    exit
}

# 6. Deposit (By Client)
Show-Header "6. Dépôt de 100 000 FCFA"
$depositBody = @{accountId = $accountNumber; amount = 100000} | ConvertTo-Json
try {
    $depResponse = Invoke-RestMethod -Uri "$baseUrl/transactions/deposit" -Method POST -ContentType "application/json" -Headers $userHeaders -Body $depositBody
    Write-Host "✅ Dépôt réussi, ID Transaction: $($depResponse.id)" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec dépôt: $_" -ForegroundColor Red
}

# 7. Withdrawal (By Client)
Show-Header "7. Retrait de 20 000 FCFA"
$withdrawBody = @{accountId = $accountNumber; amount = 20000} | ConvertTo-Json
try {
    $withResponse = Invoke-RestMethod -Uri "$baseUrl/transactions/withdraw" -Method POST -ContentType "application/json" -Headers $userHeaders -Body $withdrawBody
    Write-Host "✅ Retrait réussi, ID Transaction: $($withResponse.id)" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec retrait: $_" -ForegroundColor Red
}

# 8. Transfer (To existing SAHM account)
$destAccount = "FR7656652008834612920075128"
Show-Header "8. Virement de 10 000 FCFA vers $destAccount"
$transferBody = @{
    sourceAccountId = $accountNumber
    destinationAccountId = $destAccount
    amount = 10000
} | ConvertTo-Json

try {
    $transResponse = Invoke-RestMethod -Uri "$baseUrl/transactions/transfer" -Method POST -ContentType "application/json" -Headers $userHeaders -Body $transferBody
    Write-Host "✅ Virement réussi" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec virement: $_" -ForegroundColor Red
}

# 9. Get Status summary
Show-Header "9. Résumé final"
try {
    $finalAcc = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method GET -Headers $adminHeaders | Where-Object { $_.numeroCompte -eq $accountNumber }
    Write-Host "   - Compte : $accountNumber"
    Write-Host "   - Client : $username (ID: $clientId)"
    Write-Host "   - Solde  : $($finalAcc.solde) FCFA" -ForegroundColor Yellow
    
    if ($finalAcc.solde -eq 70000) {
        Write-Host "`n⭐ TEST RÉUSSI : Toutes les fonctionnalités testées sont OK !" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️ TEST PARTIEL : Différence de solde détectée." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Échec résumé: $_" -ForegroundColor Red
}
