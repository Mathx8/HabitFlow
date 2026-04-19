import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

interface Habito {
  id: string;
  nome: string;
  descricao?: string;
  icone?: string;
  cor?: string;
  completoHoje?: boolean;
  recordeId?: string;
}

interface NovoHabito {
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  tipo: string;
  frequencia: number;
  meta: number;
  unidade: string;
  horaPreferida: string;
  notificacaoAtiva: boolean;
  prioridade: string;
  dataInicio: string;
  dataFim: string;
}

@Component({
  selector: 'app-habitos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitos.html',
})

export class Habitos implements OnInit {

  habitos: Habito[] = [];
  isLoading = true;
  error = '';

  showModal = false;
  isSaving = false;

  form: NovoHabito = this.formVazio();
  loadingToggle = new Set<string>();

  readonly CORES = ['#34d399', '#60a5fa', '#f97316', '#a78bfa', '#f43f5e', '#facc15'];
  readonly TIPOS = ['Sim/Não', 'Contagem', 'Duração'];
  readonly PRIORIDADES = ['baixa', 'media', 'alta'];
  readonly ICONES = ['💧', '🏋️', '📚', '🧘', '🍎', '💊', '🚶', '✍️', '🎯', '😴'];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadHabitos();
  }

  private loading = false;

  loadHabitos() {
    if (this.loading) return;

    this.loading = true;
    this.isLoading = true;

    this.api.getHabitos().subscribe({
      next: (res) => {
        const habitos: Habito[] = Array.isArray(res) ? res : (res.data ?? []);

        const hoje = new Date().toDateString();
        let pendentes = habitos.length;

        if (pendentes === 0) {
          this.habitos = [];
          this.isLoading = false;
          this.loading = false;
          return;
        }

        habitos.forEach(h => {
          this.api.getHabitoRecordes(h.id).subscribe({
            next: (recordes) => {
              const lista: any[] = Array.isArray(recordes) ? recordes : (recordes.data ?? []);
              const recordeHoje = lista.find(r => {
                const dataRecorde = r.data?.split('T')[0];
                const dataHoje = new Date().toISOString().split('T')[0];
                return dataRecorde === dataHoje && r.concluido;
              });


              if (recordeHoje) {
                h.completoHoje = true;
                h.recordeId = recordeHoje.id ?? recordeHoje._id;
              }

              pendentes--;
              if (pendentes === 0) {
                this.habitos = habitos;
                this.isLoading = false;
                this.loading = false;
                this.cdr.markForCheck();
              }
            },
            error: () => {
              pendentes--;
              if (pendentes === 0) {
                this.habitos = habitos;
                this.isLoading = false;
                this.loading = false;
                this.cdr.markForCheck();
              }
            }
          });
        });
      },
      error: () => {
        this.error = 'Erro ao carregar hábitos.';
        this.isLoading = false;
        this.loading = false;
      }
    });
  }

  formVazio(): NovoHabito {
    return {
      nome: '',
      descricao: '',
      cor: '#34d399',
      icone: '✅',
      tipo: 'Sim/Não',
      frequencia: 1,
      meta: 1,
      unidade: '',
      horaPreferida: '08:00',
      notificacaoAtiva: false,
      prioridade: 'media',
      dataInicio: new Date().toISOString(),
      dataFim: '',
    };
  }

  openModal() {
    this.form = this.formVazio();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  criarHabito() {
    if (!this.form.nome.trim()) return;

    this.isSaving = true;
    this.error = '';

    const payload = {
      ...this.form,
      nome: this.form.nome.trim(),
      dataInicio: new Date().toISOString(),
      dataFim: this.form.dataFim ? new Date(this.form.dataFim).toISOString() : null,
    };

    this.api.createHabito(payload).subscribe({
      next: (res) => {
        this.habitos.unshift(res.data ?? res);
        this.isSaving = false;
        this.closeModal();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSaving = false;
        this.error = err.error?.message ?? 'Erro ao criar hábito.';
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
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'Erro ao desfazer hábito.';
          this.loadingToggle.delete(habito.id);
        }
      });
    } else {
      this.api.createHabitoRecorde({ habitId: habito.id, quantidade: 1, concluido: true, observacao: '' }).subscribe({
        next: (res) => {
          habito.completoHoje = true;
          habito.recordeId = res.data?.id ?? res.id;
          this.loadingToggle.delete(habito.id);
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'Erro ao concluir hábito.';
          this.loadingToggle.delete(habito.id);
        }
      });
    }
  }


  removerHabito(id: string) {
    this.api.deleteHabito(id).subscribe({
      next: () => {
        this.habitos = this.habitos.filter(h => h.id !== id);
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Erro ao remover hábito.';
      }
    });
  }

  get habitosPendentes() {
    return this.habitos.filter(h => !h.completoHoje);
  }

  get habitosConcluidos() {
    return this.habitos.filter(h => h.completoHoje);
  }
}