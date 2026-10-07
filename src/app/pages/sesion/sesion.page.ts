import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon,
  NavController, ToastController,
} from '@ionic/angular';
import { ACTIVITIES } from '../../models/models';
import { StorageService } from '../../services/storage.service';
import { TimerService } from '../../services/timer.service';
import { SoundPlayerComponent } from '../../components/sound-player/sound-player.components';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, SoundPlayerComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/estudiar" text=""></ion-back-button></ion-buttons>
        <ion-title>Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="center">
        <div class="st-label">{{ timer.subject() || 'Sin materia' }}{{ timer.topic() ? ' · ' + timer.topic() : '' }}</div>
        <h1>{{ label }}</h1>
        <div class="clock" [class.done]="timer.seconds() >= timer.targetMin() * 60">{{ timer.display() }}</div>
        <div class="chip">Duración objetivo: {{ timer.targetMin() }} min</div>

        <div class="controls">
          <ion-button class="ctl" fill="outline" color="dark" (click)="timer.pause()">
            <ion-icon slot="icon-only" name="pause-outline"></ion-icon>
          </ion-button>
          <ion-button class="ctl" (click)="timer.start()">
            <ion-icon slot="icon-only" name="play-outline"></ion-icon>
          </ion-button>
          <ion-button class="ctl" fill="outline" color="dark" (click)="stop()">
            <ion-icon slot="icon-only" name="stop-outline"></ion-icon>
          </ion-button>
        </div>
      </div>

      <app-sound-player></app-sound-player>
    </ion-content>`,
  styles: [`
    .center { text-align: center; margin-top: 24px; }
    h1 { margin: 4px 0 8px; }
    .clock { font-size: 84px; font-weight: 800; font-variant-numeric: tabular-nums; }
    .clock.done { color: var(--st-emerald); }
    .chip { display: inline-block; background: var(--st-gray-200); color: var(--st-gray-400);
            padding: 6px 14px; border-radius: 999px; font-size: 14px; }
    .controls { display: flex; justify-content: center; gap: 20px; margin: 24px 0; }
    .ctl { width: 72px; height: 72px; --border-radius: 50%; --padding-start: 0; --padding-end: 0; }
  `],
})
export class SessionPage {
  constructor(
    public timer: TimerService, private storage: StorageService,
    private toast: ToastController, private nav: NavController,
  ) {}

  get label() { return ACTIVITIES.find(a => a.key === this.timer.type())?.label; }

  // Detener = guardar la sesión, reiniciar el reloj y volver al Dashboard
  async stop() {
    const secs = this.timer.seconds();
    const session = {
      id: Date.now().toString(),
      type: this.timer.type(),
      seconds: secs,
      targetMin: this.timer.targetMin(),
      date: new Date().toISOString(),
      subject: this.timer.subject() || undefined,
      topic: this.timer.topic() || undefined,
    };
    this.timer.reset();
    if (secs >= 5) { // ignora sesiones de menos de 5 segundos
      await this.storage.addSession(session);
      const t = await this.toast.create({ message: 'Sesión guardada', duration: 1800, color: 'dark' });
      await t.present();
    }
    this.nav.navigateRoot('/tabs/hoy');
  }
}