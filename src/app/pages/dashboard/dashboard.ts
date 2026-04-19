import { Component, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { ApiService } from '../../services/api';
import { Calendario } from '../../components/calendario/calendario';

interface Habito {
  id: string;
  nome: string;
  icone?: string;
  cor?: string;
  streakAtual?: number;
  completoHoje?: boolean;
  recordeId?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Calendario],
  templateUrl: './dashboard.html',
})
export class Dashboard {

  habitos: Habito[] = [];
  isLoading = true;
  loadingToggle = new Set<string>();

  today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  constructor(
    private auth: Auth,
    private api: ApiService,
    private cdr: ChangeDetectorRef   // 👈
  ) {
    afterNextRender(() => this.loadDashboard());
  }

  get usuario() { return this.auth.getUser(); }
  get totalHabitos() { return this.habitos.length; }
  get concluidosHoje() { return this.habitos.filter(h => h.completoHoje).length; }
  get percentualHoje() {
    if (!this.totalHabitos) return 0;
    return Math.round((this.concluidosHoje / this.totalHabitos) * 100);
  }
  get melhorStreak() {
    return this.habitos.reduce((max, h) => Math.max(max, h.streakAtual ?? 0), 0);
  }

  loadDashboard() {
    this.isLoading = true;

    this.api.getHabitos().subscribe({
      next: (res) => {
        const habitos: Habito[] = Array.isArray(res) ? res : (res.data ?? []);

        if (habitos.length === 0) {
          this.habitos = [];
          this.isLoading = false;
          this.cdr.markForCheck();   // 👈
          return;
        }

        const hoje = new Date().toISOString().split('T')[0];
        let pendentes = habitos.length;

        habitos.forEach(h => {
          this.api.getHabitoRecordes(h.id).subscribe({
            next: (recordes) => {
              const lista: any[] = Array.isArray(recordes) ? recordes : (recordes.data ?? []);
              const recordeHoje = lista.find(r =>
                r.data?.split('T')[0] === hoje && r.concluido
              );
              if (recordeHoje) {
                h.completoHoje = true;
                h.recordeId = recordeHoje.id;
              }
              if (--pendentes === 0) {
                this.habitos = habitos;
                this.isLoading = false;
                this.cdr.markForCheck();   // 👈
              }
            },
            error: () => {
              if (--pendentes === 0) {
                this.habitos = habitos;
                this.isLoading = false;
                this.cdr.markForCheck();   // 👈
              }
            }
          });
        });
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();   // 👈
      }
    });
  }

  toggleCompleto(habito: Habito) {
    if (this.loadingToggle.has(habito.id)) return;
    this.loadingToggle.add(habito.id);

    if (habito.completoHoje) {
      this.api.deleteHabitoRecorde(habito.recordeId!).subscribe({
        next: () => {
          habito.completoHoje = false;
          habito.recordeId = undefined;
          this.loadingToggle.delete(habito.id);
          this.cdr.markForCheck();   // 👈
        },
        error: () => this.loadingToggle.delete(habito.id)
      });
    } else {
      this.api.createHabitoRecorde({
        habitId: habito.id, quantidade: 1, concluido: true, observacao: ''
      }).subscribe({
        next: (res) => {
          habito.completoHoje = true;
          habito.recordeId = res?.data?.id ?? res?.id;
          this.loadingToggle.delete(habito.id);
          this.cdr.markForCheck();   // 👈
        },
        error: (err) => {
          if (err.error?.mensagem?.includes('já registrado')) {
            habito.completoHoje = true;
          }
          this.loadingToggle.delete(habito.id);
          this.cdr.markForCheck();   // 👈
        }
      });
    }
  }
}