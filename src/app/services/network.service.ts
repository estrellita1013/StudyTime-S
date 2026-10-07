import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  online$ = new BehaviorSubject<boolean>(true);

  constructor() { this.init(); }

  private async init() {
    const status = await Network.getStatus();           // estado inicial
    this.online$.next(status.connected);
    Network.addListener('networkStatusChange', s => this.online$.next(s.connected)); // cambios en vivo
  }
}