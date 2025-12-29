import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, Account } from '../account.service';
import { ClientService, Client } from '../../clients/client.service';

// Mise à jour : Formulaire KYC bancaire complet
@Component({
  selector: 'app-account-create',
  standalone: false,
  template: `
    <div class="row justify-content-center animate-fade-in">
      <div class="col-md-10 col-lg-8">
        <div class="premium-card">
          <div class="d-flex align-items-center mb-4">
            <button class="btn btn-light rounded-circle me-3" routerLink="/accounts">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2 class="mb-0">Nouveau Compte Bancaire</h2>
          </div>

          <form (ngSubmit)="onSubmit()" #accountForm="ngForm">
            <!-- Client -->
            <div class="mb-4">
              <label class="form-label fw-bold small text-uppercase text-muted">Client Titulaire</label>
              <select [(ngModel)]="account.clientId" name="clientId" class="form-select form-control-premium py-2" required>
                <option [ngValue]="undefined" disabled selected>Sélectionnez un client</option>
                <option *ngFor="let client of clients" [ngValue]="client.id">
                  {{ client.nom }} {{ client.prenom }} (#{{ client.id }})
                </option>
              </select>
            </div>

            <!-- Type de Compte -->
            <div class="mb-4">
              <label class="form-label fw-bold small text-uppercase text-muted">Type de Compte</label>
              <div class="d-flex gap-3">
                <div class="form-check border rounded p-3 flex-fill" [class.border-primary]="account.type === 'CURRENT'">
                  <input class="form-check-input" type="radio" name="type" [(ngModel)]="account.type" value="CURRENT" id="typeCurrent" required>
                  <label class="form-check-label d-block cursor-pointer" for="typeCurrent">
                    <strong>💳 Compte Courant</strong>
                    <div class="small text-muted">Gestion quotidienne</div>
                  </label>
                </div>
                <div class="form-check border rounded p-3 flex-fill" [class.border-primary]="account.type === 'SAVINGS'">
                  <input class="form-check-input" type="radio" name="type" [(ngModel)]="account.type" value="SAVINGS" id="typeSavings" required>
                  <label class="form-check-label d-block cursor-pointer" for="typeSavings">
                    <strong>💎 Compte Épargne</strong>
                    <div class="small text-muted">Rémunéré à taux fixe</div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Paramètres du Compte -->
            <div class="mb-4 animate-fade-in" *ngIf="account.type === 'CURRENT'">
              <label class="form-label fw-bold small text-uppercase text-muted">Limite de Découvert (FCFA)</label>
              <input type="number" [(ngModel)]="account.decouvert" name="decouvert" class="form-control form-control-premium py-2" placeholder="10000">
            </div>

            <div class="mb-4 animate-fade-in" *ngIf="account.type === 'SAVINGS'">
              <label class="form-label fw-bold small text-uppercase text-muted">Taux d'Intérêt (%)</label>
              <input type="number" [(ngModel)]="account.tauxInteret" name="tauxInteret" class="form-control form-control-premium py-2" placeholder="3.5" step="0.1">
            </div>

            <!-- Séparateur -->
            <hr class="my-4">
            <h5 class="mb-3"><i class="fas fa-briefcase me-2 text-primary"></i> Informations Professionnelles (KYC)</h5>

            <!-- Profession -->
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold small text-uppercase text-muted">Profession</label>
                <select [(ngModel)]="account.profession" name="profession" class="form-select form-control-premium py-2" required>
                  <option value="">Sélectionnez...</option>
                  <option value="Enseignant">Enseignant</option>
                  <option value="Commerçant">Commerçant</option>
                  <option value="Étudiant">Étudiant</option>
                  <option value="Fonctionnaire">Fonctionnaire</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Agriculteur">Agriculteur</option>
                  <option value="Artisan">Artisan</option>
                  <option value="Professionnel libéral">Professionnel libéral</option>
                  <option value="Retraité">Retraité</option>
                  <option value="Sans emploi">Sans emploi</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold small text-uppercase text-muted">Revenus Mensuels (FCFA)</label>
                <input type="number" [(ngModel)]="account.revenusMensuels" name="revenusMensuels" class="form-control form-control-premium py-2" placeholder="250000">
              </div>
            </div>

            <!-- Employeur -->
            <div class="mb-3">
              <label class="form-label fw-bold small text-uppercase text-muted">Employeur / Entreprise</label>
              <input type="text" [(ngModel)]="account.employeur" name="employeur" class="form-control form-control-premium py-2" placeholder="Ex: Ministère de l'Éducation, SAHM Consulting, Indépendant">
            </div>

            <!-- Objectif du Compte -->
            <div class="mb-4">
              <label class="form-label fw-bold small text-uppercase text-muted">Objectif du Compte</label>
              <select [(ngModel)]="account.objectifCompte" name="objectifCompte" class="form-select form-control-premium py-2" required>
                <option value="">Sélectionnez...</option>
                <option value="Compte Salaire">💼 Compte Salaire</option>
                <option value="Compte Commerce">🏪 Compte Commerce</option>
                <option value="Compte Épargne">💎 Compte Épargne</option>
                <option value="Compte Étudiant">🎓 Compte Étudiant</option>
                <option value="Compte Familial">🏠 Compte Familial</option>
                <option value="Compte Projet">🚀 Compte Projet</option>
              </select>
            </div>

            <!-- Séparateur -->
            <hr class="my-4">
            <h5 class="mb-3"><i class="fas fa-building me-2 text-primary"></i> Agence & Contact d'Urgence</h5>

            <!-- Agence -->
            <div class="mb-3">
              <label class="form-label fw-bold small text-uppercase text-muted">Agence de Rattachement</label>
              <select [(ngModel)]="account.agenceRattachement" name="agenceRattachement" class="form-select form-control-premium py-2" required>
                <option value="">Sélectionnez...</option>
                <option value="Lomé Centre">🏦 Lomé Centre</option>
                <option value="Lomé Aéroport">✈️ Lomé Aéroport</option>
                <option value="Kara">🏦 Kara</option>
                <option value="Sokodé">🏦 Sokodé</option>
                <option value="Atakpamé">🏦 Atakpamé</option>
                <option value="Dapaong">🏦 Dapaong</option>
              </select>
            </div>

            <!-- Contact d'Urgence -->
            <div class="row mb-4">
              <div class="col-md-6">
                <label class="form-label fw-bold small text-uppercase text-muted">Personne à Contacter (Urgence)</label>
                <input type="text" [(ngModel)]="account.personneUrgence" name="personneUrgence" class="form-control form-control-premium py-2" placeholder="Ex: KOFFI Marie (Épouse)" required>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold small text-uppercase text-muted">Téléphone d'Urgence</label>
                <input type="tel" [(ngModel)]="account.telephoneUrgence" name="telephoneUrgence" class="form-control form-control-premium py-2" placeholder="+228 90 XX XX XX" required>
              </div>
            </div>

            <!-- Info Solde Initial -->
            <div class="alert alert-success border-0 shadow-sm rounded-4 mb-4">
              <div class="d-flex">
                <i class="fas fa-check-circle mt-1 me-3"></i>
                <div class="small">
                  <strong>Solde initial : 0 FCFA</strong><br>
                  Le compte sera créé avec un solde de 0 FCFA. Le client pourra effectuer un dépôt après l'ouverture du compte.
                </div>
              </div>
            </div>

            <div class="alert alert-info border-0 shadow-sm rounded-4 mb-4">
              <div class="d-flex">
                <i class="fas fa-info-circle mt-1 me-3"></i>
                <div class="small">
                  Le numéro de compte (IBAN) sera généré automatiquement par le système lors de la création.
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-premium w-100 py-3 mt-2 shadow" [disabled]="!accountForm.form.valid">
              <i class="fas fa-check-circle me-2"></i> Confirmer l'ouverture du compte
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AccountCreateComponent implements OnInit {
  account: any = {
    type: 'CURRENT',
    decouvert: 0,
    tauxInteret: 0,
    profession: '',
    revenusMensuels: null,
    employeur: '',
    objectifCompte: '',
    agenceRattachement: '',
    personneUrgence: '',
    telephoneUrgence: ''
  };
  clients: Client[] = [];

  constructor(
    private accountService: AccountService,
    private clientService: ClientService,
    private router: Router
  ) { }

  ngOnInit() {
    this.clientService.getAll().subscribe(data => this.clients = data);
  }

  onSubmit() {
    this.accountService.create(this.account).subscribe({
      next: () => {
        alert('Compte créé avec succès ! Solde initial : 0 FCFA');
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        alert('Erreur lors de la création du compte');
        console.error(err);
      }
    });
  }
}
