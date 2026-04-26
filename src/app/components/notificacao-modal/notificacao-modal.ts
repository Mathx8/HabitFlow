import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-notificacao-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notificacao-modal.html',
})
export class NotificacaoModal {

  notificacoes: any[] = [];
  isOpen = false;

  constructor(private api: ApiService) { }

  toggle() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.api.getNotificacaoNaoLidas().subscribe(res => {
        this.notificacoes = Array.isArray(res) ? res : (res.data ?? []);
      });
    }
  }

  marcarComoLida(n: any) {
    this.api.marcarNotificacaoComoLida(n.id).subscribe(() => {
      this.notificacoes = this.notificacoes.filter(x => x.id !== n.id);
    });
  }
}