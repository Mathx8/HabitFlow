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

  createHabitoRecorde(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/HabitoRecorde`, data);
  }

  getHabitoRecordes(habitId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/HabitoRecorde/${habitId}`);
  }

  getHabitoCalendario(habitId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/HabitoRecorde/${habitId}/calendario`);
  }

  getHabitoRegistro(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/HabitoRecorde/registro/${id}`);
  }

  updateHabitoRecorde(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/HabitoRecorde/${id}`, data);
  }

  deleteHabitoRecorde(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/HabitoRecorde/${id}`);
  }


  createConquista(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Conquista`, data);
  }

  getMinhasConquistas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Conquista/minhas`);
  }

  getConquistas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Conquista`);
  }

  getConquistaById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Conquista/${id}`);
  }

  updateConquista(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/Conquista/${id}`, data);
  }

  deleteConquista(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/Conquista/${id}`);
  }
  
}