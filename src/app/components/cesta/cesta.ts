import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CestaService } from '../../services/cesta';
import { AlbumService } from '../../services/album';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cesta.html',
  styleUrls: ['./cesta.css']
})
export class CestaComponent implements OnInit {
  itens: any[] = [];
  total: number = 0;

  constructor(
    public cestaService: CestaService,
    private albumService: AlbumService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Escuta as mudanças no serviço para atualizar a tela na mesma hora
    this.cestaService.contadorItens$.subscribe(() => {
      this.carregarDadosVisuais();
    });
    
    // Carrega os dados do banco na primeira vez que abre a tela
    this.cestaService.carregarCesta();
  }

  carregarDadosVisuais(): void {
    const pedidosDoBanco = this.cestaService.getItens();
    this.total = 0;

    // Cruza os dados do pedido (banco) com os dados do álbum (imagem, preço)
    this.albumService.getAlbuns().subscribe(albuns => {
      this.itens = pedidosDoBanco.map(pedido => {
        const albumInfo = albuns.find(a => a.id === pedido.albumId);
        const preco = albumInfo ? albumInfo.preco : 0;
        const subtotal = preco * pedido.quantidade;
        
        this.total += subtotal;

        return {
          ...pedido,
          imagem: albumInfo?.imagem,
          artista: albumInfo?.artista,
          genero: albumInfo?.genero,
          preco: preco,
          subtotal: subtotal // O subtotal já fica salvo aqui
        };
      });
    });
  }

  // ========== FUNÇÃO QUE ESTAVA FALTANDO ==========
  getSubtotal(item: any): number {
    return item.subtotal || 0;
  }

  remover(id: number): void {
    if (confirm('Deseja remover este álbum da cesta?')) {
      this.cestaService.remover(id);
    }
  }

  limparCesta(): void {
    if (confirm('Deseja limpar toda a cesta?')) {
      this.cestaService.limpar();
    }
  }

  finalizarCompra(): void {
    if (this.itens.length === 0) {
      alert('Sua cesta está vazia!');
      return;
    }

    alert(`🎉 Compra finalizada!\n\nTotal: R$ ${this.total.toFixed(2)}\n\nObrigado pela preferência!`);
    this.cestaService.limpar();
    this.router.navigate(['/']);
  }

  irParaVitrine(): void {
    this.router.navigate(['/']);
  }

  getQuantidadeTotal(): number {
    return this.cestaService.getQuantidadeTotal();
  }

  getCorGenero(genero: string): string {
    const cores: { [key: string]: string } = {
      'Pop': '#ef007b',
      'Rock/Metal': '#4ecdc4',
      'Indie/Alternativo': '#a29bfe',
      'R&B': '#1318c2',
      'MPB': '#5ce7ad',
      'Rap': '#1c1919',
      'K-Pop': '#1a8ec8'
    };
    return cores[genero] || '#6c757d';
  }
}