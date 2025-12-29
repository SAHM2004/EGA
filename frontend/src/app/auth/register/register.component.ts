import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  template: `
    <div class="row align-items-center justify-content-center" style="min-height: 90vh;">
      <div class="col-md-10 col-lg-8 col-xl-7">
        <div class="premium-card">
          <div class="text-center mb-5">
            <div class="d-inline-flex align-items-center justify-content-center bg-accent bg-opacity-10 text-accent rounded-circle mb-3" style="width: 64px; height: 64px;">
              <i class="fas fa-university fa-2x"></i>
            </div>
            <h2 class="mb-1 text-primary">Devenir Client EGA BANK</h2>
            <p class="text-muted">Remplissez vos informations pour initier votre demande d'adhésion.</p>
          </div>
          
          <form (ngSubmit)="register()" #registerForm="ngForm">
            <div class="row">
              <!-- Section 1: Informations Personnelles -->
              <div class="col-md-6 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Nom de famille</label>
                <input [(ngModel)]="form.nom" name="nom" class="form-control form-control-premium" placeholder="ex: KOFFI" required>
              </div>
              <div class="col-md-6 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Prénom(s)</label>
                <input [(ngModel)]="form.prenom" name="prenom" class="form-control form-control-premium" placeholder="ex: Jean" required>
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Date de naissance</label>
                <input type="date" [(ngModel)]="form.dateNaissance" name="dateNaissance" class="form-control form-control-premium" required>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Sexe</label>
                <select [(ngModel)]="form.sexe" name="sexe" class="form-select form-control-premium" required>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Nationalité</label>
                <input [(ngModel)]="form.nationalite" name="nationalite" class="form-control form-control-premium" placeholder="ex: Togolaise" required>
              </div>

              <!-- Section 2: Contact -->
              <div class="col-md-6 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Adresse Email</label>
                <input type="email" [(ngModel)]="form.email" name="email" class="form-control form-control-premium" placeholder="jean.koffi@email.com" required>
              </div>
              <div class="col-md-6 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Téléphone</label>
                <input [(ngModel)]="form.telephone" name="telephone" class="form-control form-control-premium" placeholder="+228 XX XX XX XX" required>
              </div>
              <div class="col-12 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Adresse de résidence</label>
                <input [(ngModel)]="form.adresse" name="adresse" class="form-control form-control-premium" placeholder="Quartier, Rue, Ville" required>
              </div>

              <!-- Section 3: Identifiants -->
              <div class="col-12"><hr class="my-4"></div>
              
              <div class="col-md-12 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Identifiant de connexion</label>
                <input [(ngModel)]="form.username" name="username" class="form-control form-control-premium" placeholder="Choisissez un pseudo" required>
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Mot de passe</label>
                <input [(ngModel)]="form.password" name="password" type="password" class="form-control form-control-premium" placeholder="••••••••" required>
              </div>
              <div class="col-md-6 mb-4">
                <label class="form-label fw-bold small text-uppercase text-muted">Confirmer</label>
                <input [(ngModel)]="confirmPassword" name="confirmPassword" type="password" class="form-control form-control-premium" placeholder="••••••••" required>
              </div>
            </div>

            <div class="alert alert-info border-0 shadow-sm small py-3 mt-2">
              <i class="fas fa-info-circle me-2"></i> Conformément à la réglementation, votre demande sera soumise à validation par nos conseillers avant l'activation de vos accès.
            </div>
            
            <button type="submit" class="btn btn-premium w-100 py-3 mt-4 shadow" [disabled]="form.password !== confirmPassword">
              <i class="fas fa-paper-plane me-2"></i> Envoyer ma demande d'adhésion
            </button>
          </form>
          
          <div class="text-center mt-4 border-top pt-4">
            <p class="small text-muted mb-0">Déjà client ? <a routerLink="/login" class="text-primary text-decoration-none fw-bold">Se connecter</a></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = {
    username: '',
    password: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    sexe: 'M',
    nationalite: ''
  };
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    if (this.form.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    this.authService.register(this.form)
      .subscribe({
        next: (response: any) => {
          alert(response.message || 'Votre demande a été envoyée ! Un administrateur va vérifier vos informations KYC sous 24h.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errMsg = err.error?.message || 'Échec de la création du compte';
          alert(errMsg);
          console.error(err);
        }
      });
  }
}
