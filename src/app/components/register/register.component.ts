import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  nome = '';
  email = '';
  cpf = '';
  cep = '';
  endereco = '';
  password = '';
  loading = false;
  error = '';
  usernameError = '';
  nomeError = '';
  emailError = '';
  cpfError = '';
  cepError = '';
  passwordError = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validarCpf(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;

    // Validação do CPF
    let soma = 0;
    let resto;

    if (cpf === '00000000000') return false;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  async buscarEndereco() {
    if (this.cep.length !== 8) {
      this.cepError = 'CEP deve conter 8 dígitos';
      return;
    }

    this.loading = true;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${this.cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        this.cepError = 'CEP não encontrado';
        this.endereco = '';
      } else {
        this.endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        this.cepError = '';
      }
    } catch (error) {
      this.cepError = 'Erro ao buscar CEP';
      this.endereco = '';
    } finally {
      this.loading = false;
    }
  }

  onSubmit() {
    this.error = '';
    this.usernameError = '';
    this.nomeError = '';
    this.emailError = '';
    this.cpfError = '';
    this.cepError = '';
    this.passwordError = '';

    if (this.username.length < 3) {
      this.usernameError = 'O usuário deve ter pelo menos 3 caracteres';
      return;
    }

    if (!this.nome) {
      this.nomeError = 'O nome é obrigatório';
      return;
    }

    if (!this.email || !this.email.includes('@')) {
      this.emailError = 'Email inválido';
      return;
    }

    if (!this.validarCpf(this.cpf)) {
      this.cpfError = 'CPF inválido';
      return;
    }

    if (this.cep.length !== 8) {
      this.cepError = 'CEP deve conter 8 dígitos';
      return;
    }

    if (!this.endereco) {
      this.cepError = 'Busque o endereço pelo CEP';
      return;
    }

    if (this.password.length < 4) {
      this.passwordError = 'A senha deve ter pelo menos 4 caracteres';
      return;
    }

    this.loading = true;
    this.authService.register({
      username: this.username,
      nome: this.nome,
      email: this.email,
      cpf: this.cpf,
      cep: this.cep,
      endereco: this.endereco,
      senha: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 409) {
          if (error.error?.includes('username')) {
            this.usernameError = 'Este nome de usuário já está em uso';
          } else if (error.error?.includes('email')) {
            this.emailError = 'Este email já está em uso';
          } else if (error.error?.includes('cpf')) {
            this.cpfError = 'Este CPF já está em uso';
          }
        } else {
          this.error = 'Erro ao cadastrar usuário';
        }
        this.loading = false;
      }
    });
  }
} 