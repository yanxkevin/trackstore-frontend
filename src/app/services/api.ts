import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // ========== CLIENTES ==========
  cadastrarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, cliente);
  }

  login(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/login`, dados);
  }

  esqueciSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/esqueci-senha`, { email: email }, { responseType: 'text' });
  }

  // ========== PEDIDOS ==========
  adicionarPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, pedido);
  }

  buscarPedidosCliente(clienteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/cliente/${clienteId}`);
  }

  deletarPedido(pedidoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pedidos/${pedidoId}`);
  }
}