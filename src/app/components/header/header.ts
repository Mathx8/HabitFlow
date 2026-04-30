import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Icons } from '../../services/icons';
import { NotificacaoModal } from '../notificacao-modal/notificacao-modal';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificacaoModal],
  templateUrl: './header.html',
})
export class Header {

  pageTitle = '';
  pageSubtitle = '';

  constructor(
    private auth: Auth,
    private router: Router,
    public icons: Icons
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.setPageInfo());

    this.setPageInfo();
  }

  get usuario() {
    return this.auth.getUser();
  }

  today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  setPageInfo() {
    const url = this.router.url;

    if (url.includes('dashboard')) {
      this.pageTitle = 'Dashboard';
      this.pageSubtitle = 'Sua visão geral de hábitos';
    }
    else if (url.includes('habitos')) {
      this.pageTitle = 'Hábitos';
      this.pageSubtitle = 'Gerencie e acompanhe sua rotina diária';
    }
    else if (url.includes('conquistas')) {
      this.pageTitle = 'Conquistas';
      this.pageSubtitle = 'Veja seu progresso e desbloqueios';
    }
    else if (url.includes('notificacao')) {
      this.pageTitle = 'Notificações';
      this.pageSubtitle = 'Acompanhe suas atualizações';
    }
    else if (url.includes('perfil')) {
      this.pageTitle = 'Perfil';
      this.pageSubtitle = 'Gerencie sua conta';
    }
    else {
      this.pageTitle = 'HabitFlow';
      this.pageSubtitle = `Bem-vindo, ${this.usuario?.username || 'visitante'}`;
    }
  }
}