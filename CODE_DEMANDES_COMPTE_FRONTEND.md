# Code à Ajouter pour la Gestion des Demandes de Compte

## 1. Variables TypeScript à Ajouter

```typescript
// Gestion des demandes de compte
pendingRequests: any[] = [];
selectedRequest: any = null;
showRequestDetailsModal = false;
showRejectModal = false;
rejectionReason = '';
```

## 2. Dans ngOnInit() - Charger les demandes

```typescript
ngOnInit() {
  this.refreshData();
}
```

## 3. Dans refreshData() - Ajouter le chargement des demandes

```typescript
refreshData() {
  const obs = this.authService.isAdmin() ? this.accountService.getAll() : this.accountService.getMyAccounts();
  obs.subscribe(data => this.accounts = data);

  // Charger les demandes en attente pour l'admin
  if (this.authService.isAdmin()) {
    this.accountService.getPendingRequests().subscribe(data => this.pendingRequests = data);
  }
}
```

## 4. Nouvelles Méthodes TypeScript

```typescript
// Voir les détails d'une demande
viewRequestDetails(request: any) {
  this.selectedRequest = request;
  this.showRequestDetailsModal = true;
}

// Approuver une demande
approveRequest(requestId: number) {
  if (confirm('Êtes-vous sûr de vouloir approuver cette demande de compte ?')) {
    this.accountService.approveRequest(requestId).subscribe({
      next: () => {
        alert('Demande approuvée avec succès ! Un email a été envoyé au client.');
        this.refreshData();
        this.showRequestDetailsModal = false;
      },
      error: (err) => {
        alert('Erreur lors de l\'approbation : ' + (err.error?.message || 'Erreur inconnue'));
      }
    });
  }
}

// Ouvrir le modal de rejet
openRejectModal(request: any) {
  this.selectedRequest = request;
  this.rejectionReason = '';
  this.showRejectModal = true;
}

// Rejeter une demande avec motif
submitRejection() {
  if (!this.rejectionReason || this.rejectionReason.trim() === '') {
    alert('Veuillez saisir un motif de rejet');
    return;
  }

  this.accountService.rejectRequest(this.selectedRequest.id, this.rejectionReason).subscribe({
    next: () => {
      alert('Demande rejetée. Un email a été envoyé au client avec le motif.');
      this.refreshData();
      this.showRejectModal = false;
      this.showRequestDetailsModal = false;
    },
    error: (err) => {
      alert('Erreur lors du rejet : ' + (err.error?.message || 'Erreur inconnue'));
    }
  });
}
```

## 5. HTML - Modifier les Boutons (Lignes 43-46)

```html
<div class="d-flex gap-2">
  <button (click)="viewRequestDetails(req)" class="btn btn-sm btn-info rounded-pill px-3">
    <i class="fas fa-eye me-1"></i> Voir
  </button>
  <button (click)="approveRequest(req.id)" class="btn btn-sm btn-success rounded-pill px-3">
    <i class="fas fa-check me-1"></i> Approuver
  </button>
  <button (click)="openRejectModal(req)" class="btn btn-sm btn-outline-danger rounded-pill px-3">
    <i class="fas fa-times me-1"></i> Rejeter
  </button>
</div>
```

## 6. HTML - Modal Détails (À Ajouter Avant la Fin du Template)

```html
<!-- MODAL : Détails de la Demande -->
<div *ngIf="showRequestDetailsModal && selectedRequest" class="custom-modal-backdrop" (click)="showRequestDetailsModal = false">
  <div class="custom-modal-content premium-card shadow-lg" style="max-width: 700px;" (click)="$event.stopPropagation()">
    <h4 class="mb-4">
      <i class="fas fa-file-invoice text-primary me-2"></i> Détails de la Demande de Compte
    </h4>

    <div class="row">
      <!-- Informations Client -->
      <div class="col-12 mb-3">
        <h6 class="text-muted mb-3"><i class="fas fa-user me-2"></i> Informations du Client</h6>
        <div class="bg-light rounded p-3">
          <div class="row">
            <div class="col-md-6 mb-2">
              <strong>Nom complet :</strong><br>
              {{ selectedRequest.client.nom }} {{ selectedRequest.client.prenom }}
            </div>
            <div class="col-md-6 mb-2">
              <strong>Email :</strong><br>
              {{ selectedRequest.client.email }}
            </div>
            <div class="col-md-6 mb-2">
              <strong>Téléphone :</strong><br>
              {{ selectedRequest.client.telephone }}
            </div>
            <div class="col-md-6 mb-2">
              <strong>Adresse :</strong><br>
              {{ selectedRequest.client.adresse }}
            </div>
          </div>
        </div>
      </div>

      <!-- Détails de la Demande -->
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
      <p class="mb-2"><strong>Client :</strong> {{ selectedRequest.client.nom }} {{ selectedRequest.client.prenom }}</p>
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
          *ngIf="rejectionReason === 'AUTRE' || (rejectionReason && rejectionReason !== '')"
          [(ngModel)]="rejectionReason" 
          name="rejectionReasonText" 
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
```

## 7. AccountService - Ajouter les Méthodes

```typescript
// Dans account.service.ts

approveRequest(requestId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/account-requests/${requestId}/approve`, {});
}

rejectRequest(requestId: number, reason: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/account-requests/${requestId}/reject`, { reason });
}

getPendingRequests(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/account-requests/pending`);
}
```

---

**Instructions :**
1. Ajoutez les variables dans la classe TypeScript
2. Modifiez `refreshData()` pour charger les demandes
3. Ajoutez les nouvelles méthodes
4. Modifiez les boutons HTML
5. Ajoutez les 2 modals avant la fin du template
6. Ajoutez les 3 méthodes dans `AccountService`
