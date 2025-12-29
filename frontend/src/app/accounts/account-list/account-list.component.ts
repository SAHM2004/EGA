import { Component, OnInit } from '@angular/core';
import { AccountService, Account } from '../account.service';
import { AuthService } from '../../auth/auth.service';
import { StatementService } from '../../core/statement.service';
import { TransactionService, Transaction } from '../../transactions/transaction.service';

@Component({
  selector: 'app-account-list',
  standalone: false,
  template: `
    <div class="row mb-4 animate-fade-in">
      <div class="col-md-8">
        <h2 class="mb-1">{{ authService.isAdmin() ? 'Supervision des Comptes' : 'Mes Comptes Bancaires' }}</h2>
        <p class="text-muted"></p>
      </div>
      <div class="col-md-4 text-md-end">
        <button *ngIf="authService.isAdmin()" class="btn btn-premium shadow-sm" routerLink="/accounts/create">
          <i class="fas fa-plus-circle me-2"></i> Ouvrir un Compte Directement
        </button>
        <button *ngIf="!authService.isAdmin()" class="btn btn-premium shadow-sm" (click)="showRequestModal = true">
          <i class="fas fa-file-signature me-2"></i> Demander un Nouveau Compte
        </button>
      </div>
    </div>

    <!-- SECTION ADMIN : Demandes d'Ouverture en Attente -->
    <div *ngIf="authService.isAdmin() && pendingRequests.length > 0" class="mb-5 animate-fade-in">
      <div class="d-flex align-items-center mb-3">
        <i class="fas fa-file-invoice-dollar text-warning me-2 fa-lg"></i>
        <h4 class="mb-0">Demandes d'ouverture en attente ({{ pendingRequests.length }})</h4>
      </div>
      <div class="row g-3">
        <div *ngFor="let req of pendingRequests" class="col-md-6">
          <div class="premium-card p-3 border-warning border-opacity-25 bg-warning bg-opacity-10">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="flex-grow-1">
                <div class="fw-bold fs-5 text-dark">{{ req.client?.nom }} {{ req.client?.prenom }}</div>
                <div class="small text-muted mb-2">
                  <i class="far fa-envelope me-1"></i> {{ req.client?.email }}
                </div>
                <div class="small text-muted mb-2">
                  <i class="fas fa-phone me-1"></i> {{ req.client?.telephone }}
                </div>
                <div class="small">
                  <span class="badge" [class.bg-info]="req.requestedType === 'SAVINGS'" [class.bg-primary]="req.requestedType === 'CURRENT'">
                    {{ req.requestedType === 'SAVINGS' ? '✨ Compte Épargne' : '💳 Compte Courant' }}
                  </span>
                  <span class="ms-2 text-muted">
                    <i class="fas fa-calendar me-1"></i> {{ req.requestDate | date:'dd/MM/yyyy' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <button (click)="viewRequestDetails(req)" class="btn btn-sm btn-info rounded-pill px-3 flex-fill">
                <i class="fas fa-eye me-1"></i> Voir Détails
              </button>
              <button (click)="approveRequest(req.id)" class="btn btn-sm btn-success rounded-pill px-3 flex-fill">
                <i class="fas fa-check me-1"></i> Approuver
              </button>
              <button (click)="openRejectModal(req)" class="btn btn-sm btn-outline-danger rounded-pill px-3 flex-fill">
                <i class="fas fa-times me-1"></i> Rejeter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION CLIENT : Mes Demandes en Attente/Rejetées -->
    <div *ngIf="!authService.isAdmin() && pendingRequests.length > 0" class="mb-5 animate-fade-in">
      <div class="d-flex align-items-center mb-3">
        <i class="fas fa-history text-info me-2 fa-lg"></i>
        <h4 class="mb-0">Mes demandes de compte ({{ pendingRequests.length }})</h4>
      </div>
      <div class="row g-3">
        <div *ngFor="let req of pendingRequests" class="col-md-6">
          <div class="premium-card p-3" [class.border-warning]="req.status === 'PENDING'" [class.border-danger]="req.status === 'REJECTED'">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <span class="badge" [class.bg-info]="req.requestedType === 'SAVINGS'" [class.bg-primary]="req.requestedType === 'CURRENT'">
                  {{ req.requestedType === 'SAVINGS' ? '✨ Compte Épargne' : '💳 Compte Courant' }}
                </span>
                <span class="ms-2 badge" [class.bg-warning]="req.status === 'PENDING'" [class.bg-danger]="req.status === 'REJECTED'">
                  {{ req.status === 'PENDING' ? '⏳ EN ATTENTE' : '❌ REJETÉ' }}
                </span>
                <div class="small text-muted mt-2">
                  Demande du {{ req.requestDate | date:'dd/MM/yyyy' }}
                </div>
                <div *ngIf="req.status === 'REJECTED' && req.adminMessage" class="mt-2 alert alert-danger py-2 small mb-0">
                  <strong>Motif du rejet :</strong> {{ req.adminMessage }}
                </div>
              </div>
              <div *ngIf="req.status === 'REJECTED'">
                <button (click)="showRequestModal = true; requestForm.type = req.requestedType" class="btn btn-sm btn-outline-primary rounded-pill">
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LISTE DES COMPTES ACTIFS -->
    <div class="row g-4">
      <div *ngFor="let acc of accounts" class="col-md-6 col-lg-4">
        <div class="premium-card h-100 hover-lift active-shadow">
          <div class="d-flex justify-content-between align-items-start mb-4">
            <div class="rounded-pill px-3 py-1 small fw-bold" [ngClass]="acc.type === 'SAVINGS' ? 'bg-info bg-opacity-10 text-info' : 'bg-primary bg-opacity-10 text-primary'">
              {{ acc.type === 'SAVINGS' ? '✨ ÉPARGNE' : '💳 COURANT' }}
            </div>
            <div class="dropdown">
              <button class="btn btn-light btn-sm rounded-circle" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                <li *ngIf="!authService.isAdmin()"><a class="dropdown-item py-2" [routerLink]="['/transactions']" [queryParams]="{accountId: acc.numeroCompte, type: 'transfer'}"><i class="fas fa-paper-plane me-2 text-primary"></i> Faire un virement</a></li>
                <li><a class="dropdown-item py-2" (click)="acc.numeroCompte && printStatement(acc.numeroCompte)"><i class="fas fa-file-pdf me-2 text-danger"></i> Relevé PDF</a></li>
                <li><a class="dropdown-item py-2" (click)="showHistory(acc)"><i class="fas fa-history me-2 text-success"></i> Voir mouvements</a></li>
              </ul>
            </div>
          </div>

          <div class="mb-4">
            <div class="small text-muted mb-1">IBAN</div>
            <code class="text-dark fw-bold fs-5">{{ acc.numeroCompte }}</code>
          </div>

          <div class="mt-auto pt-3 border-top">
            <div class="small text-muted mb-1">Solde disponible</div>
            <div class="h3 mb-0 fw-bold" [class.text-primary]="acc.solde >= 0" [class.text-danger]="acc.solde < 0">
              {{ acc.solde | number }} <small class="fs-6 fw-normal">FCFA</small>
            </div>
          </div>

          <!-- Boutons d'opérations (clients uniquement) -->
          <div *ngIf="!authService.isAdmin()" class="mt-3">
            <div class="d-grid gap-2">
              <button class="btn btn-success btn-sm" (click)="openDepositModal(acc)">
                <i class="fas fa-plus-circle me-2"></i> Dépôt
              </button>
              <button class="btn btn-warning btn-sm text-white" (click)="openWithdrawModal(acc)">
                <i class="fas fa-minus-circle me-2"></i> Retrait
              </button>
              <button class="btn btn-primary btn-sm" (click)="openTransferModal(acc)">
                <i class="fas fa-exchange-alt me-2"></i> Virement
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="accounts.length === 0" class="col-12 text-center py-5">
        <div class="text-muted">
          <i class="fas fa-folder-open fa-3x mb-3 opacity-20"></i>
          <p>Aucun compte actif trouvé.</p>
        </div>
      </div>
    </div>

    <!-- MODAL : Nouvelle Demande (Client) -->
    <div *ngIf="showRequestModal" class="custom-modal-backdrop" (click)="showRequestModal = false">
      <div class="custom-modal-content premium-card shadow-lg" style="max-width: 700px;" (click)="$event.stopPropagation()">
        <h4 class="mb-4"><i class="fas fa-file-alt me-2 text-primary"></i> Demander l'ouverture d'un compte</h4>
        <form (ngSubmit)="submitAccountRequest()" #requestFormRef="ngForm">
          
          <!-- Type de Compte -->
          <div class="mb-3">
            <label class="form-label fw-bold">Type de Compte</label>
            <div class="d-flex gap-3">
              <div class="form-check border rounded p-3 flex-fill" [class.border-primary]="requestForm.type === 'CURRENT'">
                <input class="form-check-input" type="radio" [(ngModel)]="requestForm.type" value="CURRENT" name="type" id="reqTypeCurrent" required>
                <label class="form-check-label d-block cursor-pointer" for="reqTypeCurrent">
                  <strong>💳 Compte Courant</strong>
                  <div class="small text-muted">Gestion quotidienne</div>
                </label>
              </div>
              <div class="form-check border rounded p-3 flex-fill" [class.border-primary]="requestForm.type === 'SAVINGS'">
                <input class="form-check-input" type="radio" [(ngModel)]="requestForm.type" value="SAVINGS" name="type" id="reqTypeSavings" required>
                <label class="form-check-label d-block cursor-pointer" for="reqTypeSavings">
                  <strong>💎 Compte Épargne</strong>
                  <div class="small text-muted">Rémunéré</div>
                </label>
              </div>
            </div>
          </div>

          <hr class="my-4">
          <h6 class="mb-3"><i class="fas fa-briefcase me-2 text-primary"></i> Informations Professionnelles</h6>

          <!-- Profession et Revenus -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">Profession</label>
              <select [(ngModel)]="requestForm.profession" name="profession" class="form-select" required>
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
              <label class="form-label fw-bold">Revenus Mensuels (FCFA)</label>
              <input type="number" [(ngModel)]="requestForm.revenusMensuels" name="revenusMensuels" class="form-control" placeholder="250000">
            </div>
          </div>

          <!-- Employeur et Objectif -->
          <div class="mb-3">
            <label class="form-label fw-bold">Employeur / Entreprise</label>
            <input type="text" [(ngModel)]="requestForm.employeur" name="employeur" class="form-control" placeholder="Ex: Ministère de l'Éducation">
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Objectif du Compte</label>
            <select [(ngModel)]="requestForm.objectifCompte" name="objectifCompte" class="form-select" required>
              <option value="">Sélectionnez...</option>
              <option value="Compte Salaire">💼 Compte Salaire</option>
              <option value="Compte Commerce">🏪 Compte Commerce</option>
              <option value="Compte Épargne">💎 Compte Épargne</option>
              <option value="Compte Étudiant">🎓 Compte Étudiant</option>
              <option value="Compte Familial">🏠 Compte Familial</option>
              <option value="Compte Projet">🚀 Compte Projet</option>
            </select>
          </div>

          <hr class="my-4">
          <h6 class="mb-3"><i class="fas fa-building me-2 text-primary"></i> Agence & Contact d'Urgence</h6>

          <!-- Agence -->
          <div class="mb-3">
            <label class="form-label fw-bold">Agence de Rattachement</label>
            <select [(ngModel)]="requestForm.agenceRattachement" name="agenceRattachement" class="form-select" required>
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
              <label class="form-label fw-bold">Personne à Contacter (Urgence)</label>
              <input type="text" [(ngModel)]="requestForm.personneUrgence" name="personneUrgence" class="form-control" placeholder="Ex: KOFFI Marie (Épouse)" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Téléphone d'Urgence</label>
              <input type="tel" [(ngModel)]="requestForm.telephoneUrgence" name="telephoneUrgence" class="form-control" placeholder="+228 90 XX XX XX" required>
            </div>
          </div>

          <div class="alert alert-info border-0">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Note :</strong> Votre demande sera examinée par un administrateur. Le solde initial sera de 0 FCFA.
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-premium flex-grow-1" [disabled]="!requestFormRef.form.valid">
              <i class="fas fa-paper-plane me-2"></i> Envoyer la demande
            </button>
            <button type="button" (click)="showRequestModal = false" class="btn btn-light">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL : Historique Spécifique -->
    <div *ngIf="selectedAccount" class="custom-modal-backdrop" (click)="selectedAccount = null">
      <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="mb-0">Mouvements : {{ selectedAccount.numeroCompte }}</h4>
          <button (click)="selectedAccount = null" class="btn-close"></button>
        </div>
        <div class="table-responsive" style="max-height: 400px;">
          <table class="table small">
            <thead>
              <tr><th>Date</th><th>Opération</th><th class="text-end">Montant</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of accountTransactions">
                <td class="small">{{ t.dateOperation | date:'dd/MM/yy HH:mm' }}</td>
                <td>
                  <span class="badge rounded-pill px-3 py-2" [ngClass]="{
                    'bg-success': t.type === 'DEPOSIT',
                    'bg-danger': t.type === 'WITHDRAWAL',
                    'bg-primary': t.type === 'TRANSFER'
                  }">
                    <i class="fas me-1" [ngClass]="{
                      'fa-arrow-down': t.type === 'DEPOSIT',
                      'fa-arrow-up': t.type === 'WITHDRAWAL',
                      'fa-exchange-alt': t.type === 'TRANSFER'
                    }"></i>
                    {{ translateType(t.type) }}
                  </span>
                </td>
                <td class="text-end fw-bold" [class.text-success]="t.type === 'DEPOSIT'" [class.text-danger]="t.type !== 'DEPOSIT'">
                  {{ t.type === 'DEPOSIT' ? '+' : '-' }} {{ t.montant | number }} FCFA
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL : Dépôt -->
    <div *ngIf="showDepositModal" class="custom-modal-backdrop" (click)="showDepositModal = false">
      <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
        <h4 class="mb-4"><i class="fas fa-plus-circle text-success me-2"></i> Faire un Dépôt</h4>
        <form (ngSubmit)="submitDeposit()" #depositForm="ngForm">
          <div class="mb-3">
            <label class="form-label fw-bold">Compte</label>
            <input type="text" class="form-control" [value]="selectedAccount?.numeroCompte" readonly>
            <small class="text-muted">Solde actuel : {{ selectedAccount?.solde | number }} FCFA</small>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Montant à déposer (FCFA)</label>
            <input type="number" [(ngModel)]="depositAmount" name="amount" class="form-control form-control-lg" placeholder="50000" required min="100" autofocus>
          </div>
          <div class="alert alert-info border-0">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Montant minimum :</strong> 100 FCFA
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-secondary flex-fill" (click)="showDepositModal = false">
              <i class="fas fa-times me-2"></i> Annuler
            </button>
            <button type="submit" class="btn btn-success flex-fill" [disabled]="!depositForm.form.valid || depositAmount < 100">
              <i class="fas fa-check me-2"></i> Confirmer le Dépôt
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL : Retrait -->
    <div *ngIf="showWithdrawModal" class="custom-modal-backdrop" (click)="showWithdrawModal = false">
      <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
        <h4 class="mb-4"><i class="fas fa-minus-circle text-warning me-2"></i> Faire un Retrait</h4>
        <form (ngSubmit)="submitWithdraw()" #withdrawForm="ngForm">
          <div class="mb-3">
            <label class="form-label fw-bold">Compte</label>
            <input type="text" class="form-control" [value]="selectedAccount?.numeroCompte" readonly>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Solde disponible</label>
            <div class="h4 text-primary mb-0">{{ selectedAccount?.solde | number }} FCFA</div>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Montant à retirer (FCFA)</label>
            <input type="number" [(ngModel)]="withdrawAmount" name="amount" class="form-control form-control-lg" placeholder="10000" required min="100" [max]="selectedAccount?.solde || 0" autofocus>
          </div>
          <div class="alert alert-warning border-0" *ngIf="withdrawAmount > 0">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Solde après retrait :</strong> {{ (selectedAccount?.solde || 0) - (withdrawAmount || 0) | number }} FCFA
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-secondary flex-fill" (click)="showWithdrawModal = false">
              <i class="fas fa-times me-2"></i> Annuler
            </button>
            <button type="submit" class="btn btn-warning text-white flex-fill" [disabled]="!withdrawForm.form.valid || withdrawAmount > (selectedAccount?.solde || 0)">
              <i class="fas fa-check me-2"></i> Confirmer le Retrait
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL : Virement -->
    <div *ngIf="showTransferModal" class="custom-modal-backdrop" (click)="showTransferModal = false">
      <div class="custom-modal-content premium-card shadow-lg" (click)="$event.stopPropagation()">
        <h4 class="mb-4"><i class="fas fa-exchange-alt text-primary me-2"></i> Faire un Virement</h4>
        <form (ngSubmit)="submitTransfer()" #transferForm="ngForm">
          <div class="mb-3">
            <label class="form-label fw-bold">Compte source</label>
            <input type="text" class="form-control" [value]="selectedAccount?.numeroCompte" readonly>
            <small class="text-muted">Solde disponible : {{ selectedAccount?.solde | number }} FCFA</small>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Compte destinataire (IBAN)</label>
            <input type="text" [(ngModel)]="transferDestination" name="destination" class="form-control form-control-lg" placeholder="TG..." required minlength="10">
            <small class="text-muted">Saisissez l'IBAN du bénéficiaire</small>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Montant (FCFA)</label>
            <input type="number" [(ngModel)]="transferAmount" name="amount" class="form-control form-control-lg" placeholder="5000" required min="100" [max]="selectedAccount?.solde || 0" autofocus>
          </div>
          <div class="alert alert-info border-0">
            <i class="fas fa-info-circle me-2"></i>
            Le virement sera effectué <strong>immédiatement</strong> et de manière <strong>irréversible</strong>.
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-secondary flex-fill" (click)="showTransferModal = false">
              <i class="fas fa-times me-2"></i> Annuler
            </button>
            <button type="submit" class="btn btn-primary flex-fill" [disabled]="!transferForm.form.valid || transferAmount > (selectedAccount?.solde || 0)">
              <i class="fas fa-paper-plane me-2"></i> Envoyer le Virement
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL : Détails de la Demande -->
    <div *ngIf="showRequestDetailsModal && selectedRequest" class="custom-modal-backdrop" (click)="showRequestDetailsModal = false">
      <div class="custom-modal-content premium-card shadow-lg" style="max-width: 700px;" (click)="$event.stopPropagation()">
        <h4 class="mb-4">
          <i class="fas fa-file-invoice text-primary me-2"></i> Détails de la Demande de Compte
        </h4>

        <div class="row">
          <div class="col-12 mb-3">
            <h6 class="text-muted mb-3"><i class="fas fa-user me-2"></i> Informations du Client</h6>
            <div class="bg-light rounded p-3">
              <div class="row">
                <div class="col-md-6 mb-2">
                  <strong>Nom complet :</strong><br>
                  {{ selectedRequest.client?.nom || 'N/A' }} {{ selectedRequest.client?.prenom || '' }}
                </div>
                <div class="col-md-6 mb-2">
                  <strong>Email :</strong><br>
                  {{ selectedRequest.client?.email || 'Non renseigné' }}
                </div>
                <div class="col-md-6 mb-2">
                  <strong>Téléphone :</strong><br>
                  {{ selectedRequest.client?.telephone || 'Non renseigné' }}
                </div>
                <div class="col-md-6 mb-2">
                  <strong>Adresse :</strong><br>
                  {{ selectedRequest.client?.adresse || 'Non renseingée' }}
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 mb-3">
            <h6 class="text-muted mb-3"><i class="fas fa-file-alt me-2"></i> Détails de la Demande</h6>
            <div class="bg-light rounded p-3">
              <div class="row">
                <div class="col-md-6 mb-2">
                  <strong>Type de compte :</strong><br>
                  <span class="badge" [class.bg-info]="selectedRequest.requestedType === 'SAVINGS'" [class.bg-primary]="selectedRequest.requestedType === 'CURRENT'">
                    {{ selectedRequest.requestedType === 'SAVINGS' ? 'Compte Épargne' : 'Compte Courant' }}
                  </span>
                </div>
                <div class="col-md-6 mb-2">
                  <strong>Dépôt initial :</strong><br>
                  {{ selectedRequest.initialDeposit | number }} FCFA
                </div>
                <div class="col-md-6 mb-2">
                  <strong>Date de demande :</strong><br>
                  {{ selectedRequest.requestDate | date:'dd/MM/yyyy HH:mm' }}
                </div>
                <div class="col-md-6 mb-2">
                  <strong>Statut :</strong><br>
                  <span class="badge bg-warning">EN ATTENTE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex gap-2 mt-4">
          <button type="button" class="btn btn-secondary flex-fill" (click)="showRequestDetailsModal = false">
            <i class="fas fa-times me-2"></i> Fermer
          </button>
          <button type="button" class="btn btn-success flex-fill" (click)="approveRequest(selectedRequest.id)">
            <i class="fas fa-check me-2"></i> Approuver
          </button>
          <button type="button" class="btn btn-danger flex-fill" (click)="openRejectModal(selectedRequest)">
            <i class="fas fa-ban me-2"></i> Rejeter
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL : Rejet de Demande -->
    <div *ngIf="showRejectModal && selectedRequest" class="custom-modal-backdrop" (click)="showRejectModal = false">
      <div class="custom-modal-content premium-card shadow-lg" style="max-width: 600px;" (click)="$event.stopPropagation()">
        <h4 class="mb-4">
          <i class="fas fa-ban text-danger me-2"></i> Rejeter la Demande
        </h4>

        <div class="alert alert-warning border-0">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <strong>Attention :</strong> Le client recevra un email avec le motif du rejet.
        </div>

        <div class="mb-3">
          <p class="mb-2"><strong>Client :</strong> {{ selectedRequest.client?.nom }} {{ selectedRequest.client?.prenom }}</p>
          <p class="mb-2"><strong>Type :</strong> {{ selectedRequest.requestedType === 'SAVINGS' ? 'Compte Épargne' : 'Compte Courant' }}</p>
        </div>

        <form (ngSubmit)="submitRejection()" #rejectForm="ngForm">
          <div class="mb-4">
            <label class="form-label fw-bold">Motif du rejet *</label>
            <select [(ngModel)]="rejectionReason" name="rejectionReason" class="form-select mb-2" required>
              <option value="">Sélectionnez un motif...</option>
              <option value="Documents d'identité incomplets ou invalides">Documents d'identité incomplets ou invalides</option>
              <option value="Informations KYC insuffisantes">Informations KYC insuffisantes</option>
              <option value="Revenus insuffisants pour le type de compte demandé">Revenus insuffisants pour le type de compte demandé</option>
              <option value="Adresse non vérifiable">Adresse non vérifiable</option>
              <option value="Client déjà enregistré dans le système">Client déjà enregistré dans le système</option>
              <option value="AUTRE">Autre (précisez ci-dessous)</option>
            </select>
            
            <textarea 
              *ngIf="rejectionReason === 'AUTRE'"
              [(ngModel)]="customRejectionReason" 
              name="customRejectionReason" 
              class="form-control" 
              rows="4" 
              placeholder="Précisez le motif du rejet..."
              required>
            </textarea>
          </div>

          <div class="d-flex gap-2">
            <button type="button" class="btn btn-secondary flex-fill" (click)="showRejectModal = false">
              <i class="fas fa-times me-2"></i> Annuler
            </button>
            <button type="submit" class="btn btn-danger flex-fill" [disabled]="!rejectForm.form.valid">
              <i class="fas fa-paper-plane me-2"></i> Confirmer le Rejet
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .hover-lift:hover { transform: translateY(-5px); transition: 0.3s; }
    .custom-modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1050; backdrop-filter: blur(4px);
    }
    .custom-modal-content { width: 90%; max-width: 500px; background: white; padding: 2rem; border-radius: 1.5rem; }
  `]
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  pendingRequests: any[] = [];
  showRequestModal = false;
  selectedAccount: Account | null = null;
  accountTransactions: Transaction[] = [];

  requestForm = {
    type: 'CURRENT',
    initialDeposit: 0,
    profession: '',
    revenusMensuels: null as number | null,
    employeur: '',
    objectifCompte: '',
    agenceRattachement: '',
    personneUrgence: '',
    telephoneUrgence: '',
    decouvert: 0,
    tauxInteret: 0
  };

  // Modals d'opérations bancaires
  showDepositModal = false;
  showWithdrawModal = false;
  showTransferModal = false;

  // Gestion des demandes de compte
  selectedRequest: any = null;
  showRequestDetailsModal = false;
  showRejectModal = false;
  rejectionReason = '';
  customRejectionReason = '';

  // Formulaires d'opérations
  depositAmount: number = 0;
  withdrawAmount: number = 0;
  transferAmount: number = 0;
  transferDestination: string = '';

  constructor(
    private accountService: AccountService,
    public authService: AuthService,
    private statementService: StatementService,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    const obs = this.authService.isAdmin() ? this.accountService.getAll() : this.accountService.getMyAccounts();
    obs.subscribe({
      next: (data) => {
        console.log('Comptes récupérés:', data);
        this.accounts = data;
      },
      error: (err) => {
        console.error('Erreur chargement comptes:', err);
        // alert('Erreur API Comptes: ' + (err.message || err.statusText));
      }
    });

    // Fetch requests for both admin (all pending) and client (their own)
    if (this.authService.isAdmin()) {
      this.accountService.getPendingRequests().subscribe({
        next: (data) => this.pendingRequests = data,
        error: (err) => console.error('Erreur chargement demandes:', err)
      });
    } else {
      this.accountService.getMyRequests().subscribe({
        next: (data) => {
          // Pour les clients, on n'affiche que les demandes en attente ou rejetées
          this.pendingRequests = data.filter(r => r.status === 'PENDING' || r.status === 'REJECTED');
        },
        error: (err) => console.error('Erreur chargement demandes client:', err)
      });
    }
  }

  submitAccountRequest() {
    this.accountService.submitRequest(this.requestForm).subscribe({
      next: () => {
        alert('Votre demande d\'ouverture de compte a été envoyée avec succès ! Un administrateur va l\'examiner.');
        this.showRequestModal = false;
        this.refreshData();
      },
      error: (err) => alert('Erreur lors de la demande')
    });
  }

  printStatement(accountNumber: string) {
    this.statementService.downloadStatement(accountNumber).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `releve-${accountNumber}.pdf`;
      a.click();
    });
  }

  showHistory(acc: Account) {
    if (!acc.numeroCompte) return;
    this.selectedAccount = acc;
    this.transactionService.getAccountHistory(acc.numeroCompte).subscribe({
      next: (data) => {
        console.log('Transactions history received:', data);
        this.accountTransactions = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'historique', err);
        this.accountTransactions = [];
      }
    });
  }

  translateType(type: string): string {
    if (!type) return 'N/A';
    const t = type.toUpperCase();
    switch (t) {
      case 'DEPOSIT': return 'Versement';
      case 'WITHDRAWAL': return 'Retrait';
      case 'TRANSFER': return 'Virement';
      default: return type;
    }
  }

  // Méthodes pour les opérations bancaires
  openDepositModal(account: Account) {
    this.selectedAccount = account;
    this.depositAmount = 0;
    this.showDepositModal = true;
  }

  openWithdrawModal(account: Account) {
    this.selectedAccount = account;
    this.withdrawAmount = 0;
    this.showWithdrawModal = true;
  }

  openTransferModal(account: Account) {
    this.selectedAccount = account;
    this.transferAmount = 0;
    this.transferDestination = '';
    this.showTransferModal = true;
  }

  submitDeposit() {
    if (this.selectedAccount && this.depositAmount > 0) {
      this.transactionService.deposit(this.selectedAccount!.numeroCompte!, this.depositAmount).subscribe({
        next: () => {
          alert(`Dépôt de ${this.depositAmount.toLocaleString()} FCFA effectué avec succès !`);
          this.showDepositModal = false;
          this.refreshData();
        },
        error: (err) => {
          alert('Erreur lors du dépôt : ' + (err.error?.message || 'Erreur inconnue'));
          console.error(err);
        }
      });
    }
  }

  submitWithdraw() {
    if (this.selectedAccount && this.withdrawAmount > 0) {
      if (this.withdrawAmount > this.selectedAccount.solde) {
        alert('Solde insuffisant !');
        return;
      }
      this.transactionService.withdraw(this.selectedAccount!.numeroCompte!, this.withdrawAmount).subscribe({
        next: () => {
          alert(`Retrait de ${this.withdrawAmount.toLocaleString()} FCFA effectué avec succès !`);
          this.showWithdrawModal = false;
          this.refreshData();
        },
        error: (err) => {
          alert('Erreur lors du retrait : ' + (err.error?.message || 'Solde insuffisant'));
          console.error(err);
        }
      });
    }
  }

  submitTransfer() {
    if (this.selectedAccount && this.transferAmount > 0 && this.transferDestination) {
      if (this.transferAmount > this.selectedAccount.solde) {
        alert('Solde insuffisant !');
        return;
      }
      const request = {
        sourceAccountId: this.selectedAccount!.numeroCompte!,
        destinationAccountId: this.transferDestination,
        amount: this.transferAmount
      };
      this.transactionService.transfer(request).subscribe({
        next: () => {
          alert(`Virement de ${this.transferAmount.toLocaleString()} FCFA effectué avec succès !`);
          this.showTransferModal = false;
          this.refreshData();
        },
        error: (err) => {
          alert('Erreur lors du virement : ' + (err.error?.message || 'Compte destinataire introuvable'));
          console.error(err);
        }
      });
    }
  }

  // ========================================
  // Gestion des Demandes de Compte
  // ========================================

  viewRequestDetails(request: any) {
    this.selectedRequest = request;
    this.showRequestDetailsModal = true;
  }

  approveRequest(requestId: number) {
    if (confirm('Êtes-vous sûr de vouloir approuver cette demande de compte ?')) {
      this.accountService.approveRequest(requestId).subscribe({
        next: () => {
          alert('✅ Demande approuvée avec succès ! Un email a été envoyé au client avec son IBAN.');
          this.refreshData();
          this.showRequestDetailsModal = false;
        },
        error: (err) => {
          alert('❌ Erreur lors de l\'approbation : ' + (err.error?.message || 'Erreur inconnue'));
        }
      });
    }
  }

  openRejectModal(request: any) {
    this.selectedRequest = request;
    this.rejectionReason = '';
    this.customRejectionReason = '';
    this.showRejectModal = true;
    this.showRequestDetailsModal = false;
  }

  submitRejection() {
    const finalReason = this.rejectionReason === 'AUTRE' ? this.customRejectionReason : this.rejectionReason;

    if (!finalReason || finalReason.trim() === '') {
      alert('⚠️ Veuillez saisir un motif de rejet');
      return;
    }

    this.accountService.rejectRequest(this.selectedRequest.id, finalReason).subscribe({
      next: () => {
        alert('✅ Demande rejetée. Un email a été envoyé au client avec le motif.');
        this.refreshData();
        this.showRejectModal = false;
        this.showRequestDetailsModal = false;
      },
      error: (err) => {
        alert('❌ Erreur lors du rejet : ' + (err.error?.message || 'Erreur inconnue'));
      }
    });
  }
}
