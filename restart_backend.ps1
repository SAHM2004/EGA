# ========================================
# Script de Redemarrage du Backend EGA BANK
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  REDEMARRAGE DU BACKEND EGA BANK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Etape 1 : Arreter tous les processus Java/Maven
Write-Host "Etape 1/3 : Arret de tous les backends en cours..." -ForegroundColor Yellow
Write-Host ""

try {
    $javaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue
    
    if ($javaProcesses) {
        Write-Host "  Processus Java trouves : $($javaProcesses.Count)" -ForegroundColor Gray
        $javaProcesses | Stop-Process -Force
        Write-Host "  OK Tous les processus Java ont ete arretes" -ForegroundColor Green
    } else {
        Write-Host "  INFO Aucun processus Java en cours" -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds 3
    Write-Host ""
}
catch {
    Write-Host "  ATTENTION Erreur lors de l'arret" -ForegroundColor Yellow
    Write-Host ""
}

# Etape 2 : Nettoyer le port 8080
Write-Host "Etape 2/3 : Verification du port 8080..." -ForegroundColor Yellow
Write-Host ""

try {
    $port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    
    if ($port8080) {
        Write-Host "  ATTENTION Le port 8080 est encore utilise, nettoyage..." -ForegroundColor Yellow
        $processId = $port8080.OwningProcess
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "  OK Port 8080 libere" -ForegroundColor Green
    } else {
        Write-Host "  OK Port 8080 disponible" -ForegroundColor Green
    }
    Write-Host ""
}
catch {
    Write-Host "  INFO Port 8080 OK" -ForegroundColor Gray
    Write-Host ""
}

# Etape 3 : Redemarrer le backend
Write-Host "Etape 3/3 : Demarrage du backend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Dossier : c:\Users\user\Desktop\SAHM\Projet_springBoot\Ega\backend" -ForegroundColor Gray
Write-Host "  Commande : mvn spring-boot:run" -ForegroundColor Gray
Write-Host ""
Write-Host "  Demarrage en cours... (30-60 secondes)" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ATTENDEZ LE MESSAGE :" -ForegroundColor Cyan
Write-Host "  Started BankApplication in X seconds" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "c:\Users\user\Desktop\SAHM\Projet_springBoot\Ega\backend"
mvn spring-boot:run
