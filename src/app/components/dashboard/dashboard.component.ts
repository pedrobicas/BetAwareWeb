import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApostaService } from '../../services/aposta.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  user: any;
  apostas: any[] = [];
  loading = true;
  totalApostas = 0;
  valorTotal = 0;
  valorPerdido = 0;
  taxaSucesso = 0;

  constructor(
    private authService: AuthService,
    private apostaService: ApostaService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;
    this.apostaService.listarApostas().subscribe({
      next: (apostas) => {
        this.apostas = apostas.slice(0, 5); // Mostrar apenas as 5 apostas mais recentes
        this.calcularEstatisticas(apostas);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.loading = false;
      }
    });
  }

  private calcularEstatisticas(apostas: any[]) {
    this.totalApostas = apostas.length;
    this.valorTotal = apostas.reduce((total, aposta) => total + aposta.valor, 0);
    this.valorPerdido = apostas
      .filter(aposta => aposta.resultado === 'PERDEU')
      .reduce((total, aposta) => total + aposta.valor, 0);
    const ganhas = apostas.filter(aposta => aposta.resultado === 'GANHOU').length;
    this.taxaSucesso = this.totalApostas > 0 ? Math.round((ganhas / this.totalApostas) * 100) : 0;
  }
} 