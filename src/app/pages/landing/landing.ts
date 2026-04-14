import { Component } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.html',
})
export class Landing {
  constructor(private auth: Auth) { }

  goToLogin() {
    this.auth.goToLogin();
  }

  goToRegister() {
    this.auth.goToRegister();
  }

  mouseX = 0;
  mouseY = 0;

  onMouseMove(event: MouseEvent) {
    const { innerWidth, innerHeight } = window;

    // normaliza entre -1 e 1
    this.mouseX = (event.clientX / innerWidth - 0.5) * 2;
    this.mouseY = (event.clientY / innerHeight - 0.5) * 2;
  }

  getTransform(xFactor: number, yFactor: number) {
    const x = this.mouseX * xFactor;
    const y = this.mouseY * yFactor;

    return `translate(${x}px, ${y}px)`;
  }
}