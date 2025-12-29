import { Component, OnInit } from '@angular/core';
import { ClientService, Client } from '../client.service';
import { AuthService } from '../../auth/auth.service';
import { AccountService, Account } from '../../accounts/account.service';

// Mise à jour : Modal KYC + Boutons Validation/Rejet + Email

@Component({
  selector: 'app-client-list',
  standalone: false,
  template: `
    <div class="animate-fade-in">
      <div class="row mb-5 shadow-sm p-4 bg-white rounded-4 align-items-center">
        <div class="col-md-6">
          <h2 class="mb-1 text-primary fw-bold">Portail d'Administration</h2>
          <p class="text-muted mb-0"></p>
        </div>
        <div class="col-md-6 text-md-end">
          <button (click)="refreshData()" class="btn btn-outline-primary me-2 rounded-pill px-4">
            <i class="fas fa-sync-alt me-2"></i> Actualiser
          </button>
          <div class="badge bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill d-inline-block">
            <i class="fas fa-shield-alt me-2"></i> Mode Supervision
          </div>
        </div>
      </div>

      <!-- Section : En attente de validation (KYC) -->
      <div *ngIf="pendingUsers.length > 0" class="mb-5 animate-slide-up">
        <div class="d-flex align-items-center mb-4">
          <div class="bg-warning bg-opacity-10 p-2 rounded-3 me-3">
            <i class="fas fa-user-check text-warning fa-lg"></i>
          </div>
          <h4 class="mb-0 fw-bold">Inscriptions à valider ({{ pendingUsers.length }})</h4>
        </div>
        
        <div class="row g-4">
          <div *ngFor="let user of pendingUsers" class="col-lg-6">
            <div class="premium-card border-start border-4 border-warning shadow-sm">
              <div class="d-flex justify-content-between">
                <div class="d-flex overflow-hidden">
                  <div class="avatar-md bg-light text-warning rounded-3 d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px; min-width: 60px;">
                    <i class="fas fa-id-card fa-2x"></i>
                  </div>
                  <div class="text-truncate">
                    <div class="fw-bold fs-5 text-dark text-truncate">
                      {{ user.client ? user.client.nom + ' ' + user.client.prenom : user.username }}
                    </div>
                    <div class="small text-muted mb-1 text-truncate">
                      <i class="far fa-envelope me-1"></i> {{ user.client?.email || 'N/A' }}
                    </div>
                    <div class="small text-muted">
                      <i class="fas fa-globe me-1"></i> Nationalité : {{ user.client?.nationalite || 'N/A' }}
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-column gap-2 ms-3">
                  <button (click)="viewKYCDetails(user)" class="btn btn-outline-primary btn-sm px-4 rounded-pill">
                    <i class="fas fa-eye me-1"></i> Voir Détails KYC
                  </button>
                  <button (click)="activateUser(user.username)" class="btn btn-success btn-sm px-4 rounded-pill shadow-sm">
                    <i class="fas fa-check me-1"></i> Valider
                  </button>
                  <button (click)="rejectUser(user.username)" class="btn btn-outline-danger btn-sm px-4 rounded-pill">
                    <i class="fas fa-times me-1"></i> Rejeter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section : Liste Générale -->
      <div class="d-flex align-items-center mb-4">
        <div class="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
          <i class="fas fa-users text-primary fa-lg"></i>
        </div>
        <h4 class="mb-0 fw-bold">Base de données Clients</h4>
      </div>

      <div class="premium-card p-0 overflow-hidden shadow-lg border-0">
        <div class="p-4 bg-light border-bottom d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <div class="input-group w-50 shadow-sm rounded-pill overflow-hidden bg-white">
            <span class="input-group-text bg-white border-0 ps-3"><i class="fas fa-search text-muted"></i></span>
            <input type="text" [(ngModel)]="searchTerm" class="form-control border-0 py-2" placeholder="Rechercher par nom, email ou téléphone...">
          </div>
          <div class="d-flex gap-2">
            <select [(ngModel)]="statusFilter" class="form-select form-select-sm border-0 shadow-sm rounded-pill px-3" style="width: auto;">
              <option value="all">Tous les statuts</option>
              <option value="active">Actif uniquement</option>
              <option value="blocked">Bloqué uniquement</option>
            </select>
            <button (click)="showCreateClientModal = true" class="btn btn-success btn-sm shadow-sm px-4 rounded-pill"><i class="fas fa-user-plus me-2"></i> Créer un Client</button>
            <button routerLink="/accounts/create" class="btn btn-primary btn-sm shadow-sm px-4 rounded-pill"><i class="fas fa-plus-circle me-2"></i> Ouvrir un Compte</button>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="table premium-table mb-0">
            <thead>
              <tr class="bg-light">
                <th class="ps-4">Client / KYC</th>
                <th>Contact & Localisation</th>
                <th>Nationalité & Sexe</th>
                <th>Statut</th>
                <th class="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let client of filteredClients" class="align-middle">
                <td class="ps-4">
                  <div class="d-flex align-items-center">
                    <div class="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3 shadow-inner" style="width: 45px; height: 45px; font-weight: 700; border: 1px solid rgba(13, 110, 253, 0.2);">
                      {{ (client.nom?.charAt(0) || '') }}{{ (client.prenom?.charAt(0) || '') }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ client.nom }} {{ client.prenom }}</div>
                      <div class="small text-muted">ID: <code class="text-primary fw-bold">#CLN-{{ client.id }}</code></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="small text-dark mb-1"><i class="far fa-envelope me-2 text-muted"></i> {{ client.email }}</div>
                  <div class="small text-muted"><i class="fas fa-map-marker-alt me-2"></i> {{ client.adresse }}</div>
                </td>
                <td>
                  <div class="mb-1">
                    <span class="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2">
                      {{ client.nationalite }}
                    </span>
                  </div>
                  <div class="small text-muted">
                    <i class="fas" [class.fa-mars]="client.sexe === 'M'" [class.fa-venus]="client.sexe === 'F'"></i>
                    {{ client.sexe === 'M' ? 'Masculin' : 'Féminin' }}
                  </div>
                </td>
                <td>
                  <span class="badge rounded-pill px-3 py-2" [ngClass]="client.enabled ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                    <i class="fas me-1" [class.fa-check-circle]="client.enabled" [class.fa-ban]="!client.enabled"></i>
                    {{ client.enabled ? 'Actif' : 'Bloqué' }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                    <button (click)="viewClientDetails(client)" class="btn btn-white btn-sm px-3" title="Détails"><i class="fas fa-eye text-primary"></i></button>
                    <button (click)="openEditModal(client)" class="btn btn-white btn-sm px-3" title="Modifier"><i class="fas fa-edit text-warning"></i></button>
                    <button (click)="client.id && toggleClientStatus(client)" class="btn btn-white btn-sm px-3" [title]="client.enabled ? 'Bloquer le client' : 'Débloquer le client'">
                      <i class="fas" [ngClass]="client.enabled ? 'fa-user-check text-success' : 'fa-user-slash text-danger'"></i>
                    </button>
                    <button (click)="client.id && deleteClient(client.id)" class="btn btn-white btn-sm px-3" title="Supprimer (Définitif)"><i class="fas fa-trash text-muted"></i></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredClients.length === 0">
                <td colspan="5" class="text-center py-5">
                  <div class="text-muted py-4">
                    <i class="fas fa-users-slash fa-4x mb-3 opacity-20"></i>
                    <p class="fs-5 mb-0">Aucun client correspondant à votre recherche.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL : Créer un Client (Admin) -->
      <div *ngIf="showCreateClientModal" class="custom-modal-backdrop" (click)="showCreateClientModal = false">
        <div class="custom-modal-content premium-card shadow-lg" style="max-width: 700px;" (click)="$event.stopPropagation()">
          <h4 class="mb-4 text-primary fw-bold"><i class="fas fa-user-plus me-2"></i> Créer un Nouveau Client</h4>
          <form (ngSubmit)="createClient()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold">Nom</label>
                <input [(ngModel)]="newClient.nom" name="nom" class="form-control" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold">Prénom</label>
                <input [(ngModel)]="newClient.prenom" name="prenom" class="form-control" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold">Email</label>
                <input type="email" [(ngModel)]="newClient.email" name="email" class="form-control" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold">Téléphone</label>
                <input [(ngModel)]="newClient.telephone" name="telephone" class="form-control" required>
              </div>
              <div class="col-md-12 mb-3">
                <label class="form-label small fw-bold">Adresse</label>
                <input [(ngModel)]="newClient.adresse" name="adresse" class="form-control" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label small fw-bold">Date de naissance</label>
                <input type="date" [(ngModel)]="newClient.dateNaissance" name="dateNaissance" class="form-control" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label small fw-bold">Sexe</label>
                <select [(ngModel)]="newClient.sexe" name="sexe" class="form-select" required>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label small fw-bold">Nationalité</label>
                <input [(ngModel)]="newClient.nationalite" name="nationalite" class="form-control" required>
              </div>
            </div>
            <div class="d-flex gap-2 mt-3">
              <button type="submit" class="btn btn-success flex-grow-1"><i class="fas fa-check me-2"></i> Créer le client</button>
              <button type="button" (click)="showCreateClientModal = false" class="btn btn-light">Annuler</button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL : Détails KYC pour Validation -->
      <div *ngIf="showKYCModal && selectedUser" class="custom-modal-backdrop" (click)="showKYCModal = false">
        <div class="custom-modal-content premium-card shadow-lg" style="max-width: 800px;" (click)="$event.stopPropagation()">
          <h4 class="mb-4 text-primary fw-bold"><i class="fas fa-clipboard-check me-2"></i> Vérification KYC (Know Your Customer)</h4>
          
          <div class="alert alert-info border-0 mb-4">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Critères de validation :</strong> Vérifiez que toutes les informations sont complètes, cohérentes et conformes aux documents d'identité.
          </div>

          <div class="row g-3">
            <div class="col-12">
              <h5 class="text-secondary mb-3"><i class="fas fa-user me-2"></i> Identité</h5>
            </div>
            <div class="col-md-6">
              <label class="small text-muted">Nom complet</label>
              <div class="fw-bold">{{ selectedUser.client?.nom }} {{ selectedUser.client?.prenom }}</div>
            </div>
            <div class="col-md-3">
              <label class="small text-muted">Date de naissance</label>
              <div class="fw-bold">{{ selectedUser.client?.dateNaissance | date:'dd/MM/yyyy' }}</div>
            </div>
            <div class="col-md-3">
              <label class="small text-muted">Sexe</label>
              <div class="fw-bold">{{ selectedUser.client?.sexe === 'M' ? 'Masculin' : 'Féminin' }}</div>
            </div>

            <div class="col-12 mt-4">
              <h5 class="text-secondary mb-3"><i class="fas fa-address-card me-2"></i> Informations Administratives</h5>
            </div>
            <div class="col-md-6">
              <label class="small text-muted">Nationalité</label>
              <div class="fw-bold">{{ selectedUser.client?.nationalite }}</div>
            </div>
            <div class="col-md-6">
              <label class="small text-muted">Nom d'utilisateur</label>
              <div class="fw-bold">{{ selectedUser.username }}</div>
            </div>

            <div class="col-12 mt-4">
              <h5 class="text-secondary mb-3"><i class="fas fa-map-marker-alt me-2"></i> Contact & Localisation</h5>
            </div>
            <div class="col-md-6">
              <label class="small text-muted">Email</label>
              <div class="fw-bold">{{ selectedUser.client?.email }}</div>
            </div>
            <div class="col-md-6">
              <label class="small text-muted">Téléphone</label>
              <div class="fw-bold">{{ selectedUser.client?.telephone }}</div>
            </div>
            <div class="col-12">
              <label class="small text-muted">Adresse de résidence</label>
              <div class="fw-bold">{{ selectedUser.client?.adresse }}</div>
            </div>

            <div class="col-12 mt-4">
              <div class="card bg-light border-0">
                <div class="card-body">
                  <h6 class="text-warning mb-3"><i class="fas fa-exclamation-triangle me-2"></i> Points de Vérification</h6>
                  <ul class="mb-0 small">
                    <li>✓ Toutes les informations sont-elles complètes ?</li>
                    <li>✓ L'âge est-il supérieur à 18 ans ?</li>
                    <li>✓ L'adresse email est-elle valide ?</li>
                    <li>✓ Le numéro de téléphone est-il au bon format ?</li>
                    <li>✓ Les informations semblent-elles authentiques ?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button (click)="activateUserFromModal()" class="btn btn-success flex-grow-1">
              <i class="fas fa-check me-2"></i> Valider ce compte
            </button>
            <button (click)="rejectUserFromModal()" class="btn btn-danger">
              <i class="fas fa-times me-2"></i> Rejeter
            </button>
            <button (click)="showKYCModal = false" class="btn btn-light">Fermer</button>
          </div>
        </div>
      </div>
      <!-- MODAL : Détails Complets Client + Comptes -->
      <div *ngIf="showDetailsModal && selectedClient" class="custom-modal-backdrop" (click)="showDetailsModal = false">
        <div class="custom-modal-content premium-card shadow-lg" style="max-width: 900px;" (click)="$event.stopPropagation()">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0 text-primary fw-bold"><i class="fas fa-id-card me-2"></i> Fiche Client Détaillée</h4>
            <button class="btn-close" (click)="showDetailsModal = false"></button>
          </div>

          <div class="row g-4">
            <!-- Colonne GAUCHE : Infos Profil -->
            <div class="col-md-5 border-end">
              <div class="text-center mb-4">
                <div class="avatar-lg bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 100px; height: 100px; font-size: 2.5rem; font-weight: 700;">
                  {{ (selectedClient.nom?.charAt(0) || '') }}{{ (selectedClient.prenom?.charAt(0) || '') }}
                </div>
                <h5 class="fw-bold mb-0">{{ selectedClient.nom }} {{ selectedClient.prenom }}</h5>
                <span class="badge rounded-pill mt-2" [ngClass]="selectedClient.enabled ? 'bg-success' : 'bg-danger'">
                  {{ selectedClient.enabled ? 'COMPTE ACTIF' : 'COMPTE BLOQUÉ' }}
                </span>
              </div>

              <div class="bg-light rounded-3 p-3">
                <div class="detail-row mb-2">
                  <div class="small text-muted">ID Système</div>
                  <div class="fw-bold text-primary">#CLN-{{ selectedClient.id }}</div>
                </div>
                <div class="detail-row mb-2">
                  <div class="small text-muted">Email</div>
                  <div class="fw-bold">{{ selectedClient.email }}</div>
                </div>
                <div class="detail-row mb-2">
                  <div class="small text-muted">Téléphone</div>
                  <div class="fw-bold">{{ selectedClient.telephone }}</div>
                </div>
                <div class="detail-row mb-2">
                  <div class="small text-muted">Adresse</div>
                  <div class="fw-bold">{{ selectedClient.adresse }}</div>
                </div>
                <div class="detail-row mb-2">
                  <div class="small text-muted">Nationalité</div>
                  <div class="fw-bold">{{ selectedClient.nationalite }}</div>
                </div>
                <div class="detail-row mb-2">
                  <div class="small text-muted">Date Naissance</div>
                  <div class="fw-bold">{{ selectedClient.dateNaissance | date:'dd/MM/yyyy' }}</div>
                </div>
                <div class="detail-row">
                  <div class="small text-muted">Sexe</div>
                  <div class="fw-bold">{{ selectedClient.sexe === 'M' ? 'Masculin' : 'Féminin' }}</div>
                </div>
              </div>
            </div>

            <!-- Colonne DROITE : Comptes du client -->
            <div class="col-md-7">
              <h5 class="fw-bold mb-3"><i class="fas fa-university me-2 text-primary"></i> Comptes Bancaires ({{ clientAccounts.length }})</h5>
              
              <div *ngIf="clientAccounts.length === 0" class="alert alert-warning py-3">
                <i class="fas fa-exclamation-triangle me-2"></i> Aucun compte bancaire ouvert pour ce client.
              </div>

              <div class="account-list-scrollable" style="max-height: 400px; overflow-y: auto;">
                <div *ngFor="let acc of clientAccounts" class="premium-card mb-3 border-start border-4 shadow-none bg-light bg-opacity-50" [ngClass]="acc.type === 'SAVINGS' ? 'border-info' : 'border-primary'">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge" [ngClass]="acc.type === 'SAVINGS' ? 'bg-info bg-opacity-10 text-info' : 'bg-primary bg-opacity-10 text-primary'">
                      {{ acc.type === 'SAVINGS' ? '💰 ÉPARGNE' : '💳 COURANT' }}
                    </span>
                    <span class="small text-muted">Ouvert le {{ acc.dateCreation | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="fw-bold small mb-1">IBAN</div>
                  <code class="text-dark d-block mb-2">{{ acc.numeroCompte }}</code>
                  <div class="d-flex justify-content-between align-items-end">
                    <div>
                      <div class="small text-muted">Solde disponible</div>
                      <div class="h5 mb-0 fw-bold" [class.text-success]="acc.solde >= 0" [class.text-danger]="acc.solde < 0">
                        {{ acc.solde | number }} FCFA
                      </div>
                    </div>
                    <button [routerLink]="['/accounts']" class="btn btn-sm btn-outline-secondary rounded-pill ps-3 pe-3">Gérer</button>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-top">
                <button routerLink="/accounts/create" [queryParams]="{clientId: selectedClient.id}" class="btn btn-primary w-100 rounded-pill">
                  <i class="fas fa-plus-circle me-2"></i> Ouvrir un nouveau compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL : Modifier les informations (Restrictions Bancaires) -->
      <div *ngIf="showEditModal && editingClient" class="custom-modal-backdrop" (click)="showEditModal = false">
        <div class="custom-modal-content premium-card shadow-lg" style="max-width: 650px;" (click)="$event.stopPropagation()">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0 text-warning fw-bold"><i class="fas fa-edit me-2"></i> Mise à jour des informations</h4>
            <button class="btn-close" (click)="showEditModal = false"></button>
          </div>

          <div class="alert alert-warning border-0 small mb-4">
            <i class="fas fa-shield-alt me-2"></i>
            Conformément aux règles de sécurité bancaire, seuls les champs de contact peuvent être modifiés directement. Pour un changement de nom ou de nationalité, veuillez exiger un nouveau document d'identité.
          </div>

          <form (ngSubmit)="updateClient()">
            <div class="row g-3">
              <!-- CHAMPS LECTURE SEULE -->
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted">Nom (Lecture seule)</label>
                <input [value]="editingClient.nom" class="form-control bg-light" readonly>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-muted">Prénom (Lecture seule)</label>
                <input [value]="editingClient.prenom" class="form-control bg-light" readonly>
              </div>
              
              <hr class="my-4 op-20">

              <!-- CHAMPS MODIFIABLES -->
              <div class="col-md-12">
                <label class="form-label small fw-bold text-primary"><i class="fas fa-map-marker-alt me-2"></i>Adresse de résidence</label>
                <input [(ngModel)]="editingClient.adresse" name="edit_adresse" class="form-control border-primary border-opacity-25" required>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-primary"><i class="fas fa-phone me-2"></i>Téléphone</label>
                <input [(ngModel)]="editingClient.telephone" name="edit_telephone" class="form-control border-primary border-opacity-25" required>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold text-primary"><i class="fas fa-envelope me-2"></i>Email</label>
                <input type="email" [(ngModel)]="editingClient.email" name="edit_email" class="form-control border-primary border-opacity-25" required>
              </div>
            </div>

            <div class="d-flex gap-2 mt-4 pt-3 border-top">
              <button type="submit" class="btn btn-warning flex-grow-1 text-white fw-bold">
                <i class="fas fa-save me-2"></i> Enregistrer les modifications
              </button>
              <button type="button" (click)="showEditModal = false" class="btn btn-light rounded-pill">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .premium-table thead th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6c757d; }
    .btn-white { background: white; border: 1px solid #edf2f9; }
    .btn-white:hover { background: #f8f9fa; }
    .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
    .animate-slide-up { animation: slideUp 0.5s ease-out; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    
    .custom-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      animation: fadeIn 0.2s;
    }
    .custom-modal-content {
      max-height: 90vh;
      overflow-y: auto;
      animation: slideDown 0.3s;
      width: 90%;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  pendingUsers: any[] = [];
  showCreateClientModal = false;

  // Détails Client
  showDetailsModal = false;
  selectedClient: Client | null = null;
  clientAccounts: Account[] = [];

  // Modification Client
  showEditModal = false;
  editingClient: Client | null = null;
  newClient: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    sexe: 'M',
    nationalite: ''
  };

  showKYCModal = false;
  selectedUser: any = null;

  // Recherche et Filtres
  searchTerm: string = '';
  statusFilter: 'all' | 'active' | 'blocked' = 'all';

  get filteredClients(): Client[] {
    return this.clients.filter(c => {
      // Filtre de recherche (Nom, Prénom, Email, Téléphone)
      const search = this.searchTerm.toLowerCase().trim();
      const matchesSearch = !search ||
        (c.nom || '').toLowerCase().includes(search) ||
        (c.prenom || '').toLowerCase().includes(search) ||
        (c.email || '').toLowerCase().includes(search) ||
        (c.telephone || '').toLowerCase().includes(search);

      // Filtre de statut
      const matchesStatus = this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && c.enabled) ||
        (this.statusFilter === 'blocked' && !c.enabled);

      return matchesSearch && matchesStatus;
    });
  }

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.clientService.getAll().subscribe({
      next: (data) => {
        console.log('Clients récupérés:', data);
        this.clients = data;
      },
      error: (err) => {
        console.error('Erreur chargement clients:', err);
        // alert('Erreur API Clients: ' + (err.message || err.statusText)); 
      }
    });

    this.authService.getPendingUsers().subscribe({
      next: (data) => {
        console.log('Utilisateurs en attente:', data);
        this.pendingUsers = data;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs en attente:', err);
      }
    });
  }

  activateUser(username: string) {
    console.log('activateUser called with username:', username);
    if (confirm(`Voulez-vous vraiment valider le compte de l'utilisateur ${username} ?`)) {
      this.authService.activateUser(username).subscribe({
        next: () => {
          alert('Utilisateur validé avec succès !');
          this.refreshData();
        },
        error: (err) => {
          console.error('Error activating user:', err);
          alert('Erreur lors de la validation');
        }
      });
    }
  }

  rejectUser(username: string) {
    console.log('rejectUser called with username:', username);
    const reason = prompt('Motif du rejet (ex: Informations incomplètes, Âge insuffisant, etc.):');

    if (!reason) {
      alert('Veuillez saisir un motif de rejet.');
      return;
    }

    if (confirm(`Voulez-vous vraiment rejeter le compte de l'utilisateur ${username} ?\n\nMotif: ${reason}\n\nUn email sera envoyé automatiquement au client.`)) {
      this.authService.rejectUser(username, reason).subscribe({
        next: (response) => {
          alert(response.message || 'Compte rejeté avec succès ! Un email a été envoyé au client.');
          this.refreshData();
        },
        error: (err) => {
          console.error('Error rejecting user:', err);
          alert('Erreur lors du rejet du compte');
        }
      });
    }
  }

  createClient() {
    this.clientService.create(this.newClient).subscribe({
      next: () => {
        alert('Client créé avec succès !');
        this.showCreateClientModal = false;
        this.newClient = {
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          adresse: '',
          dateNaissance: '',
          sexe: 'M',
          nationalite: ''
        };
        this.refreshData();
      },
      error: (err) => {
        const errMsg = err.error?.message || 'Erreur lors de la création du client';
        alert(errMsg);
      }
    });
  }

  viewKYCDetails(user: any) {
    console.log('Viewing KYC details for:', user);
    this.selectedUser = user;
    this.showKYCModal = true;
  }

  activateUserFromModal() {
    if (this.selectedUser) {
      this.activateUser(this.selectedUser.username);
      this.showKYCModal = false;
    }
  }

  rejectUserFromModal() {
    if (this.selectedUser) {
      this.rejectUser(this.selectedUser.username);
      this.showKYCModal = false;
    }
  }

  toggleClientStatus(client: Client) {
    if (!client.id) return;
    const action = client.enabled ? 'bloquer' : 'débloquer';
    if (confirm(`Voulez-vous vraiment ${action} le client ${client.nom} ${client.prenom} ?`)) {
      this.clientService.toggleStatus(client.id).subscribe({
        next: () => {
          alert(`Client ${action === 'bloquer' ? 'bloqué' : 'débloqué'} avec succès !`);
          this.refreshData();
        },
        error: (err) => alert('Erreur lors du changement de statut')
      });
    }
  }

  deleteClient(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce client ? Cette action est irréversible et peut échouer si le client a des comptes.')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          alert('Client supprimé avec succès !');
          this.refreshData();
        },
        error: (err) => alert('Erreur : Impossible de supprimer ce client (il a probablement des comptes actifs).')
      });
    }
  }

  viewClientDetails(client: Client) {
    this.selectedClient = client;
    this.showDetailsModal = true;
    this.clientAccounts = []; // Reset

    if (client.id) {
      this.accountService.getByClient(client.id).subscribe({
        next: (accounts: Account[]) => {
          this.clientAccounts = accounts;
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des comptes:', err);
        }
      });
    }
  }

  openEditModal(client: Client) {
    // On crée une copie pour ne pas modifier la liste en direct avant validation
    this.editingClient = { ...client };
    this.showEditModal = true;
  }

  updateClient() {
    if (this.editingClient && this.editingClient.id) {
      this.clientService.update(this.editingClient.id, this.editingClient).subscribe({
        next: () => {
          alert('Informations de contact mises à jour avec succès !');
          this.showEditModal = false;
          this.refreshData();
        },
        error: (err) => {
          alert('Erreur lors de la mise à jour : ' + (err.error?.message || 'Serveur indisponible'));
        }
      });
    }
  }
}
