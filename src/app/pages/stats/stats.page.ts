import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,
  IonLabel, IonButton, IonIcon, IonButtons, IonBackButton,
} from '@ionic/angular';
import { Share } from '@capacitor/share';
import { ACTIVITIES, Session } from '../../models/models';
import { StorageService } from '../../services/storage.service';
import { fmtHM, startOfToday, startOfWeek } from '../../utils/time';

type Period = 'semana' | 'mes' | 'anio';
const C = 2 * Math.PI * 46; // circunferencia de la dona (radio 46)

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,
    IonLabel, IonButton, IonIcon, IonButtons, IonBackButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/hoy" text=""></ion-back-button></ion-buttons>
        <ion-title>Estadísticas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-segment [value]="period" (ionChange)="setPeriod($any($event).detail.value)">
        <ion-segment-button value="semana"><ion-label>Semana</ion-label></ion-segment-button>
        <ion-segment-button value="mes"><ion-label>Mes</ion-label></ion-segment-button>
        <ion-segment-button value="anio"><ion-label>Año</ion-label></ion-segment-button>
      </ion-segment>

      <div class="head">
        <span class="sub">{{ range }}</span>
        <ion-button fill="clear" size="small" (click)="export()">Exportar <ion-icon slot="end" name="share-outline"></ion-icon></ion-button>
      </div>

      <div class="donut">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="46" fill="none" stroke="#E5E7EB" stroke-width="16"></circle>
          @for (r of rows; track r.key) {
            <circle cx="60" cy="60" r="46" fill="none" stroke-width="16" transform="rotate(-90 60 60)"
                    [attr.stroke]="r.color" [attr.stroke-dasharray]="r.dash" [attr.stroke-dashoffset]="r.offset"></circle>
          }
        </svg>
        <div class="mid"><strong>{{ fmt(total) }}</strong><span class="st-label">Registrado</span></div>
      </div>

      <div class="st-card">
        @for (r of rows; track r.key) {
          <div class="legend">
            <span class="dot" [style.background]="r.color"></span>
            <span class="name">{{ r.label }}</span>
            <strong>{{ fmt(r.seconds) }}</strong>
            <span class="pct">{{ r.pct }}%</span>
          </div>
        }
      </div>

      <div class="st-card" style="margin-top: 16px">
        <div class="st-label" style="margin-bottom: 8px">Por materia</div>
        @for (m of bySubject; track m.name) {
          <div class="legend"><span class="name">{{ m.name }}</span><strong>{{ fmt(m.seconds) }}</strong></div>
        } @empty {
          <span class="sub">Aún no hay sesiones en este período.</span>
        }
      </div>

      <div class="st-card side">
        <div>
          <div class="st-label">Total diario</div>
          <div class="big">{{ fmt(todaySec) }}</div>
          <div class="good">{{ diffText }}</div>
        </div>
        <div class="st-icon-box"><ion-icon name="book-outline"></ion-icon></div>
      </div>

      <div class="st-card side">
        <div>
          <div class="st-label">Resumen semanal</div>
          <div class="big">{{ fmt(weekSec) }}</div>
          <div class="sub">Completado: {{ weekPct }}% de tu meta ({{ weekGoalH }}h)</div>
        </div>
        <div class="st-icon-box"><ion-icon name="trending-up-outline"></ion-icon></div>
      </div>
    </ion-content>`,
  styles: [`
    .head { display: flex; justify-content: space-between; align-items: center; margin: 12px 0; }
    .sub { color: var(--st-gray-400); }
    .donut { position: relative; width: 240px; height: 240px; margin: 8px auto 20px; }
    .mid { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .mid strong { font-size: 36px; }
    .legend { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--st-gray-200); }
    .legend:last-child { border-bottom: 0; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .name { flex: 1; }
    .pct { color: var(--st-gray-400); width: 44px; text-align: right; }
    .side { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; border-left: 6px solid var(--st-emerald); }
    .big { font-size: 34px; font-weight: 800; }
    .good { color: var(--st-emerald-dark); font-size: 14px; font-weight: 600; }
  `],
})
export class StatsPage {
  period: Period = 'semana';
  range = '';
  total = 0;
  rows: any[] = [];
  bySubject: { name: string; seconds: number }[] = [];
  todaySec = 0;
  weekSec = 0;
  weekGoalH = 0;
  diff = 0;
  fmt = fmtHM;

  constructor(private storage: StorageService) {}

  ionViewWillEnter() { return this.calc(); }
  setPeriod(p: Period) { this.period = p; this.calc(); }

  get weekPct() { return this.weekGoalH ? Math.round((this.weekSec / (this.weekGoalH * 3600)) * 100) : 0; }
  get diffText() {
    const d = Math.round(this.diff);
    return `${d >= 0 ? '+' : '-'}${fmtHM(Math.abs(d))} ${d >= 0 ? 'más' : 'menos'} que el promedio diario`;
  }

  private sum(list: Session[]) { return list.reduce((n, s) => n + s.seconds, 0); }

  async calc() {
    const all = await this.storage.getSessions();
    const prof = await this.storage.getProfile();
    const today = startOfToday();
    const monday = startOfWeek();

    const start = new Date(today);
    if (this.period === 'semana') start.setTime(monday.getTime());
    else if (this.period === 'mes') start.setDate(1);
    else start.setMonth(0, 1);

    const inRange = all.filter(s => new Date(s.date) >= start);
    this.total = this.sum(inRange);

    // Tiempo por materia dentro del período elegido
    const map = new Map<string, number>();
    inRange.forEach(s => {
      const key = s.subject || 'Sin materia';
      map.set(key, (map.get(key) ?? 0) + s.seconds);
    });
    this.bySubject = Array.from(map, ([name, seconds]) => ({ name, seconds })).sort((a, b) => b.seconds - a.seconds);

    // Cada categoría es un arco de la dona: dasharray = largo del arco, dashoffset = dónde empieza
    let acc = 0;
    this.rows = ACTIVITIES.map(a => {
      const seconds = this.sum(inRange.filter(s => s.type === a.key));
      const len = this.total ? (seconds / this.total) * C : 0;
      const row = {
        ...a, seconds,
        pct: this.total ? Math.round((seconds / this.total) * 100) : 0,
        dash: `${len} ${C - len}`, offset: -acc,
      };
      acc += len;
      return row;
    });

    this.todaySec = this.sum(all.filter(s => new Date(s.date) >= today));
    this.weekSec = this.sum(all.filter(s => new Date(s.date) >= monday));
    this.weekGoalH = prof.goalHours * 7;
    this.diff = this.todaySec - this.weekSec / 7;

    const f = (d: Date) => d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
    this.range = `${f(start)} - ${f(new Date())}`;
  }

  // Exportar: comparte un resumen en texto (si el navegador no lo permite, lo copia)
  async export() {
    const text = `Mi progreso en StudyTime (${this.range}): ${fmtHM(this.total)} registrados. ` +
      this.rows.map(r => `${r.label} ${fmtHM(r.seconds)}`).join(', ');
    try { await Share.share({ title: 'StudyTime', text }); }
    catch { await navigator.clipboard?.writeText(text); }
  }
}