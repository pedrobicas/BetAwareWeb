import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface Aposta {
  id?: number;
  categoria: string;
  jogo: string;
  valor: number;
  resultado: string;
  data: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApostaService {
  private apiUrl = `${environment.apiUrl}/apostas`;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  criarAposta(aposta: Aposta): Observable<Aposta> {
    return this.http.post<Aposta>(this.apiUrl, aposta, {
      headers: this.getHeaders()
    });
  }

  listarApostas(): Observable<Aposta[]> {
    return this.http.get<Aposta[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  listarApostasPorPeriodo(inicio: string, fim: string): Observable<Aposta[]> {
    return this.http.get<Aposta[]>(`${this.apiUrl}/periodo`, {
      headers: this.getHeaders(),
      params: {
        inicio,
        fim
      }
    });
  }

  listarApostasPorUsuarioEPeriodo(inicio: string, fim: string): Observable<Aposta[]> {
    return this.http.get<Aposta[]>(`${this.apiUrl}/usuario/periodo`, {
      headers: this.getHeaders(),
      params: {
        inicio,
        fim
      }
    });
  }
}