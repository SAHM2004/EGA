$adminToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzY2ODUzNzM4LCJleHAiOjE3NjY5NDAxMzh9.nkPXxoUulgG7fDTwn5gOaCJMcafMyJKTMyr6NS178vM"
$baseUrl = "http://localhost:8080/api"
$adminHeaders = @{Authorization = "Bearer $adminToken"}

function Show-Header($msg) {
    Write-Host "`n=== $msg ===" -ForegroundColor Cyan
}

# 1. Login as a client (test_20251227174754)
Show-Header "1. Connexion Client pour demande de compte"
$user = "test_20251227174754"
$loginBody = @{username=$user; password="password123"} | ConvertTo-Json
try {
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $userToken = $login.token
    $userHeaders = @{Authorization = "Bearer $userToken"}
    Write-Host "✅ Connexion réussie" -ForegroundColor Green
} catch {
    Write-Host "❌ Connexion échouée: $_" -ForegroundColor Red
    exit
}

# 2. Create Account Request
Show-Header "2. Création d'une demande de compte Épargne"
$requestBody = @{
    type = "SAVINGS"
    initialDeposit = 50000
    profession = "Ingénieur"
    revenusMensuels = 1500000
    employeur = "Google"
    objectifCompte = "Epargne Projet"
    agenceRattachement = "Lomé Centre"
    personneUrgence = "Papa"
    telephoneUrgence = "99999999"
} | ConvertTo-Json

try {
    $reqRes = Invoke-RestMethod -Uri "$baseUrl/account-requests" -Method POST -Headers $userHeaders -ContentType "application/json" -Body $requestBody
    $requestId = $reqRes.id
    Write-Host "✅ Demande créée, ID: $requestId" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec demande: $_" -ForegroundColor Red
}

# 3. List Pending Requests (Admin)
Show-Header "3. Liste des demandes en attente (Admin)"
try {
    $pending = Invoke-RestMethod -Uri "$baseUrl/account-requests/pending" -Method GET -Headers $adminHeaders
    $myReq = $pending | Where-Object { $_.id -eq $requestId }
    if ($myReq) {
        Write-Host "✅ Demande trouvée dans la liste admin" -ForegroundColor Green
    } else {
        Write-Host "❌ Demande NON trouvée !" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Échec listage pending: $_" -ForegroundColor Red
}

# 4. Approve Request
Show-Header "4. Approbation de la demande $requestId"
try {
    Invoke-RestMethod -Uri "$baseUrl/account-requests/$requestId/approve" -Method POST -Headers $adminHeaders
    Write-Host "✅ Demande approuvée" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec approbation: $_" -ForegroundColor Red
}

# 5. Verify Account was created
Show-Header "5. Vérification de la création du compte"
try {
    $myAccounts = Invoke-RestMethod -Uri "$baseUrl/accounts/my" -Method GET -Headers $userHeaders
    $newAcc = $myAccounts | Where-Object { $_.solde -eq 50000 -and $_.type -eq "SAVINGS" }
    if ($newAcc) {
        Write-Host "✅ Nouveau compte trouvé: $($newAcc.numeroCompte) avec solde $($newAcc.solde)" -ForegroundColor Green
    } else {
        Write-Host "❌ Le compte n'a pas été créé !" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Échec vérification: $_" -ForegroundColor Red
}

# 6. Reject another request (Test Rejection)
Show-Header "6. Test du Rejet d'une demande"
$req2Body = @{
    type = "CURRENT"
    initialDeposit = 1000
    profession = "Test"
    revenusMensuels = 0
    objectifCompte = "Test"
    agenceRattachement = "Lomé Centre"
    personneUrgence = "Test"
    telephoneUrgence = "00"
} | ConvertTo-Json

try {
    $req2Res = Invoke-RestMethod -Uri "$baseUrl/account-requests" -Method POST -Headers $userHeaders -ContentType "application/json" -Body $req2Body
    $req2Id = $req2Res.id
    $rejectBody = @{reason = "Solde initial trop faible"} | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/account-requests/$req2Id/reject" -Method POST -Headers $adminHeaders -ContentType "application/json" -Body $rejectBody
    Write-Host "✅ Demande $req2Id rejetée avec succès" -ForegroundColor Green
    
    # Verify status
    $myReqs = Invoke-RestMethod -Uri "$baseUrl/account-requests/my" -Method GET -Headers $userHeaders
    $stat = ($myReqs | Where-Object { $_.id -eq $req2Id }).status
    Write-Host "✅ Statut final: $stat" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec test rejet demande: $_" -ForegroundColor Red
}
