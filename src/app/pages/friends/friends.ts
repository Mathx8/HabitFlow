import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './friends.html',
  styleUrl: './friends.css'
})
export class FriendsComponent implements OnInit {

  friends: any[] = [];
  pendentes: any[] = [];

  username = '';

  loading = false;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {

    this.api.getFriends()
      .subscribe({
        next: (res: any) => {
          this.friends = res;
        },

        error: (err: any) => {
          console.log(err);
        }
      });

    this.api.getPendentes()
      .subscribe({
        next: (res: any) => {
          this.pendentes = res;
        },

        error: (err: any) => {
          console.log(err);
        }
      });

  }

  sendRequest() {

    if (!this.username.trim()) return;

    this.loading = true;

    this.api
      .sendFriendRequest(this.username)
      .subscribe({

        next: (res: any) => {

          alert(res.mensagem);

          this.username = '';

          this.loading = false;
        },

        error: (err: any) => {

          alert(
            err.error?.mensagem ||
            'Erro ao enviar solicitação'
          );

          this.loading = false;
        }
      });
  }

  aceitar(id: string) {

    this.api
      .responderAmizade(id, true)
      .subscribe({

        next: () => {
          this.loadData();
        },

        error: (err: any) => {
          console.log(err);
        }
      });

  }

  recusar(id: string) {

    this.api
      .responderAmizade(id, false)
      .subscribe({

        next: () => {
          this.loadData();
        },

        error: (err: any) => {
          console.log(err);
        }
      });

  }

}