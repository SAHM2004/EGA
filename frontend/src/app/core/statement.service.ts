import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatementService {
    private apiUrl = 'http://localhost:8080/api/statements';

    constructor(private http: HttpClient) { }

    downloadPdf(accountNumber: string, start?: string, end?: string): void {
        let url = `${this.apiUrl}/${accountNumber}/print`;
        const params = [];
        if (start) params.push(`start=${start}`);
        if (end) params.push(`end=${end}`);

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        this.http.get(url, { responseType: 'blob' }).subscribe({
            next: (blob) => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `releve-${accountNumber}.pdf`;
                link.click();
            },
            error: (err) => {
                console.error('Erreur lors du téléchargement du PDF', err);
                alert('Erreur lors de la génération du relevé.');
            }
        });
    }

    downloadStatement(accountNumber: string, start?: string, end?: string): Observable<Blob> {
        let url = `${this.apiUrl}/${accountNumber}/print`;
        const params = [];
        if (start) params.push(`start=${start}`);
        if (end) params.push(`end=${end}`);

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        return this.http.get(url, { responseType: 'blob' });
    }
}
