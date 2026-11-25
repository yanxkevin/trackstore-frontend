import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AlbumService } from '../../services/album';
import { Album } from '../../models/album.model';
import { CestaService } from '../../services/cesta';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vitrine.html',
  styleUrls: ['./vitrine.css']
})
export class VitrineComponent implements OnInit {
  albuns: Album[] = [];

  // ========== MENSAGENS ==========
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  generos = [
    {
      nome: 'Pop',
      rota: 'pop',
      imagem: 'https://i.pinimg.com/736x/b3/10/97/b31097b67c5b8664379b800dcad3b6af.jpg',
      descricao: 'Os maiores hits do pop'
    },
    {
      nome: 'Rock/Metal',
      rota: 'rock-metal',
      imagem: 'https://i.pinimg.com/736x/73/ef/da/73efda8b093a5b1c6b9700d02f021769.jpg',
      descricao: 'O som pesado que revolucionou a música'
    },
    {
      nome: 'Indie/Alternativo',
      rota: 'indie-alternativo',
      imagem: 'https://i.pinimg.com/736x/4e/0f/db/4e0fdbd5028a200dd975dd3a87410141.jpg',
      descricao: 'Inovação e criatividade'
    },
    {
      nome: 'R&B',
      rota: 'r-b',
      imagem: 'https://i.pinimg.com/736x/c2/70/b8/c270b82b7cba50155a490aabc07cbb7b.jpg',
      descricao: 'A alma da música moderna'
    },
    {
      nome: 'MPB',
      rota: 'mpb',
      imagem: 'https://i.pinimg.com/736x/5f/b7/99/5fb799a57accd7edda4aa2b10dcd005d.jpg',
      descricao: 'A música popular brasileira'
    },
    {
      nome: 'Rap',
      rota: 'rap',
      imagem: 'https://i.pinimg.com/736x/25/46/30/25463026d71d83a83d270c64ed872bca.jpg',
      descricao: 'Ritmo e Poesia'
    },
    {
      nome: 'K-Pop',
      rota: 'k-pop',
      imagem: 'https://i.pinimg.com/736x/d7/db/9c/d7db9cce086efaaec94b679b674c713c.jpg', 
      descricao: 'O fenômeno da música pop coreana'
    }
  ];

  constructor(
    private albumService: AlbumService,
    private cestaService: CestaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.albumService.getAlbuns().subscribe(data => {
      this.albuns = data;
    });

    // ========== RESTAURAR POSIÇÃO DO SCROLL ==========
    const posicaoSalva = localStorage.getItem('scrollVitrine');
    if (posicaoSalva) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(posicaoSalva, 10));
      }, 100);
    }
  }

  // ========== SALVAR POSIÇÃO DO SCROLL AO ROLAR ==========
  @HostListener('window:scroll')
  onScroll(): void {
    localStorage.setItem('scrollVitrine', window.scrollY.toString());
  }

  contarAlbunsPorGenero(genero: string): number {
    if (!this.albuns || this.albuns.length === 0) {
      return 0;
    }
    return this.albuns.filter(album => album.genero === genero).length;
  }

  // ========== ADICIONAR À CESTA ==========
  adicionarCesta(album: Album): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (!usuarioLogado) {
      this.mensagemErro = 'Você precisa estar logado para adicionar itens à cesta!';
      setTimeout(() => { this.mensagemErro = ''; }, 5000);
      return;
    }

    // Chama o serviço que envia para o banco
    this.cestaService.adicionar(album);
    
    // Feedback visual no botão
    album.adicionado = true;
    this.mensagemSucesso = `${album.nome} adicionado!`;
    
    setTimeout(() => { 
      this.mensagemSucesso = ''; 
      album.adicionado = false;
    }, 2000);
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}