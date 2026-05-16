import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {

  private api = inject(ApiService);
  private auth = inject(Auth);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  friends: any[] = [];
  chats: any[] = [];

  perfil: any = null;

  loading = true;
  error = '';

  isOwnProfile = false;

  ngOnInit(): void {

    const usernameRoute = this.route.snapshot.paramMap.get('username');

    const localUser = this.auth.getUser();

    // PERFIL PRÓPRIO
    if (!usernameRoute) {

      this.isOwnProfile = true;

      this.api.meuPerfil().subscribe({

        next: (res: any) => {

          this.perfil = res.data ?? res;

          this.loading = false;

          this.loadSocial();

          this.cdr.markForCheck();
        },

        error: (err: any) => {

          this.error =
            err?.error?.message ||
            'Erro ao carregar perfil';

          this.loading = false;

          this.cdr.markForCheck();
        }
      });

      return;
    }

    // PERFIL DE OUTRO USUÁRIO
    this.isOwnProfile = localUser?.username === usernameRoute;

    this.api.verperfil(usernameRoute).subscribe({

      next: (res: any) => {

        this.perfil = res.data ?? res;

        this.loading = false;

        // só carrega amigos/chats no próprio perfil
        if (this.isOwnProfile) {
          this.loadSocial();
        }

        this.cdr.markForCheck();
      },

      error: (err: any) => {

        this.error =
          err?.error?.message ||
          'Erro ao carregar perfil';

        this.loading = false;

        this.cdr.markForCheck();
      }
    });
  }

  loadSocial() {

    this.api.getFriends().subscribe({
      next: (res: any) => {

        this.friends = Array.isArray(res)
          ? res
          : (res.data ?? []);

        this.cdr.markForCheck();
      },
      error: () => { }
    });

    this.api.getChats().subscribe({
      next: (res: any) => {

        this.chats = Array.isArray(res)
          ? res
          : (res.data ?? []);

        this.cdr.markForCheck();
      },
      error: () => { }
    });
  }

  iniciais(nome: string): string {

    return nome
      ?.split(' ')
      .slice(0, 2)
      .map((p: string) => p[0])
      .join('')
      .toUpperCase() || '?';
  }

  formatarData(data: string | null): string {

    if (!data) return 'Não informado';

    return new Date(data).toLocaleDateString('pt-BR');
  }
}