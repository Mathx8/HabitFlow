import { Component, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

interface DiaCalendario {
  data: string;
  concluido: boolean;
  quantidade: number;
}

interface Semana {
  dias: (DiaCalendario | null)[];
}

@Component({
  selector: 'app-habito-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.html',
})
export class Calendario implements OnChanges {

  @Input() habitoId!: string;
  @Input() habitoNome = '';

  semanas: Semana[] = [];
  isLoading = false;
  totalConcluidos = 0;
  tooltip: { texto: string; x: number; y: number } | null = null;

  readonly MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  readonly DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  mesesVisiveis: { label: string; colIndex: number }[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    if (this.habitoId) this.loadCalendario();
  }

  loadCalendario() {
    this.isLoading = true;

    this.api.getHabitoCalendario(this.habitoId).subscribe({
      next: (res) => {
        const registros: any[] = Array.isArray(res) ? res : (res.data ?? []);
        this.buildCalendario(registros);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.buildCalendario([]);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  buildCalendario(registros: any[]) {
    // Mapeia registros por data
    const mapaRegistros = new Map<string, DiaCalendario>();
    for (const r of registros) {
      const data = (r.data ?? r.createdAt ?? '').split('T')[0];
      if (data) {
        mapaRegistros.set(data, {
          data,
          concluido: r.concluido ?? false,
          quantidade: r.quantidade ?? 0,
        });
      }
    }

    // Últimas 52 semanas (364 dias) + dias restantes desta semana
    const hoje = new Date();
    const diaSemanaHoje = hoje.getDay(); // 0=Dom

    // Começa no domingo mais antigo que cubra 52 semanas
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - 52 * 7 - diaSemanaHoje);

    const semanas: Semana[] = [];
    let semanaAtual: (DiaCalendario | null)[] = [];
    this.totalConcluidos = 0;

    const cursor = new Date(inicio);

    while (cursor <= hoje) {
      const dataStr = cursor.toISOString().split('T')[0];
      const registro = mapaRegistros.get(dataStr);

      const dia: DiaCalendario = registro ?? {
        data: dataStr,
        concluido: false,
        quantidade: 0,
      };

      if (dia.concluido) this.totalConcluidos++;

      semanaAtual.push(dia);

      if (semanaAtual.length === 7) {
        semanas.push({ dias: semanaAtual });
        semanaAtual = [];
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    // Preenche a última semana incompleta com nulls
    if (semanaAtual.length > 0) {
      while (semanaAtual.length < 7) semanaAtual.push(null);
      semanas.push({ dias: semanaAtual });
    }

    this.semanas = semanas;
    this.buildMesesVisiveis();
  }

  buildMesesVisiveis() {
    this.mesesVisiveis = [];
    let mesAtual = -1;

    this.semanas.forEach((semana, colIndex) => {
      const primeiroDia = semana.dias.find(d => d !== null);
      if (!primeiroDia) return;
      const mes = new Date(primeiroDia.data).getMonth();
      if (mes !== mesAtual) {
        mesAtual = mes;
        this.mesesVisiveis.push({ label: this.MESES[mes], colIndex });
      }
    });
  }

  getCor(dia: DiaCalendario | null): string {
    if (!dia || !dia.concluido) return 'rgba(255,255,255,0.06)';
    return '#34d399';
  }

  getOpacity(dia: DiaCalendario | null): number {
    if (!dia || !dia.concluido) return 1;
    const q = dia.quantidade ?? 1;
    if (q >= 4) return 1;
    if (q === 3) return 0.85;
    if (q === 2) return 0.65;
    return 0.45;
  }

  showTooltip(event: MouseEvent, dia: DiaCalendario | null) {
    if (!dia) return;
    const d = new Date(dia.data + 'T12:00:00');
    const label = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    const status = dia.concluido ? `✅ Concluído (${dia.quantidade}x)` : '❌ Não realizado';
    this.tooltip = { texto: `${label} — ${status}`, x: event.offsetX, y: event.offsetY };
  }

  hideTooltip() {
    this.tooltip = null;
  }
}