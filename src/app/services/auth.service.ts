import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  token: string;
  username: string;
  nome: string;
  perfil: string;
}

export interface User {
  username: string;
  nome: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private token: string | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token');
      this.isAuthenticatedSubject.next(!!this.token);
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/v1/auth/login`, { username, senha: password })
      .pipe(
        tap(response => {
          this.token = response.token;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('nome', response.nome);
            localStorage.setItem('perfil', response.perfil);
          }
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(userData: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/v1/auth/register`, userData);
  }

  logout(): void {
    this.token = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('nome');
      localStorage.removeItem('perfil');
    }
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return this.token;
  }

  getUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username');
    }
    return null;
  }

  getNome(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('nome');
    }
    return null;
  }

  getPerfil(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('perfil');
    }
    return null;
  }

  getUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const username = this.getUsername();
      const nome = this.getNome();
      const perfil = this.getPerfil();

      if (username && nome && perfil) {
        return {
          username,
          nome,
          perfil
        };
      }
    }
    return null;
  }
} 