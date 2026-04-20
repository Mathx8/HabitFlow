import { Component, afterNextRender, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  tipo: number;
  valorMeta: number;
  desbloqueada?: boolean;
}

@Component({
  selector: 'app-conquistas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conquistas.html',
})
export class Conquistas {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  conquistas: Conquista[] = [];
  isLoading = true;

  constructor() {
    afterNextRender(() => this.loadConquistas());
  }

  get total() { return this.conquistas.length; }
  get desbloqueadas() { return this.conquistas.filter(c => c.desbloqueada).length; }
  get progresso() {
    if (!this.total) return 0;
    return Math.round((this.desbloqueadas / this.total) * 100);
  }
  get unlocked() { return this.conquistas.filter(c => c.desbloqueada); }
  get locked() { return this.conquistas.filter(c => !c.desbloqueada); }

  loadConquistas() {
    this.isLoading = true;

    this.api.getConquistas().subscribe({
      next: (todasRes) => {
        const todas: Conquista[] = Array.isArray(todasRes) ? todasRes : (todasRes.data ?? []);

        this.api.getMinhasConquistas().subscribe({
          next: (minhasRes) => {
            const minhas: any[] = minhasRes.conquistas || [];
            const minhasIds = new Set(minhas.map(c => c.id));

            this.conquistas = todas.map(c => ({
              ...c,
              desbloqueada: minhasIds.has(c.id)
            }));

            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.conquistas = todas;
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}