import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonButton, IonIcon,
  IonSelect, IonSelectOption, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonProgressBar,
  IonItemSliding, IonItemOptions, IonItemOption,
} from '@ionic/angular';
import { Goal, Subject } from '../../models/models';
import { StorageService } from '../../services/storage.service';
import { fmtHM, startOfToday, startOfWeek } from '../../utils/time';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonButton, IonIcon,
    IonSelect, IonSelectOption, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonProgressBar,
    IonItemSliding, IonItemOptions, IonItemOption,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/hoy" text=""></ion-back-button></ion-buttons>
        <ion-title>Metas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="st-card">
        <ion-select label="Materia" labelPlacement="stacked" [value]="subject" (ionChange)="subject = $any($event).detail.value">
          <ion-select-option value="">Todas las materias</ion-select-option>
          @for (s of subjects; track s.id) { <ion-select-option [value]="s.name">{{ s.name }}</ion-select-option> }
        </ion-select>
        <ion-input label="Horas" labelPlacement="stacked" type="number" placeholder="Ej. 5"
                   [value]="hours" (ionInput)="hours = $any($event).detail.value"></ion-input>
        <ion-segment [value]="period" (ionChange)="period = $any($event).detail.value" style="margin-top: 12px">
          <ion-segment-button value="dia"><ion-label>Por día</ion-label></ion-segment-button>
          <ion-segment-button value="semana"><ion-label>Por semana</ion-label></ion-segment-button>
        </ion-segment>
        <ion-button expand="block" class="st-btn" (click)="add()">Agregar meta</ion-button>
      </div>

      <ion-list lines="none" style="background: transparent; margin-top: 16px">
        @for (v of view; track v.g.id) {
          <ion-item-sliding>
            <ion-item>
              <ion-label>
                <h3>{{ v.g.subject || 'Todas las materias' }} · {{ v.g.hours }}h por {{ v.g.period === 'dia' ? 'día' : 'semana' }}</h3>
                <p>{{ fmt(v.secs) }} de {{ v.g.hours }}h ({{ pct(v) }}%){{ pct(v) >= 100 ? ' · ¡Cumplida!' : '' }}</p>
                <ion-progress-bar [value]="pct(v) / 100" style="margin-top: 8px"></ion-progress-bar>
              </ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option color="dark" (click)="remove(v.g)"><ion-icon slot="icon-only" name="trash-outline"></ion-icon></ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        } @empty {
          <p style="text-align: center; color: var(--st-gray-400)">Aún no tienes metas. Crea la primera.</p>
        }
      </ion-list>
    </ion-content>`,
  styles: [`
    ion-item { --background: #fff; --border-radius: 16px; margin-bottom: 8px; }
    ion-button { margin-top: 16px; }
  `],
})
export class GoalsPage {
  subjects: Subject[] = [];
  view: { g: Goal; secs: number }[] = [];
  subject = '';
  hours = '';
  period: 'dia' | 'semana' = 'dia';
  fmt = fmtHM;

  constructor(private storage: StorageService) {}

  async ionViewWillEnter() { this.subjects = await this.storage.getSubjects(); await this.load(); }

  // Para cada meta se suman los segundos estudiados en su período (y de su materia, si tiene)
  async load() {
    const goals = await this.storage.getGoals();
    this.view = await Promise.all(goals.map(async g => ({
      g,
      secs: await this.storage.secondsSince(g.period === 'dia' ? startOfToday() : startOfWeek(), g.subject),
    })));
  }

  pct(v: { g: Goal; secs: number }) { return Math.min(100, Math.round((v.secs / (v.g.hours * 3600)) * 100)); }

  async add() {
    const h = Number(this.hours);
    if (!h || h <= 0) return; // las horas son obligatorias
    await this.storage.addGoal({ id: Date.now().toString(), subject: this.subject || undefined, hours: h, period: this.period });
    this.hours = '';
    await this.load();
  }

  async remove(g: Goal) { await this.storage.deleteGoal(g.id); await this.load(); }
}