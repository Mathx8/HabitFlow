import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Icons } from '../../services/icons';
import { NotificacaoModal } from '../notificacao-modal/notificacao-modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificacaoModal],
  templateUrl: './header.html',
})
export class Header {
  constructor(private auth: Auth, public icons: Icons) { }

  get usuario() {
    return this.auth.getUser();
  }

  get inicial(): string {
    const user = this.usuario;
    return user?.nome?.charAt(0)?.toUpperCase() ?? user?.username?.charAt(0)?.toUpperCase() ?? '?';
  }

  today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}
