import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApostaService } from '../../services/aposta.service';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss']
})
export class RelatorioComponent implements OnInit {
  periodoSelecionado = '30';
  loading = true;
  totalApostas = 0;
  valorTotal = 0;
  taxaSucesso = 0;
  apostasGanhas = 0;
  apostasPerdidas = 0;
  saldo = 0;
  valorMedio = 0;
  apostasPorDia = 0;
  maiorAposta = 0;
  melhorDia = { data: new Date(), valor: 0 };
  piorDia = { data: new Date(), valor: 0 };
  sequenciaVitorias = 0;

  constructor(private apostaService: ApostaService) {}

  ngOnInit() {
    this.atualizarRelatorio();
  }

  atualizarRelatorio() {
    this.loading = true;
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - parseInt(this.periodoSelecionado));
    
    this.apostaService.listarApostasPorPeriodo(
      dataInicio.toISOString(),
      new Date().toISOString()
    ).subscribe({
      next: (apostas) => {
        this.calcularEstatisticas(apostas);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar relatório:', error);
        this.loading = false;
      }
    });
  }

  private calcularEstatisticas(apostas: any[]) {
    this.totalApostas = apostas.length;
    this.valorTotal = apostas.reduce((total, aposta) => total + aposta.valor, 0);
    
    const apostasGanhas = apostas.filter(aposta => aposta.resultado === 'GANHOU');
    this.apostasGanhas = apostasGanhas.length;
    this.apostasPerdidas = this.totalApostas - this.apostasGanhas;
    
    this.taxaSucesso = this.totalApostas > 0 
      ? Math.round((this.apostasGanhas / this.totalApostas) * 100) 
      : 0;

    // Calcular saldo
    const valorGanho = apostasGanhas.reduce((total, aposta) => total + aposta.valor, 0);
    const valorPerdido = this.valorTotal - valorGanho;
    this.saldo = valorGanho - valorPerdido;

    // Calcular médias
    this.valorMedio = this.totalApostas > 0 ? this.valorTotal / this.totalApostas : 0;
    this.apostasPorDia = this.totalApostas / parseInt(this.periodoSelecionado);
    this.maiorAposta = Math.max(...apostas.map(aposta => aposta.valor));

    // Calcular melhor e pior dia
    const apostasPorDia = this.agruparApostasPorDia(apostas);
    this.calcularMelhorEPiorDia(apostasPorDia);

    // Calcular sequência de vitórias
    this.sequenciaVitorias = this.calcularSequenciaVitorias(apostas);
  }

  private agruparApostasPorDia(apostas: any[]) {
    const apostasPorDia = new Map<string, { data: Date, valor: number }>();
    
    apostas.forEach(aposta => {
      const data = new Date(aposta.data);
      const dataStr = data.toISOString().split('T')[0];
      
      if (!apostasPorDia.has(dataStr)) {
        apostasPorDia.set(dataStr, { data, valor: 0 });
      }
      
      const valor = aposta.resultado === 'GANHOU' ? aposta.valor : -aposta.valor;
      apostasPorDia.get(dataStr)!.valor += valor;
    });

    return Array.from(apostasPorDia.values());
  }

  private calcularMelhorEPiorDia(apostasPorDia: { data: Date, valor: number }[]) {
    if (apostasPorDia.length > 0) {
      this.melhorDia = apostasPorDia.reduce((melhor, atual) => 
        atual.valor > melhor.valor ? atual : melhor
      );
      
      this.piorDia = apostasPorDia.reduce((pior, atual) => 
        atual.valor < pior.valor ? atual : pior
      );
    }
  }

  private calcularSequenciaVitorias(apostas: any[]): number {
    let sequenciaAtual = 0;
    let maiorSequencia = 0;

    apostas.forEach(aposta => {
      if (aposta.resultado === 'GANHOU') {
        sequenciaAtual++;
        maiorSequencia = Math.max(maiorSequencia, sequenciaAtual);
      } else {
        sequenciaAtual = 0;
      }
    });

    return maiorSequencia;
  }
} 