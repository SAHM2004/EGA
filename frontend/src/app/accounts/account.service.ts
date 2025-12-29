import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
    numeroCompte?: string;
    dateCreation?: string;
    solde: number;
    type: 'CURRENT' | 'SAVINGS';
    clientId: number;
    tauxInteret?: number;
    decouvert?: number;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
    private apiUrl = 'http://localhost:8080/api/accounts';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Account[]> {
        return this.http.get<Account[]>(this.apiUrl);
    }

    getMyAccounts(): Observable<Account[]> {
        return this.http.get<Account[]>(`${this.apiUrl}/my`);
    }

    create(account: Account): Observable<Account> {
        return this.http.post<Account>(this.apiUrl, account);
    }

    getByNumero(numero: string): Observable<Account> {
        return this.http.get<Account>(`${this.apiUrl}/${numero}`);
    }

    getByClient(clientId: number): Observable<Account[]> {
        return this.http.get<Account[]>(`${this.apiUrl}/client/${clientId}`);
    }

    // Account Requests API
    private requestUrl = 'http://localhost:8080/api/account-requests';

    submitRequest(requestData: any): Observable<any> {
        return this.http.post(this.requestUrl, requestData);
    }

    getPendingRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.requestUrl}/pending`);
    }

    approveRequest(id: number): Observable<any> {
        return this.http.post(`${this.requestUrl}/${id}/approve`, {});
    }

    rejectRequest(id: number, reason: string): Observable<any> {
        return this.http.post(`${this.requestUrl}/${id}/reject`, { reason });
    }

    getMyRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.requestUrl}/my`);
    }
}
