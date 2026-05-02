import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../header/header';
import { Navbar } from '../../components/navbar/navbar';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, Header, Navbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  constructor(private api: ApiService) { }
  ngOnInit() {
    this.api.carregarNotificacoes();

    setInterval(() => {
      this.api.carregarNotificacoes();
    }, 120000);
  }
}
