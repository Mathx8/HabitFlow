import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Parallax } from '../../services/parallax';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  senha = '';

  constructor(private auth: Auth, public parallax: Parallax) { }

  goToHome() {
    this.auth.goToHome();
  }

  onLogin() {
    this.auth.login(this.email, this.senha);
  }

  goToRegister() {
    this.auth.goToRegister();
  }
}
