import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    standalone: false,
    template: `
    <div class="row align-items-center min-vh-75 animate-fade-in">
      <div class="col-lg-6 mb-5 mb-lg-0">
        <h1 class="display-3 fw-bold mb-4">La banque qui vous <span class="text-primary text-gradient">ressemble</span>.</h1>
        <p class="lead text-muted mb-5">
          Gérez vos comptes, effectuez des virements et suivez vos transactions en temps réel avec EGA BANK. 
          Une expérience bancaire simplifiée, sécurisée et 100% numérique.
        </p>
        <div class="d-flex flex-wrap gap-3">
          <button class="btn btn-premium btn-lg px-5 py-3 shadow" routerLink="/register">
            <i class="fas fa-user-plus me-2"></i> Ouvrir un compte
          </button>
          <button class="btn btn-outline-primary btn-lg px-5 py-3 border-2" routerLink="/login">
            <i class="fas fa-sign-in-alt me-2"></i> Se connecter
          </button>
        </div>
        <div class="mt-5 d-flex align-items-center gap-4 text-muted small">
          <div class="d-flex align-items-center"><i class="fas fa-shield-alt text-success me-2"></i> Sécurisé</div>
          <div class="d-flex align-items-center"><i class="fas fa-bolt text-warning me-2"></i> Rapide</div>
          <div class="d-flex align-items-center"><i class="fas fa-headset text-info me-2"></i> Support 24/7</div>
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="position-relative">
          <div class="premium-card p-0 overflow-hidden shadow-lg border-0 bg-transparent">
             <div class="preview-mockup">
                <!-- Decorative glass panels -->
                <div class="glass-panel p-4 position-absolute top-0 start-0 translate-middle-y translate-middle-x shadow-lg" style="width: 250px; z-index: 10;">
                   <div class="d-flex justify-content-between align-items-center mb-3">
                      <div class="small fw-bold">Dernière transaction</div>
                      <i class="fas fa-check-circle text-success"></i>
                   </div>
                   <div class="h4 mb-0">+ 150.000 FCFA</div>
                   <div class="text-muted small">Virement reçu - J. Koffi</div>
                </div>
                
                <div class="glass-panel p-4 position-absolute bottom-0 end-0 translate-middle-y shadow-lg" style="width: 210px; z-index: 10;">
                   <div class="small text-muted mb-1">Votre solde</div>
                   <div class="h3 fw-bold">2.450.000</div>
                   <div class="small fw-bold text-success"><i class="fas fa-arrow-up me-1"></i> +12% ce mois</div>
                </div>

                <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                     class="img-fluid rounded-5 shadow" alt="EGA Bank Mobile App">
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="row mt-5 pt-5 g-4 text-center">
      <div class="col-md-4">
        <div class="premium-card h-100 border-0 shadow-sm py-5">
          <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center mb-4" style="width: 80px; height: 80px;">
            <i class="fas fa-wallet fa-2x"></i>
          </div>
          <h3 class="h4 mb-3">Gestion de Comptes</h3>
          <p class="text-muted">Créez des comptes courants ou d'épargne en quelques clics.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="premium-card h-100 border-0 shadow-sm py-5">
          <div class="rounded-circle bg-accent bg-opacity-10 text-accent d-inline-flex align-items-center justify-content-center mb-4" style="width: 80px; height: 80px;">
            <i class="fas fa-exchange-alt fa-2x"></i>
          </div>
          <h3 class="h4 mb-3">Transactions Faciles</h3>
          <p class="text-muted">Virements, versements et retraits sécurisés instantanément.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="premium-card h-100 border-0 shadow-sm py-5">
          <div class="rounded-circle bg-info bg-opacity-10 text-info d-inline-flex align-items-center justify-content-center mb-4" style="width: 80px; height: 80px;">
            <i class="fas fa-file-pdf fa-2x"></i>
          </div>
          <h3 class="h4 mb-3">Relevés Bancaires</h3>
          <p class="text-muted">Générez et téléchargez vos relevés au format PDF à tout moment.</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .text-gradient {
      background: linear-gradient(to right, #3b82f6, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .min-vh-75 { min-height: 75vh; }
  `]
})
export class HomeComponent { }
