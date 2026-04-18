import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Icons } from '../../services/icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
})

export class Navbar {
  constructor(private auth: Auth, public icons: Icons) { }

  logout() {
    this.auth.logout();
  }

}
