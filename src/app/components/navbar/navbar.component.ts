import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a routerLink="/dashboard">BataWare</a>
      </div>
      
      <div class="navbar-menu">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <i class="fas fa-home"></i> Dashboard
        </a>
        <a routerLink="/apostas" routerLinkActive="active">
          <i class="fas fa-ticket-alt"></i> Apostas
        </a>
        <a routerLink="/historico" routerLinkActive="active">
          <i class="fas fa-history"></i> Histórico
        </a>
        <a routerLink="/relatorio" routerLinkActive="active">
          <i class="fas fa-chart-bar"></i> Relatório
        </a>
      </div>

      <div class="navbar-end">
        <div class="user-info">
          <span>{{ user?.nome || 'Usuário' }}</span>
        </div>
        <button class="logout-btn" (click)="logout()">
          <i class="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #2c3e50;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar-brand a {
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
    }

    .navbar-menu {
      display: flex;
      gap: 1.5rem;
    }

    .navbar-menu a {
      color: #ecf0f1;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .navbar-menu a:hover {
      background: rgba(255,255,255,0.1);
    }

    .navbar-menu a.active {
      background: #3498db;
    }

    .navbar-end {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      color: #ecf0f1;
    }

    .logout-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .logout-btn:hover {
      background: #c0392b;
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        padding: 1rem;
      }

      .navbar-menu {
        margin: 1rem 0;
        flex-wrap: wrap;
        justify-content: center;
      }

      .navbar-end {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class NavbarComponent {
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 