import { Component, OnInit } from '@angular/core';
import { AccountService, Account } from '../../accounts/account.service';
import { TransactionService, TransferRequest, Transaction } from '../transaction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-transaction-form',
  standalone: false,
  template: `
    <div class="animate-fade-in">
      <!-- Vue Administrateur : Historique Global -->
      <div *ngIf="authService.isAdmin()">
        <div class="row mb-4">
          <div class="col-md-8">
            <h2 class="mb-1">Historique Global des Transactions</h2>
            <p class="text-muted">Consultez l'ensemble des mouvements effectués sur tous les comptes de la banque.</p>
          </div>
          <div class="col-md-4 text-md-end">
            <button class="btn btn-light border shadow-sm" (click)="loadHistory()">
              <i class="fas fa-sync-alt me-2"></i> Actualiser
            </button>
          </div>
        </div>

        <div class="premium-card p-0 overflow-hidden shadow-sm">
          <div class="table-responsive">
            <table class="table premium-table mb-0">
              <thead>
                <tr>
                  <th>Date & Heure</th>
                  <th>Compte</th>
                  <th>Opération</th>
                  <th class="text-end">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of history" class="align-middle">
                  <td class="small text-muted">{{ t.dateOperation | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td><code class="fw-bold">{{ t.accountId }}</code></td>
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
                  <td class="text-end fw-bold" [class.text-danger]="t.type === 'WITHDRAWAL'" [class.text-success]="t.type === 'DEPOSIT'">
                    {{ t.type === 'WITHDRAWAL' ? '-' : '+' }} {{ t.montant | number }} FCFA
                  </td>
                </tr>
                <tr *ngIf="history.length === 0">
                  <td colspan="4" class="text-center py-5 text-muted">Aucune transaction trouvée.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Vue Client : Formulaires d'Opérations -->
      <div *ngIf="!authService.isAdmin()" class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="premium-card">
            <h2 class="mb-4 text-center">Effectuer une Opération</h2>
            
            <!-- Onglets -->
            <ul class="nav nav-pills nav-fill mb-4 bg-light rounded-pill p-1 shadow-sm">
              <li class="nav-item">
                <button class="nav-link rounded-pill" [class.active]="activeTab === 'deposit'" (click)="activeTab = 'deposit'">
                  <i class="fas fa-plus-circle me-2"></i> Dépôt
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link rounded-pill" [class.active]="activeTab === 'withdraw'" (click)="activeTab = 'withdraw'">
                  <i class="fas fa-minus-circle me-2"></i> Retrait
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link rounded-pill" [class.active]="activeTab === 'transfer'" (click)="activeTab = 'transfer'">
                  <i class="fas fa-exchange-alt me-2"></i> Virement
                </button>
              </li>
            </ul>

            <!-- Formulaire Dépôt -->
            <form *ngIf="activeTab === 'deposit'" (ngSubmit)="onDepositSubmit()" #depositForm="ngForm">
              <div class="mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Compte à Créditer</label>
                <select [(ngModel)]="depositAccountId" name="depositAccountId" class="form-select form-control-premium py-2" required>
                  <option [ngValue]="undefined" disabled selected>Sélectionnez un compte</option>
                  <option *ngFor="let acc of accounts" [ngValue]="acc.numeroCompte">
                    {{ acc.numeroCompte }} - {{ acc.solde | number }} FCFA
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Montant du Dépôt (FCFA)</label>
                <div class="input-group shadow-sm rounded-3">
                  <span class="input-group-text bg-white"><i class="fas fa-money-bill-wave text-success"></i></span>
                  <input type="number" [(ngModel)]="depositAmount" name="depositAmount" class="form-control form-control-premium py-2" placeholder="50000" required min="100">
                </div>
                <small class="text-muted">Montant minimum : 100 FCFA</small>
              </div>

              <button type="submit" class="btn btn-success w-100 py-3 shadow mt-3 rounded-pill" [disabled]="!depositForm.form.valid">
                <i class="fas fa-check-circle me-2"></i> Effectuer le Dépôt
              </button>
            </form>

            <!-- Formulaire Retrait -->
            <form *ngIf="activeTab === 'withdraw'" (ngSubmit)="onWithdrawSubmit()" #withdrawForm="ngForm">
              <div class="mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Compte à Débiter</label>
                <select [(ngModel)]="withdrawAccountId" name="withdrawAccountId" class="form-select form-control-premium py-2" required (ngModelChange)="onWithdrawAccountChange()">
                  <option [ngValue]="undefined" disabled selected>Sélectionnez un compte</option>
                  <option *ngFor="let acc of accounts" [ngValue]="acc.numeroCompte">
                    {{ acc.numeroCompte }} - {{ acc.solde | number }} FCFA
                  </option>
                </select>
              </div>

              <div class="alert alert-info border-0" *ngIf="selectedWithdrawAccount">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Solde disponible :</strong> {{ selectedWithdrawAccount.solde | number }} FCFA
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Montant du Retrait (FCFA)</label>
                <div class="input-group shadow-sm rounded-3">
                  <span class="input-group-text bg-white"><i class="fas fa-money-bill-wave text-warning"></i></span>
                  <input type="number" [(ngModel)]="withdrawAmount" name="withdrawAmount" class="form-control form-control-premium py-2" placeholder="10000" required min="100" [max]="selectedWithdrawAccount?.solde || 0">
                </div>
                <small class="text-muted">Montant minimum : 100 FCFA</small>
              </div>

              <div class="alert alert-warning border-0" *ngIf="withdrawAmount > 0 && selectedWithdrawAccount">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Solde après retrait :</strong> {{ (selectedWithdrawAccount.solde - withdrawAmount) | number }} FCFA
              </div>

              <button type="submit" class="btn btn-warning text-white w-100 py-3 shadow mt-3 rounded-pill" [disabled]="!withdrawForm.form.valid || withdrawAmount > (selectedWithdrawAccount?.solde || 0)">
                <i class="fas fa-check-circle me-2"></i> Effectuer le Retrait
              </button>
            </form>

            <!-- Formulaire Virement -->
            <form *ngIf="activeTab === 'transfer'" (ngSubmit)="onTransferSubmit()" #transferForm="ngForm">
              <div class="mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Compte Source</label>
                <select [(ngModel)]="transferRequest.sourceAccountId" name="sourceAccountId" class="form-select form-control-premium py-2" required>
                  <option [ngValue]="undefined" disabled selected>Compte à débiter</option>
                  <option *ngFor="let acc of accounts" [ngValue]="acc.numeroCompte">
                    {{ acc.numeroCompte }} - {{ acc.solde | number }} FCFA
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Compte Destination (IBAN)</label>
                <div class="input-group shadow-sm rounded-3">
                  <span class="input-group-text bg-white"><i class="fas fa-university text-muted"></i></span>
                  <input type="text" [(ngModel)]="transferRequest.destinationAccountId" name="destinationAccountId" 
                         class="form-control form-control-premium py-2" placeholder="Saisissez l'IBAN du destinataire" required>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Montant du Virement (FCFA)</label>
                <div class="input-group shadow-sm rounded-3">
                  <span class="input-group-text bg-white"><i class="fas fa-money-bill-wave text-primary"></i></span>
                  <input type="number" [(ngModel)]="transferRequest.amount" name="amount" class="form-control form-control-premium py-2" placeholder="5000" required min="100">
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-3 shadow mt-3 rounded-pill" [disabled]="!transferForm.form.valid">
                <i class="fas fa-paper-plane me-2"></i> Exécuter le virement
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TransactionFormComponent implements OnInit {
  accounts: Account[] = [];
  history: Transaction[] = [];
  activeTab: 'deposit' | 'withdraw' | 'transfer' = 'deposit';

  // Dépôt
  depositAccountId: string | undefined;
  depositAmount: number = 0;

  // Retrait
  withdrawAccountId: string | undefined;
  withdrawAmount: number = 0;
  selectedWithdrawAccount: Account | undefined;

  // Virement
  transferRequest: TransferRequest = {
    sourceAccountId: '',
    destinationAccountId: '',
    amount: 0
  };

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.isAdmin()) {
      this.loadHistory();
    } else {
      this.accountService.getMyAccounts().subscribe(data => {
        this.accounts = data;
        this.route.queryParams.subscribe(params => {
          if (params['accountId']) {
            this.transferRequest.sourceAccountId = params['accountId'];
          }
          if (params['type']) {
            this.activeTab = params['type'];
          }
        });
      });
    }
  }

  loadHistory() {
    this.transactionService.getAllHistory().subscribe(data => this.history = data);
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

  onWithdrawAccountChange() {
    this.selectedWithdrawAccount = this.accounts.find(acc => acc.numeroCompte === this.withdrawAccountId);
  }

  onDepositSubmit() {
    if (this.depositAccountId && this.depositAmount > 0) {
      this.transactionService.deposit(this.depositAccountId, this.depositAmount).subscribe({
        next: () => {
          alert(`Dépôt de ${this.depositAmount.toLocaleString()} FCFA effectué avec succès !`);
          this.router.navigate(['/accounts']);
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || 'Échec du dépôt'))
      });
    }
  }

  onWithdrawSubmit() {
    if (this.withdrawAccountId && this.withdrawAmount > 0) {
      this.transactionService.withdraw(this.withdrawAccountId, this.withdrawAmount).subscribe({
        next: () => {
          alert(`Retrait de ${this.withdrawAmount.toLocaleString()} FCFA effectué avec succès !`);
          this.router.navigate(['/accounts']);
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || 'Solde insuffisant'))
      });
    }
  }

  onTransferSubmit() {
    this.transactionService.transfer(this.transferRequest).subscribe({
      next: () => {
        alert('Virement effectué avec succès !');
        this.router.navigate(['/accounts']);
      },
      error: (err) => alert('Erreur: ' + (err.error?.message || 'Echec du virement'))
    });
  }
}
