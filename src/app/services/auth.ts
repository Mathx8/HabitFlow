import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class Auth {

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  login(email: string, password: string) {
    // TODO: chamar API
    console.log('Login:', email, password);
    this.goToDashboard();
  }

  register(data: { firstName: string; email: string; password: string }) {
    // TODO: chamar API
    console.log('Register:', data);
    this.goToDashboard();
  }

  logout() {
    // TODO: limpar token/sessão
    this.goToLogin();
  }
}