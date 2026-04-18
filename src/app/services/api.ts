import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://habitflow-backend-1ybb.onrender.com';

  constructor(private http: HttpClient) { }

  register(nome: string, username: string, email: string, senha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Auth/register`, { nome, username, email, senha });
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Auth/login`, { email, senha });
  }

  confirmEmail(email: string, codigo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Auth/confirmar-email`, { email, codigo });
  }

  reenviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Auth/reenviar-codigo`, { email });
  }

  createHabito(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Habitos`, data);
  }

  getHabitos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Habitos`);
  }

  getHabitoById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Habitos/${id}`);
  }

  updateHabito(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/Habitos/${id}`, data);
  }

  deleteHabito(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/Habitos/${id}`);
  }
  
}