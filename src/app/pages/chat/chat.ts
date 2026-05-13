import { Component, OnInit, afterNextRender, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

type Tab = 'amigos' | 'chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
})
export class ChatComponent implements OnInit {

  // ── Abas ──────────────────────────────────────────────
  activeTab: Tab = 'amigos';

  // ── Amigos ────────────────────────────────────────────
  friends: any[] = [];
  pendentes: any[] = [];
  enviados: any[] = [];
  username = '';
  loadingRequest = false;

  // ── Chat ──────────────────────────────────────────────
  chats: any[] = [];
  selectedChat: any = null;
  mensagem = '';
  loadingMsg = false;
  showSidebar = true; // mobile: alterna lista ↔ conversa

  // ── Modal novo chat ───────────────────────────────────
  modalNovoChat = false;
  nomeNovoChat = '';
  usernameNovoChat = '';

  // ── Menu chat ───────────────────────────────────
  menuChatAberto = false;

  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadFriends();
    this.loadChats();
  }

  // ── ABAS ──────────────────────────────────────────────
  setTab(tab: Tab) {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  // ── AMIGOS ────────────────────────────────────────────
  loadFriends() {
    this.api.getFriends().subscribe({
      next: (res: any) => { this.friends = Array.isArray(res) ? res : (res.data ?? []); this.cdr.markForCheck(); },
      error: () => { }
    });
    this.api.getPendentes().subscribe({
      next: (res: any) => { this.pendentes = Array.isArray(res) ? res : (res.data ?? []); this.cdr.markForCheck(); },
      error: () => { }
    });
    this.api.getEnviados().subscribe({
      next: (res: any) => {
        this.enviados = Array.isArray(res) ? res : (res.data ?? []);
        this.cdr.markForCheck();
      },
      error: () => { }
    });
  }

  sendRequest() {
    if (!this.username.trim()) return;
    this.loadingRequest = true;
    this.api.sendFriendRequest(this.username).subscribe({
      next: () => { this.username = ''; this.loadingRequest = false; this.loadFriends(); this.cdr.markForCheck(); },
      error: () => { this.loadingRequest = false; }
    });
  }

  aceitar(id: string) {
    this.api.responderAmizade(id, true).subscribe({ next: () => this.loadFriends(), error: () => { } });
  }

  recusar(id: string) {
    this.api.responderAmizade(id, false).subscribe({ next: () => this.loadFriends(), error: () => { } });
  }

  bloquear(id: string) {
    this.api.bloquearAmizade(id).subscribe({
      next: () => {
        this.loadFriends();
      },
      error: () => { }
    });
  }

  // ── CHATS ─────────────────────────────────────────────
  loadChats() {
    this.api.getChats().subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res) ? res : (res.data ?? []);
        this.chats = lista.map((chat: any) => this.mapChat(chat));
        this.cdr.markForCheck();
      },
      error: () => { }
    });
  }

  mapChat(chat: any) {
    const ultima = chat.mensagens?.at(-1) ?? null;
    const userId = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('usuario') || '{}')?.id
      : null;
    return {
      id: chat.id,
      nome: chat.nome || chat.usuarios?.[0]?.nome || 'Chat',
      username: chat.usuarios?.[0]?.username || '',
      online: true,
      hora: ultima?.dataCriacao ? new Date(ultima.dataCriacao).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      ultimaMensagem: ultima?.conteudo || 'Nenhuma mensagem',
      naoLidas: 0,
      mensagens: (chat.mensagens ?? []).map((m: any) => this.mapMsg(m, userId)),
    };
  }

  mapMsg(m: any, userId: string | null) {
    console.log('MSG USER:', m.usuarioId);
    console.log('LOCAL USER:', userId);

    return {
      texto: m.conteudo,
      hora: (m.dataCriacao || m.criadoEm)
        ? new Date(m.dataCriacao || m.criadoEm)
          .toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        : '',
      autor: String(m.usuarioId) === String(userId)
        ? 'eu'
        : 'outro',
    };
  }

  selecionarChat(chat: any) {
    this.menuChatAberto = false;

    const userId = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('usuario') || '{}')?.id
      : null;

    this.selectedChat = chat;
    this.showSidebar = false;
    
    this.api.buscarMensagens(chat.id).subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res) ? res : (res.data ?? []);
        this.selectedChat.mensagens = lista.map((m: any) => this.mapMsg(m, userId));
        this.cdr.markForCheck();
        setTimeout(() => this.scrollBottom(), 50);
      },
      error: () => { }
    });
  }

  enviarMensagem() {
    if (!this.mensagem.trim() || !this.selectedChat) return;
    this.loadingMsg = true;
    this.api.enviarMensagem(this.selectedChat.id, this.mensagem).subscribe({
      next: (res: any) => {
        this.selectedChat.mensagens ??= [];
        this.selectedChat.mensagens.push({
          texto: res.conteudo || this.mensagem,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          autor: 'eu',
        });
        this.selectedChat.ultimaMensagem = this.mensagem;
        this.mensagem = '';
        this.loadingMsg = false;
        this.cdr.markForCheck();
        setTimeout(() => this.scrollBottom(), 50);
      },
      error: () => { this.loadingMsg = false; }
    });
  }

  sairChat(chatId: string) {
    this.api.sairDoChat(chatId).subscribe({
      next: () => {
        this.chats = this.chats.filter(c => c.id !== chatId);

        if (this.selectedChat?.id === chatId) {
          this.selectedChat = null;
        }

        this.cdr.markForCheck();
      },
      error: () => { }
    });
  }

  deletarChat(chatId: string) {
    this.api.deletarChat(chatId).subscribe({
      next: () => {
        this.chats = this.chats.filter(c => c.id !== chatId);

        if (this.selectedChat?.id === chatId) {
          this.selectedChat = null;
        }

        this.cdr.markForCheck();
      },
      error: () => { }
    });
  }

  scrollBottom() {
    this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }

  // ── MODAL NOVO CHAT ───────────────────────────────────
  abrirModal() { this.modalNovoChat = true; }
  fecharModal() { this.modalNovoChat = false; this.nomeNovoChat = ''; this.usernameNovoChat = ''; }

  criarNovoChat() {
    if (!this.usernameNovoChat.trim()) return;
    this.api.criarChat(this.nomeNovoChat, [this.usernameNovoChat]).subscribe({
      next: (res: any) => {
        const novo = { id: res.id, nome: res.nome || this.nomeNovoChat || this.usernameNovoChat, username: this.usernameNovoChat, online: true, hora: '', ultimaMensagem: 'Nenhuma mensagem', naoLidas: 0, mensagens: [] };
        this.chats.unshift(novo);
        this.selectedChat = novo;
        this.showSidebar = false;
        this.fecharModal();
        this.cdr.markForCheck();
      },
      error: () => { }
    });
  }

  // ── HELPERS ───────────────────────────────────────────
  iniciais(nome: string) {
    return nome?.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() || '?';
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensagem();
    }
  }
}