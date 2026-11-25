import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './esqueci-senha.html',
  styleUrls: ['./esqueci-senha.css']
})
export class EsqueciSenhaComponent {
  email: string = '';
  erro: string = '';
  sucesso: string = '';

  constructor(private router: Router, private apiService: ApiService) {}

  recuperarSenha(): void {
    this.erro = '';
    this.sucesso = '';

    if (!this.email) {
      this.erro = 'Digite seu e-mail para recuperar a senha!';
      return;
    }

    this.apiService.esqueciSenha(this.email).subscribe({
      next: (resposta) => {
        // O Java retorna o texto com a senha nova
        this.sucesso = resposta;
        
        // Exibe um alert simulando o recebimento do e-mail
        alert(`📧 SIMULAÇÃO DE E-MAIL\n\n${resposta}\n\nUse esta senha para fazer login.`);
        
        this.email = '';
      },
      error: (err) => {
        this.erro = 'E-mail não encontrado em nosso sistema.';
      }
    });
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}