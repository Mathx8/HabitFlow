import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
})

export class ChatComponent implements OnInit {

  chats: any[] = [];

  selectedChat: any = null;

  mensagem = '';

  loading = false;

  modalNovoChat = false;

  usernameNovoChat = '';

  nomeNovoChat = '';

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.carregarChats();
  }

  carregarChats() {

    this.api.getChats()
      .subscribe({

        next: (res: any) => {

          console.log(res);

          this.chats = res.map((chat: any) => {

            const ultimaMensagem =
              chat.mensagens?.length > 0
                ? chat.mensagens[chat.mensagens.length - 1]
                : null;

            return {

                id: chat.id,

                nome:
                  chat.nome ||
                  chat.usuarios?.[0]?.nome ||
                  'Chat',

                username:
                  chat.usuarios?.[0]?.username || '',

                online: true,

              hora:
                ultimaMensagem?.dataCriacao
                  ? new Date(ultimaMensagem.dataCriacao)
                    .toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '',

              ultimaMensagem:
                ultimaMensagem?.conteudo || 'Nenhuma mensagem',

              naoLidas: 0,

              mensagens:
                chat.mensagens?.map((m: any) => ({

                  texto: m.conteudo,

                  hora:
                    m.dataCriacao
                      ? new Date(m.dataCriacao)
                        .toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '',

                  autor:
                    m.usuarioId === localStorage.getItem('userId')
                      ? 'eu'
                      : 'outro'

                })) || []

            };

          });

        },

        error: (err: any) => {
          console.log(err);
        }

      });

  }

  selecionarChat(chat: any) {

    this.selectedChat = chat;

    this.api.buscarMensagens(chat.id)
      .subscribe({

        next: (res: any) => {

          this.selectedChat.mensagens = res.map((m: any) => ({

            texto: m.conteudo,

            hora:
              m.criadoEm
                ? new Date(m.criadoEm)
                  .toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '',

            autor:
              m.usuarioId === localStorage.getItem('userId')
                ? 'eu'
                : 'outro'

          }));

        },

        error: (err: any) => {
          console.log(err);
        }

      });

  }

  enviarMensagem() {

    if (!this.mensagem.trim()) return;

    if (!this.selectedChat) return;

    this.loading = true;

    this.api
      .enviarMensagem(
        this.selectedChat.id,
        this.mensagem
      )
      .subscribe({

        next: (res: any) => {

          console.log(res);

          if (!this.selectedChat.mensagens) {
            this.selectedChat.mensagens = [];
          }

          this.selectedChat.mensagens.push({

            texto: res.conteudo || this.mensagem,

            hora: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }),

            autor: 'eu'

          });

          this.selectedChat.ultimaMensagem = this.mensagem;

          this.selectedChat.hora = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          this.mensagem = '';

          this.loading = false;
        },

        error: (err: any) => {

          console.log(err);

          this.loading = false;
        }

      });

  }

  abrirModalNovoChat() {
    this.modalNovoChat = true;
  }

  fecharModalNovoChat() {

    this.modalNovoChat = false;

    this.usernameNovoChat = '';

    this.nomeNovoChat = '';

  }

  criarNovoChat() {

    if (!this.usernameNovoChat.trim()) {
      alert('Digite um username');
      return;
    }

    this.api.criarChat(
      this.nomeNovoChat,
      [this.usernameNovoChat]
    )
      .subscribe({

        next: (res: any) => {

          console.log(res);

          const novoChat = {

            id: res.id,

            nome:
              res.nome ||
              this.nomeNovoChat ||
              this.usernameNovoChat,

            username: this.usernameNovoChat,

            online: true,

            hora: '',

            ultimaMensagem: 'Nenhuma mensagem',

            naoLidas: 0,

            mensagens: []

          };

          this.chats.unshift(novoChat);

          this.selectedChat = novoChat;

          this.fecharModalNovoChat();

        },

        error: (err: any) => {

          console.log(err);

          alert(
            err?.error || 'Erro ao criar chat'
          );

        }

      });

  }

}