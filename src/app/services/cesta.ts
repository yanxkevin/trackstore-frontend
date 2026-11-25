import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api';
import { Album } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class CestaService {
  private contadorItens = new BehaviorSubject<number>(0);
  contadorItens$ = this.contadorItens.asObservable();
  private itensCesta: any[] = [];

  constructor(private apiService: ApiService) { }

  private getClienteId(): number | null {
    const usuario = localStorage.getItem('usuarioLogado');
    if (!usuario) return null;
    return JSON.parse(usuario).id;
  }

  carregarCesta(): void {
    const clienteId = this.getClienteId();
    if (!clienteId) return;

    this.apiService.buscarPedidosCliente(clienteId).subscribe({
      next: (pedidos) => {
        this.itensCesta = pedidos;
        this.atualizarContador();
      }
    });
  }

  adicionar(album: Album): { sucesso: boolean; mensagem: string } {
    const clienteId = this.getClienteId();
    if (!clienteId) return { sucesso: false, mensagem: 'Faça login primeiro!' };

    const novoPedido = {
      clienteId: clienteId,
      albumId: album.id,
      nomeAlbum: album.nome,
      quantidade: 1
    };

    console.log('Enviando para o Java:', novoPedido);

    this.apiService.adicionarPedido(novoPedido).subscribe({
      next: () => this.carregarCesta(),
      error: (e) => console.error('Erro no Java:', e)
    });

    return { sucesso: true, mensagem: `${album.nome} adicionado!` };
  }

  remover(pedidoId: number): void {
    this.apiService.deletarPedido(pedidoId).subscribe(() => this.carregarCesta());
  }

  limpar(): void {
    this.getItens().forEach(item => this.apiService.deletarPedido(item.id).subscribe());
    this.itensCesta = [];
    this.atualizarContador();
  }

  getItens(): any[] { return this.itensCesta; }
  getQuantidadeTotal(): number { return this.itensCesta.reduce((t, i) => t + (i.quantidade || 1), 0); }
  atualizarContador(): void { this.contadorItens.next(this.getQuantidadeTotal()); }
}