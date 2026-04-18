import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Parallax } from '../../services/parallax';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  senha = '';
  loading = false;
  error = '';

  constructor(private auth: Auth, private api: ApiService, public parallax: Parallax) { }

  goToHome() {
    this.auth.goToHome();
  }

  onLogin() {
    this.loading = true;
    this.error = '';

    this.api.login(this.email, this.senha).subscribe({
      next: (res) => {
        this.auth.saveToken(res.data.token);
        this.auth.saveUser(res.data.usuario);
        this.auth.goToDashboard();
      },
      error: (err) => {
        this.error = err.error?.message ?? 'E-mail ou senha incorretos.';
        this.loading = false;
      }
    });
  }

  goToRegister() {
    this.auth.goToRegister();
  }
}
