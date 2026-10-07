import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonDatetime, IonInput, IonButton,
  IonIcon, IonSelect, IonSelectOption, IonList, IonItem, IonLabel, IonCheckbox,
  IonItemSliding, IonItemOptions, IonItemOption,
} from '@ionic/angular';
import { Assignment, Subject } from '../../models/models';
import { StorageService } from '../../services/storage.service';
import { dueLabel, toDateStr } from '../../utils/time';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonDatetime, IonInput, IonButton,
    IonIcon, IonSelect, IonSelectOption, IonList, IonItem, IonLabel, IonCheckbox,
    IonItemSliding, IonItemOptions, IonItemOption, DatePipe,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/hoy" text=""></ion-back-button></ion-buttons>
        <ion-title>Calendario</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="st-card" style="padding: 8px">
        <ion-datetime presentation="date" locale="es" style="width: 100%"
                      [value]="selected" [highlightedDates]="marks"
                      (ionChange)="pick($any($event).detail.value)"></ion-datetime>
      </div>

      <div class="st-label" style="margin: 20px 0 8px">Entregas del {{ selected | date: 'd MMM y' }}</div>
      <ion-list lines="none" style="background: transparent">
        @for (a of dayItems; track a.id) {
          <ion-item-sliding>
            <ion-item>
              <ion-checkbox slot="start" [checked]="a.done" (ionChange)="toggle(a)"></ion-checkbox>
              <ion-label [class.done]="a.done">
                <h3>{{ a.title }}</h3>
                <p>{{ a.subject || 'Sin materia' }} · {{ label(a.due, a.done) }}</p>
              </ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option color="dark" (click)="remove(a)"><ion-icon slot="icon-only" name="trash-outline"></ion-icon></ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        } @empty {
          <p style="text-align: center; color: var(--st-gray-400)">No hay entregas este día.</p>
        }
      </ion-list>

      <div class="st-card" style="margin-top: 16px">
        <ion-input label="Nueva entrega para este día" labelPlacement="stacked" placeholder="Ej. Proyecto final"
                   [value]="title" (ionInput)="title = $any($event).detail.value"></ion-input>
        <ion-select label="Materia" labelPlacement="stacked" placeholder="Opcional"
                    [value]="subject" (ionChange)="subject = $any($event).detail.value">
          <ion-select-option value="">Sin materia</ion-select-option>
          @for (s of subjects; track s.id) { <ion-select-option [value]="s.name">{{ s.name }}</ion-select-option> }
        </ion-select>
        <ion-button expand="block" class="st-btn" (click)="add()">Agregar entrega</ion-button>
      </div>

      @if (upcoming.length) {
        <div class="st-label" style="margin: 24px 0 8px">Próximas entregas</div>
        @for (a of upcoming; track a.id) {
          <div class="st-card row">
            <div><strong>{{ a.title }}</strong><div class="sub">{{ a.subject || 'Sin materia' }}</div></div>
            <span class="sub">{{ label(a.due) }}</span>
          </div>
        }
      }
    </ion-content>`,
  styles: [`
    ion-item { --background: #fff; --border-radius: 16px; margin-bottom: 8px; }
    .done { text-decoration: line-through; opacity: 0.5; }
    ion-button { margin-top: 16px; }
    .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 16px 20px; }
    .sub { color: var(--st-gray-400); font-size: 14px; }
  `],
})
export class CalendarPage {
  items: Assignment[] = [];
  subjects: Subject[] = [];
  selected = toDateStr(new Date());
  title = '';
  subject = '';
  marks: { date: string; textColor: string; backgroundColor: string }[] = [];
  label = dueLabel;

  constructor(private storage: StorageService) {}

  async ionViewWillEnter() { this.subjects = await this.storage.getSubjects(); await this.load(); }

  async load() {
    this.items = await this.storage.getAssignments();
    // Días con entregas: verde si hay pendientes, gris si ya fueron entregadas
    this.marks = this.items.map(a => ({ date: a.due, textColor: '#ffffff', backgroundColor: a.done ? '#9CA3AF' : '#10B981' }));
  }

  get dayItems() { return this.items.filter(a => a.due === this.selected); }

  get upcoming() {
    const hoy = toDateStr(new Date());
    return this.items.filter(a => !a.done && a.due >= hoy).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5);
  }

  pick(v: unknown) { if (typeof v === 'string') this.selected = v.slice(0, 10); }

  async add() {
    const t = (this.title ?? '').trim();
    if (!t) return; // el título es obligatorio
    await this.storage.addAssignment({ id: Date.now().toString(), title: t, subject: this.subject || undefined, due: this.selected, done: false });
    this.title = '';
    await this.load();
  }

  async toggle(a: Assignment) { await this.storage.updateAssignment({ ...a, done: !a.done }); await this.load(); }
  async remove(a: Assignment) { await this.storage.deleteAssignment(a.id); await this.load(); }
}