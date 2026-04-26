import { Component, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  dataCriacao: string;
}

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificacao.html',
})
export class NotificacaoPage {

  notificacoes: Notificacao[] = [];
  naoLidas: Notificacao[] = [];
  isLoading = true;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => this.loadData());
  }

  loadData() {
    this.isLoading = true;

    this.api.getNotificacao().subscribe({
      next: (res) => {
        const lista = Array.isArray(res) ? res : (res.data ?? []);
        this.notificacoes = lista;

        this.naoLidas = lista.filter((n: { lida: any; }) => !n.lida);

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  marcarComoLida(n: Notificacao) {
    if (n.lida) return;

    this.api.marcarNotificacaoComoLida(n.id).subscribe({
      next: () => {
        n.lida = true;
        this.naoLidas = this.notificacoes.filter(x => !x.lida);
        this.cdr.markForCheck();
      }
    });
  }

  marcarTodas() {
    this.api.marcarTodasNotificacoesComoLidas().subscribe({
      next: () => {
        this.notificacoes.forEach(n => n.lida = true);
        this.naoLidas = [];
        this.cdr.markForCheck();
      }
    });
  }
}