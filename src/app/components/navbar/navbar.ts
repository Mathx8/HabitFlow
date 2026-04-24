import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Icons } from '../../services/icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})

export class Navbar {
  menuOpen = false;

  constructor(private auth: Auth, public icons: Icons) { }

  get usuario() {
    return this.auth.getUser();
  }

  get inicial(): string {
    const user = this.auth.getUser();
    return user?.nome?.charAt(0)?.toUpperCase()
      ?? user?.username?.charAt(0)?.toUpperCase()
      ?? '?';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickFora(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('app-navbar')) {
      this.menuOpen = false;
    }
  }

  logout() {
    this.auth.logout();
  }

}
