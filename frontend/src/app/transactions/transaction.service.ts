import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
    id?: number;
    montant: number;
    dateOperation: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
    accountId: string;
}

export interface TransferRequest {
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private apiUrl = 'http://localhost:8080/api/transactions';

    constructor(private http: HttpClient) { }

    deposit(accountId: string, amount: number): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiUrl}/deposit`, { accountId, amount });
    }

    withdraw(accountId: string, amount: number): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiUrl}/withdraw`, { accountId, amount });
    }

    transfer(request: TransferRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/transfer`, request);
    }

    getAccountHistory(accountId: string): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/account/${accountId}`);
    }

    getAllHistory(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/history`);
    }
}
