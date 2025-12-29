import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    private tokenKey = 'auth_token';
    private roleKey = 'user_role';
    private userKey = 'username';

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials)
            .pipe(tap(response => {
                if (response.token) {
                    localStorage.setItem(this.tokenKey, response.token);
                    localStorage.setItem(this.roleKey, response.role);
                    localStorage.setItem(this.userKey, credentials.username);
                }
            }));
    }

    register(user: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, user);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.roleKey);
        localStorage.removeItem(this.userKey);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getRole(): string | null {
        return localStorage.getItem(this.roleKey);
    }

    getPendingUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/pending-users`);
    }

    activateUser(username: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/activate/${username}`, {});
    }

    rejectUser(username: string, reason: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reject/${username}`, { reason });
    }

    getUsername(): string | null {
        return localStorage.getItem(this.userKey);
    }

    isAdmin(): boolean {
        return this.getRole() === 'ROLE_ADMIN';
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
