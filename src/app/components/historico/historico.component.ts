import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApostaService } from '../../services/aposta.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class HistoricoComponent implements OnInit {
  apostas: any[] = [];
  loading = true;
  dataInicio = '';
  dataFim = '';
  resultadoFiltro = '';
  totalApostas = 0;
  valorTotal = 0;
  valorPerdido = 0;
  taxaSucesso = 0;

  constructor(private apostaService: ApostaService) {}

  ngOnInit() {
    this.carregarHistorico();
  }

  carregarHistorico() {
    this.loading = true;
    this.apostaService.listarApostas().subscribe({
      next: (apostas) => {
        this.aplicarFiltros(apostas);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar histórico:', error);
        this.loading = false;
      }
    });
  }

  filtrarApostas() {
    this.loading = true;
    const inicio = this.dataInicio ? new Date(this.dataInicio).toISOString() : null;
    const fim = this.dataFim ? new Date(this.dataFim).toISOString() : null;

    if (inicio && fim) {
      this.apostaService.listarApostasPorPeriodo(inicio, fim).subscribe({
        next: (apostas) => {
          this.aplicarFiltros(apostas);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao filtrar apostas:', error);
          this.loading = false;
        }
      });
    } else {
      this.carregarHistorico();
    }
  }

  private aplicarFiltros(apostas: any[]) {
    // Ordenar apostas por data (mais recentes primeiro)
    apostas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    // Aplicar filtro de resultado
    this.apostas = apostas.filter(aposta => {
      if (this.resultadoFiltro && aposta.resultado !== this.resultadoFiltro) {
        return false;
      }
      return true;
    });

    this.calcularEstatisticas(this.apostas);
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