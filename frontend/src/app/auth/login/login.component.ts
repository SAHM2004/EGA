import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="row align-items-center justify-content-center" style="min-height: 80vh;">
      <div class="col-md-5 col-lg-4">
        <div class="premium-card">
          <div class="text-center mb-5">
            <div class="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style="width: 64px; height: 64px;">
              <i class="fas fa-university fa-2x"></i>
            </div>
            <h2 class="mb-1">EGA BANK</h2>
            <p class="text-muted small">Espace bancaire sécurisé</p>
          </div>
          
          <form (ngSubmit)="login()" #loginForm="ngForm">
            <div class="mb-4">
              <label class="form-label fw-bold small text-uppercase text-muted">Identifiant</label>
              <div class="input-group shadow-sm rounded-3 overflow-hidden">
                <span class="input-group-text bg-white border-end-0">
                  <i class="fas fa-user text-muted"></i>
                </span>
                <input [(ngModel)]="username" name="username" class="form-control form-control-premium border-start-0 py-2" placeholder="Nom d'utilisateur" required>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label fw-bold small text-uppercase text-muted">Mot de passe</label>
              <div class="input-group shadow-sm rounded-3 overflow-hidden">
                <span class="input-group-text bg-white border-end-0">
                  <i class="fas fa-lock text-muted"></i>
                </span>
                <input [(ngModel)]="password" name="password" type="password" class="form-control form-control-premium border-start-0 py-2" placeholder="••••••••" required>
              </div>
            </div>
            
            <button type="submit" class="btn btn-premium w-100 py-3 mt-2 shadow">
              <i class="fas fa-sign-in-alt me-2"></i> Connexion
            </button>
          </form>
          
          <div class="text-center mt-4 border-top pt-4">
            <p class="small text-muted mb-2">Pas encore de compte ? <a routerLink="/register" class="text-primary text-decoration-none fw-bold">S'inscrire</a></p>
            <p class="small text-muted mb-0">Besoin d'aide ? <a href="#" class="text-primary text-decoration-none fw-bold">Contactez le support</a></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/clients']);
          } else {
            this.router.navigate(['/accounts']);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          const message = err.error?.message || err.error?.error || 'Identifiants incorrects ou utilisateur inexistant.';
          alert(message);
        }
      });
  }
}
