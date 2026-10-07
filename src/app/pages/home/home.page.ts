import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent,
  IonBadge, IonIcon, IonSpinner,
} from '@ionic/angular';
import { ProgressRingComponent } from '../../components/progress-ring/progress-ring.components';
import { NetworkService } from '../../services/network.service';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';
import { TimerService } from '../../services/timer.service';
import { Tip } from '../../models/models';
import { fmtHM, startOfToday } from '../../utils/time';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent,
    IonBadge, IonIcon, IonSpinner, RouterLink, AsyncPipe, ProgressRingComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
        <ion-badge slot="end" style="margin-right:16px" [color]="(net.online$ | async) ? 'primary' : 'dark'">
          {{ (net.online$ | async) ? 'Online' : 'Offline' }}
        </ion-badge>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" (ionRefresh)="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <p class="hi">Hola, {{ name }}</p>
      <app-progress-ring [value]="today / goal">
        <div class="big">{{ fmt(today) }}</div>
        <div class="sub">de {{ goal / 3600 }}h hoy</div>
      </app-progress-ring>
      <p class="sub center">{{ today >= goal ? '¡Meta cumplida, excelente trabajo!' : '¡Vas por buen camino! Falta poco para tu meta' }}</p>

      @if (timer.seconds() > 0) {
        <div class="st-card live" routerLink="/sesion">
          <div><div class="st-label">Sesión en curso</div><strong>{{ timer.display() }}</strong></div>
          <span class="link">Volver</span>
        </div>
      }

      <div class="grid">
        @for (m of menu; track m.url) {
          <div class="st-card tile" [routerLink]="m.url">
            <div class="st-icon-box"><ion-icon [name]="m.icon"></ion-icon></div>
            <strong>{{ m.label }}</strong>
          </div>
        }
      </div>

      <div class="st-label" style="margin: 28px 0 8px">Consejo del día</div>
      @if (loading && !tips.length) { <ion-spinner name="crescent" color="primary"></ion-spinner> }
      @if (error) { <p class="sub">No se pudo cargar el consejo.</p> }
      @for (t of tips; track t.id) {
        <div class="st-card"><p style="margin: 0">{{ t.body }}</p></div>
      }
    </ion-content>`,
  styles: [`
    .hi { font-size: 20px; font-weight: 600; }
    .big { font-size: 44px; font-weight: 800; }
    .sub { color: var(--st-gray-400); }
    .center { text-align: center; margin: 16px 0 24px; }
    .live { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; cursor: pointer; border-left: 6px solid var(--st-emerald); }
    .link { color: var(--st-emerald-dark); font-weight: 600; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .tile { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px 12px; cursor: pointer; }
    .tile:last-child { grid-column: span 2; }
  `],
})
export class HomePage {
  name = '';
  today = 0;
  goal = 4 * 3600;
  tips: Tip[] = [];
  loading = false;
  error = false;
  fmt = fmtHM;

  // Los 5 destinos del esquema
  menu = [
    { label: 'Materias', icon: 'library-outline', url: '/materias' },
    { label: 'Estudiar', icon: 'time-outline', url: '/estudiar' },
    { label: 'Metas', icon: 'trending-up-outline', url: '/metas' },
    { label: 'Calendario', icon: 'calendar-outline', url: '/calendario' },
    { label: 'Estadísticas', icon: 'pie-chart-outline', url: '/estadisticas' },
  ];

  constructor(
    public net: NetworkService, public timer: TimerService,
    private storage: StorageService, private api: ApiService,
  ) {}

  ionViewWillEnter() { return this.load(); } // se ejecuta cada vez que vuelves al Dashboard

  async load() {
    this.loading = true;
    const p = await this.storage.getProfile();
    this.name = p.name;
    this.goal = p.goalHours * 3600;
    this.today = await this.storage.secondsSince(startOfToday());
    this.tips = await this.api.getTips();   // GET a la API (o copia en caché si no hay internet)
    this.error = this.tips.length === 0;
    this.loading = false;
  }

  async refresh(ev: any) { await this.load(); ev.target.complete(); }
}