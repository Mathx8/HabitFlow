import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { ApiService } from '../../services/api';
import { Parallax } from '../../services/parallax';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
})
export class Register {
  nome = '';
  username = '';
  email = '';
  senha = '';
  confirmPassword = '';
  acceptedTerms = false;
  loading = false;
  error = '';

  strengthColors = Array(4).fill('rgba(255,255,255,0.08)');
  strengthLabel = 'Digite uma senha';
  strengthLabelColor = '#6b7280';

  private readonly COLORS = ['#ef4444', '#f97316', '#eab308', '#34d399'];
  private readonly LABELS = ['Muito fraca', 'Fraca', 'Média', 'Forte'];

  constructor(private auth: Auth, private api: ApiService, public parallax: Parallax) { }

  checkStrength() {
    const v = this.senha;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const inactive = 'rgba(255,255,255,0.08)';
    this.strengthColors = Array(4).fill(null).map((_, i) =>
      i < score ? this.COLORS[score - 1] : inactive
    );

    if (!v.length) {
      this.strengthLabel = 'Digite uma senha';
      this.strengthLabelColor = '#6b7280';
    } else {
      this.strengthLabel = this.LABELS[score - 1] ?? 'Muito fraca';
      this.strengthLabelColor = this.COLORS[score - 1] ?? this.COLORS[0];
    }
  }

  onRegister() {
    if (!this.acceptedTerms) {
      alert('Aceite os termos para continuar.');
      return;
    }
    if (this.senha !== this.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.register(this.nome, this.username, this.email, this.senha).subscribe({
      next: () => {
        // API envia e-mail de confirmação — redireciona para tela de código
        this.auth.goToConfirm(this.email);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Erro ao criar conta. Tente novamente.';
        this.loading = false;
      }
    });
  }


  goToHome() {
    this.auth.goToHome();
  }

  goToLogin() {
    this.auth.goToLogin();
  }
}