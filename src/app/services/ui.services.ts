import { ApplicationRef, Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
  private app = inject(ApplicationRef);

  // Pide a Angular que vuelva a dibujar las pantallas con los datos nuevos
  refresh() { setTimeout(() => this.app.tick()); }
}