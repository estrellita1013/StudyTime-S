import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonItem, IonLabel,
  IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonRefresher, IonRefresherContent, AlertController,
} from '@ionic/angular';
import { ACTIVITIES, ActivityType, Session } from '../../models/models';
import { StorageService } from '../../services/storage.service';
import { fmtHM } from '../../utils/time';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonItem, IonLabel,
    IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonRefresher, IonRefresherContent, DatePipe,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/hoy" text=""></ion-back-button></ion-buttons>
        <ion-title>Historial</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="refresh($event)"><ion-refresher-content></ion-refresher-content></ion-refresher>

      <ion-list lines="none" style="background: transparent; padding: 16px">
        @for (s of sessions; track s.id) {
          <ion-item-sliding>
            <ion-item button detail="false" (click)="edit(s)">
              <div class="st-icon-box" slot="start"><ion-icon [name]="info(s.type).icon"></ion-icon></div>
              <ion-label>
               <h2>{{ info(s.type).label }} · {{ fmt(s.seconds) }}{{ s.subject ? ' · ' + s.subject : '' }}</h2>
                <p>{{ s.date | date: 'd MMM, h:mm a' }} @if (s.note) { · {{ s.note }} }</p>
              </ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option color="dark" (click)="remove(s)"><ion-icon slot="icon-only" name="trash-outline"></ion-icon></ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        } @empty {
          <p style="text-align: center; color: var(--st-gray-400)">Aún no hay sesiones. Inicia una en la pestaña Enfoque.</p>
        }
      </ion-list>
    </ion-content>`,
  styles: [`
    ion-item { --background: #fff; --border-radius: 16px; margin-bottom: 8px; }
  `],
})
export class HistoryPage {
  sessions: Session[] = [];
  fmt = fmtHM;

  constructor(private storage: StorageService, private alert: AlertController) {}

  ionViewWillEnter() { return this.load(); }
  async load() { this.sessions = await this.storage.getSessions(); }
  async refresh(ev: any) { await this.load(); ev.target.complete(); }
  info(t: ActivityType) { return ACTIVITIES.find(a => a.key === t)!; }

  async remove(s: Session) { await this.storage.deleteSession(s.id); await this.load(); }   // Delete

  async edit(s: Session) {                                                                   // Update
    const a = await this.alert.create({
      header: 'Nota de la sesión',
      inputs: [{ name: 'note', value: s.note ?? '', placeholder: '¿Qué estudiaste?' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Guardar', handler: async (d) => { await this.storage.updateSession({ ...s, note: d.note }); await this.load(); } },
      ],
    });
    await a.present();
  }
}
