import { Component, NgZone } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonIcon, IonList, IonItem, IonLabel, ToastController,
} from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { BleClient } from '@capacitor-community/bluetooth-le';

interface Found { id: string; name: string; rssi?: number; }

@Component({
  selector: 'app-bluetooth',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/perfil" text=""></ion-back-button></ion-buttons>
        <ion-title>Dispositivos cercanos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="st-card">
        <p>Busca dispositivos Bluetooth Low Energy a tu alrededor. En el celular se escanea durante 8 segundos; en el navegador (Chrome) se abre el selector de Bluetooth.</p>
        <ion-button expand="block" class="st-btn" [disabled]="scanning" (click)="scan()">
          <ion-icon slot="start" name="bluetooth-outline"></ion-icon>{{ scanning ? 'Buscando...' : 'Buscar dispositivos' }}
        </ion-button>
      </div>

      <ion-list lines="none" style="background: transparent; margin-top: 16px">
        @for (d of devices; track d.id) {
          <ion-item style="--background: #fff; --border-radius: 16px; margin-bottom: 8px">
            <ion-label><h3>{{ d.name }}</h3><p>{{ d.id }}</p></ion-label>
            @if (d.rssi !== undefined) { <span slot="end">{{ d.rssi }} dBm</span> }
          </ion-item>
        }
      </ion-list>
    </ion-content>`,
})
export class BluetoothPage {
  devices: Found[] = [];
  scanning = false;

  constructor(private zone: NgZone, private toast: ToastController) {}

  async scan() {
    this.devices = [];
    this.scanning = true;
    try {
      await BleClient.initialize();

      if (Capacitor.isNativePlatform()) {
        // Celular: escaneo continuo; zone.run avisa a Angular que actualice la pantalla
        await BleClient.requestLEScan({}, r => this.zone.run(() => {
          if (!this.devices.some(d => d.id === r.device.deviceId)) {
            this.devices = [...this.devices, { id: r.device.deviceId, name: r.localName || r.device.name || 'Sin nombre', rssi: r.rssi }];
          }
        }));
        setTimeout(async () => { await BleClient.stopLEScan(); this.zone.run(() => (this.scanning = false)); }, 8000);
        return;
      }

      // Navegador: Web Bluetooth muestra su propio selector
      const d = await BleClient.requestDevice();
      this.devices = [{ id: d.deviceId, name: d.name || 'Sin nombre' }];
    } catch {
      (await this.toast.create({ message: 'No se pudo usar Bluetooth. Revisa permisos y que esté activado.', duration: 2500 })).present();
    }
    this.scanning = false;
  }
}

/* esto le pertenece a Alex Santana */
