import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { Auth } from '../../services/auth';
import { Parallax } from '../../services/parallax';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirm-email.html',
})
export class ConfirmEmail implements OnInit, OnDestroy {
  email = '';
  codigo = '';
  isLoading = false;
  error = '';
  success = '';
  resendCooldown = 0;

  private cooldownInterval?: ReturnType<typeof setInterval>;

  constructor(
    private api: ApiService,
    public auth: Auth,
    public parallax: Parallax,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.email =
      this.route.snapshot.queryParams['email'] || history.state?.email || '';

    if (!this.email) {
      this.router.navigate(['/register']);
    }
  }

  ngOnDestroy() {
    clearInterval(this.cooldownInterval);
  }

  onConfirm() {
    if (!this.codigo.trim()) return;

    this.isLoading = true;
    this.error = '';

    this.api.confirmEmail(this.email, this.codigo).subscribe({
      next: () => {
        this.auth.goToLogin();
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Código inválido ou expirado.';
        this.isLoading = false;
      },
    });
  }

  onResend() {
    if (this.resendCooldown > 0) return;

    this.error = '';

    this.api.reenviarCodigo(this.email).subscribe({
      next: () => {
        this.success = 'Novo código enviado para o seu e-mail.';
        this.startCooldown();
        setTimeout(() => (this.success = ''), 4000);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Erro ao reenviar código.';
      },
    });
  }

  startCooldown() {
    this.resendCooldown = 60;
    this.cooldownInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) clearInterval(this.cooldownInterval);
    }, 1000);
  }
}