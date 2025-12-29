# PROJET : Système Bancaire « EGA »

## 🎯 Objectif
Développer une application client–serveur sécurisée permettant :
- La gestion des clients
- La gestion des comptes bancaires (courant & épargne)
- La gestion des transactions (versement, retrait, virement)
- La génération de relevés bancaires
- Une authentification sécurisée JWT
- Un front-end Angular ergonomique

## 🧱 ARCHITECTURE GLOBALE
```
┌────────────┐        REST API        ┌──────────────────┐
│  Angular   │  <----------------->  │ Spring Boot API  │
│ Front-End  │                       │ (Java EE)        │
└────────────┘                       └──────────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │ Base de     │
                                       │ données     │
                                       │ (MySQL)     │
                                       └─────────────┘
```

## 🛠 TECHNOLOGIES UTILISÉES
### Back-end
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- Hibernate
- Maven
- iban4j
- MySQL / PostgreSQL
- Postman (tests)

### Front-end
- Angular 17+
- TypeScript
- Bootstrap / Angular Material
- RxJS

## 📁 STRUCTURE BACK-END (SPRING BOOT)
```
src/main/java/com/ega/bank/
│
├── BankApplication.java
│
├── config/
│   ├── SecurityConfig.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtUtils.java
│   └── SwaggerConfig.java
│
├── controller/
│   ├── AuthController.java
│   ├── ClientController.java
│   ├── AccountController.java
│   ├── TransactionController.java
│   └── StatementController.java
│
├── dto/
│   ├── ClientDTO.java
│   ├── AccountDTO.java
│   ├── TransactionDTO.java
│   ├── TransferRequestDTO.java
│   └── AuthRequestDTO.java
│
├── entity/
│   ├── Client.java
│   ├── Account.java
│   ├── SavingsAccount.java
│   ├── CurrentAccount.java
│   ├── Transaction.java
│   └── User.java
│
├── enum/
│   ├── AccountType.java
│   ├── TransactionType.java
│   └── Gender.java
│
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── InsufficientBalanceException.java
│   └── InvalidOperationException.java
│
├── repository/
│   ├── ClientRepository.java
│   ├── AccountRepository.java
│   ├── TransactionRepository.java
│   └── UserRepository.java
│
├── service/
│   ├── ClientService.java
│   ├── AccountService.java
│   ├── TransactionService.java
│   └── AuthService.java
│
└── util/
    ├── IbanGenerator.java
    └── PdfGenerator.java
```

## 🔌 API REST – ENDPOINTS

### 🔐 Authentification
- `POST /api/auth/login`
- `POST /api/auth/register`

### 👤 Client
- `GET    /api/clients`
- `POST   /api/clients`
- `GET    /api/clients/{id}`
- `PUT    /api/clients/{id}`
- `DELETE /api/clients/{id}`

### 💳 Compte
- `POST /api/accounts`
- `GET  /api/accounts/{numero}`
- `GET  /api/accounts/client/{clientId}`

### 💰 Transactions
- `POST /api/transactions/deposit`
- `POST /api/transactions/withdraw`
- `POST /api/transactions/transfer`

### 📄 Relevé bancaire
- `GET /api/statements/{accountNumber}?start=2025-01-01&end=2025-01-31`
- `GET /api/statements/{accountNumber}/print`

## 🔐 SÉCURITÉ (SPRING SECURITY + JWT)
- Authentification obligatoire
- JWT stocké côté front
- Rôles : `ROLE_ADMIN`, `ROLE_CLIENT`

## 🖥 STRUCTURE FRONT-END (ANGULAR)
```
src/app/
│
├── auth/
│   ├── login/
│   ├── register/
│   └── auth.service.ts
│
├── clients/
│   ├── client-list/
│   ├── client-form/
│   └── client.service.ts
│
├── accounts/
│   ├── account-list/
│   ├── account-create/
│   └── account.service.ts
│
├── transactions/
│   ├── deposit/
│   ├── withdraw/
│   ├── transfer/
│
├── statements/
│   └── statement.component.ts
│
├── core/
│   ├── jwt.interceptor.ts
│   ├── auth.guard.ts
│
└── app.module.ts
```

## 🧪 TESTS POSTMAN
Collection Postman : Auth, Clients, Comptes, Transactions
Headers : `Authorization: Bearer <TOKEN>`

## 📂 ORGANISATION GITHUB
- Nom du dépôt: `TP_JEE_GLSI_A_GROUPE_01_2026`
- Branches: `main`, `backend`, `frontend`
