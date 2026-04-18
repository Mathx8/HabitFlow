import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class Auth {

  constructor(private router: Router, private api: ApiService) { }

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

  goToConfirm(email: string) {
    this.router.navigate(['/confirm-email'], { queryParams: { email } });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveUser(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): { id: string; nome: string; username: string; email: string } | null {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  login(email: string, senha: string): Observable<any> {
    return this.api.login(email, senha).pipe(
      tap(res => {
        this.saveToken(res.data.token);
        this.saveUser(res.data.usuario);
      })
    );
  }

  register(nome: string, username: string, email: string, senha: string): Observable<any> {
    return this.api.register(nome, username, email, senha);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.goToLogin();
  }
}