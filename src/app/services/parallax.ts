import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Parallax {

  private mouseX = signal(0);
  private mouseY = signal(0);

  onMouseMove(event: MouseEvent) {
    const { innerWidth, innerHeight } = window;
    this.mouseX.set((event.clientX / innerWidth - 0.5) * 2);
    this.mouseY.set((event.clientY / innerHeight - 0.5) * 2);
  }

  getTransform(xFactor: number, yFactor: number): string {
    return `translate(${this.mouseX() * xFactor}px, ${this.mouseY() * yFactor}px)`;
  }
}