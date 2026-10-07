import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonSelect, IonSelectOption,
  IonSegment, IonSegmentButton, IonLabel, IonRange, IonButton, NavController,
} from '@ionic/angular';
import { ACTIVITIES, Subject } from '../../models/models';
import { StorageService } from '../../services/storage.service';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonSelect, IonSelectOption,
    IonSegment, IonSegmentButton, IonLabel, IonRange, IonButton, RouterLink,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/hoy" text=""></ion-back-button></ion-buttons>
        <ion-title>Estudiar</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="st-card">
        <ion-select label="Materia" labelPlacement="stacked" placeholder="Elige una materia"
                    [value]="timer.subject()" (ionChange)="setSubject($any($event).detail.value)">
          <ion-select-option value="">Sin materia</ion-select-option>
          @for (s of subjects; track s.id) { <ion-select-option [value]="s.name">{{ s.name }}</ion-select-option> }
        </ion-select>
        @if (!subjects.length) {
          <ion-button fill="clear" size="small" routerLink="/materias">Agregar mis materias</ion-button>
        }

        @if (topics.length) {
          <ion-select label="Tema" labelPlacement="stacked" placeholder="Opcional"
                      [value]="timer.topic()" (ionChange)="timer.topic.set($any($event).detail.value)">
            <ion-select-option value="">Cualquier tema</ion-select-option>
            @for (t of topics; track t.id) { <ion-select-option [value]="t.name">{{ t.name }}</ion-select-option> }
          </ion-select>
        }
      </div>

      <div class="st-card" style="margin-top: 16px">
        <div class="st-label" style="margin-bottom: 8px">Actividad</div>
        <ion-segment [value]="timer.type()" (ionChange)="timer.type.set($any($event).detail.value)">
          @for (a of activities; track a.key) {
            <ion-segment-button [value]="a.key"><ion-label>{{ a.label }}</ion-label></ion-segment-button>
          }
        </ion-segment>

        <div class="st-label" style="margin-top: 20px">Duración objetivo: {{ timer.targetMin() }} min</div>
        <ion-range min="5" max="120" step="5" [value]="timer.targetMin()"
                   (ionInput)="timer.targetMin.set($any($event).detail.value)"></ion-range>
      </div>

      <div style="margin-top: 24px">
        @if (timer.seconds() > 0) {
          <ion-button expand="block" class="st-btn" routerLink="/sesion">Volver a la sesión en curso</ion-button>
        } @else {
          <ion-button expand="block" class="st-btn" (click)="start()">Comenzar sesión</ion-button>
        }
      </div>
    </ion-content>`,
})
export class StudyPage {
  activities = ACTIVITIES;
  subjects: Subject[] = [];

  constructor(public timer: TimerService, private storage: StorageService, private nav: NavController) {}

  async ionViewWillEnter() { this.subjects = await this.storage.getSubjects(); }

  // Temas pendientes de la materia elegida
  get topics() {
    return this.subjects.find(s => s.name === this.timer.subject())?.topics.filter(t => !t.done) ?? [];
  }

  setSubject(name: string) { this.timer.subject.set(name); this.timer.topic.set(''); }

  start() {
    this.timer.reset();
    this.timer.start();
    this.nav.navigateForward('/sesion');
  }
}