import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://habitflow-backend-1ybb.onrender.com';

  private notificacoesSubject = new BehaviorSubject<any[]>([]);
  notificacoes$ = this.notificacoesSubject.asObservable();

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

  createHabitoCompartilhado(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/habitos-compartilhados`, data);
  }

  convidarUsuarioParaHabito(id: string, username: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/habitos-compartilhados/${id}/convidar`, { username });
  }

  aceitarConvite(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/habitos-compartilhados/${id}/aceitar`, {});
  }

  recusarConvite(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/habitos-compartilhados/${id}/recusar`, {});
  }

  getConvites(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/habitos-compartilhados/convites`);
  }

  getProgessoHabitoCompartilhado(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/habitos-compartilhados/${id}/progresso`);
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


  getNotificacao(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Notificacao`);
  }

  getNotificacaoNaoLidas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Notificacao/nao-lidas`).pipe(
      tap((res: any) => {
        const data = Array.isArray(res) ? res : (res.data ?? []);
        this.notificacoesSubject.next(data);
      })
    );
  }

  marcarNotificacaoComoLida(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/Notificacao/${id}/ler`, {}).pipe(
      tap(() => {
        const atual = this.notificacoesSubject.value;
        this.notificacoesSubject.next(atual.filter(n => n.id !== id));
      })
    );
  }

  marcarTodasNotificacoesComoLidas(): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/Notificacao/ler-todas`, {}).pipe(
      tap(() => {
        this.notificacoesSubject.next([]);
      })
    );
  }

  carregarNotificacoes() {
    this.getNotificacaoNaoLidas().subscribe();
  }
  

  getFriends(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Amizade/amigos`);
  }

  getPendentes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Amizade/pendentes`);
  }

  getEnviados(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Amizade/enviados`);
  }

  sendFriendRequest(username: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Amizade`, {
      username
    });
  }

  responderAmizade(amizadeId: string, aceitar: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Amizade/responder`, {
      amizadeId,
      aceitar
    });
  }

  bloquearAmizade(amizadeId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Amizade/bloquear/${amizadeId}`, {});
  }

   getChats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/chat`);
  }

  criarChat(nome: string, usernames: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/chat`, {
      tipo: 0,
      nome,
      usernames
    });
  }

  sairDoChat(chatId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/chat/${chatId}/sair`, {});
  }

  deletarChat(chatId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/chat/${chatId}`);
  }

  // =========================
  // MENSAGENS
  // =========================

  enviarMensagem(chatId: string, conteudo: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/mensagem/${chatId}`,
      JSON.stringify(conteudo),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
  buscarMensagens(chatId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/mensagem/${chatId}`);
  }
}