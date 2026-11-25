import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api'; // <-- Importando a API

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  // Dados do formulário
  email: string = '';
  senha: string = '';
  erroLogin: string = '';
  sucessoLogin: string = '';

  // Injetando o ApiService
  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    // Se já estiver logado, vai direto para a home
    if (localStorage.getItem('usuarioLogado')) {
      this.router.navigate(['/']);
    }
  }

  fazerLogin(): void {
    // Limpar mensagens
    this.erroLogin = '';
    this.sucessoLogin = '';

    // Validar campos
    if (!this.email || !this.senha) {
      this.erroLogin = 'Preencha todos os campos!';
      return;
    }

    const dadosLogin = { email: this.email, senha: this.senha };

    // Chama o Back-end (Java) para fazer o login
    this.apiService.login(dadosLogin).subscribe({
      next: (cliente) => {
        // Login bem-sucedido
        this.sucessoLogin = 'Login realizado com sucesso!';
        
        // Salva os dados do usuário logado (SEM a senha por segurança)
        localStorage.setItem('usuarioLogado', JSON.stringify(cliente));

        // Limpar os campos
        this.email = '';
        this.senha = '';
        this.loginForm.resetForm();

        // Redireciona após 1 segundo
        setTimeout(() => {
          this.router.navigate(['/']);
          window.location.reload(); // Atualiza o header para mostrar o nome
        }, 1000);
      },
      error: (err) => {
        // Se o Java retornar erro 401 (não autorizado)
        this.erroLogin = 'E-mail ou senha incorretos!';
        console.error('Erro no login:', err);
      }
    });
  }

  irParaCadastro(): void {
    this.router.navigate(['/cadastro']);
  }

  irParaEsqueciSenha(): void {
    this.router.navigate(['/esqueci-senha']);
  }
}