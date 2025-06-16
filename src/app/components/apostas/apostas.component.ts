import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApostaService, Aposta } from '../../services/aposta.service';

@Component({
  selector: 'app-apostas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './apostas.component.html',
  styleUrls: ['./apostas.component.css']
})
export class ApostasComponent implements OnInit {
  categorias = [
    {
      nome: 'Esportes',
      jogos: [
        'Flamengo x Vasco',
        'Palmeiras x Corinthians',
        'São Paulo x Santos',
        'Grêmio x Internacional',
        'Cruzeiro x Atlético-MG'
      ]
    },
    {
      nome: 'Slots',
      jogos: [
        'Book of Dead',
        'Sweet Bonanza',
        'Gates of Olympus',
        'Starburst',
        'Gonzo\'s Quest'
      ]
    },
    {
      nome: 'Cassino ao Vivo',
      jogos: [
        'Roleta Europeia',
        'Blackjack VIP',
        'Bacará',
        'Poker Texas Hold\'em',
        'Dragon Tiger'
      ]
    },
    {
      nome: 'Outros',
      jogos: [
        'Bingo',
        'Raspadinhas',
        'Loteria',
        'Keno',
        'Video Poker'
      ]
    }
  ];

  aposta: Aposta = {
    categoria: '',
    jogo: '',
    valor: 0,
    resultado: '',
    data: new Date().toISOString()
  };

  apostas: Aposta[] = [];
  loading = false;
  error = '';
  jogosFiltrados: string[] = [];

  constructor(private apostaService: ApostaService) {}

  ngOnInit() {
    this.carregarApostas();
  }

  onCategoriaChange() {
    const categoria = this.categorias.find(cat => cat.nome === this.aposta.categoria);
    this.jogosFiltrados = categoria ? categoria.jogos : [];
    this.aposta.jogo = '';
  }

  carregarApostas() {
    this.loading = true;
    this.apostaService.listarApostas().subscribe({
      next: (apostas) => {
        this.apostas = apostas;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar apostas';
        this.loading = false;
        console.error('Erro ao carregar apostas:', error);
      }
    });
  }

  simularAposta() {
    if (!this.aposta.categoria || !this.aposta.jogo || this.aposta.valor <= 0 || !this.aposta.resultado) {
      this.error = 'Preencha todos os campos corretamente';
      return;
    }

    const novaAposta: Aposta = {
      ...this.aposta,
      data: new Date().toISOString()
    };

    this.loading = true;
    this.apostaService.criarAposta(novaAposta).subscribe({
      next: () => {
        this.carregarApostas();
        this.aposta = {
          categoria: '',
          jogo: '',
          valor: 0,
          resultado: '',
          data: new Date().toISOString()
        };
        this.jogosFiltrados = [];
        this.error = '';
      },
      error: (error) => {
        this.error = 'Erro ao criar aposta';
        this.loading = false;
        console.error('Erro ao criar aposta:', error);
      }
    });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR');
  }
}