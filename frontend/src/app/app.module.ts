import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { JwtInterceptor } from './core/jwt.interceptor';
import { AuthGuard } from './core/auth.guard';
import { AuthService } from './auth/auth.service';

// Placeholders for components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { HomeComponent } from './home/home.component';

import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountCreateComponent } from './accounts/account-create/account-create.component';
import { TransactionFormComponent } from './transactions/transaction-form/transaction-form.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'clients', component: ClientListComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'accounts', component: AccountListComponent, canActivate: [AuthGuard] },
  { path: 'accounts/create', component: AccountCreateComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'transactions', component: TransactionFormComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ClientListComponent,
    HomeComponent,
    AccountListComponent,
    AccountCreateComponent,
    TransactionFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
