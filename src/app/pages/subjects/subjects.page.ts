import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption,
} from '@ionic/angular';
import { Subject } from '../../models/models';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonButton, IonIcon,
    IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, RouterLink,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/hoy" text=""></ion-back-button></ion-buttons>
        <ion-title>Materias</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="st-card">
        <ion-input label="Nueva materia" labelPlacement="stacked" placeholder="Ej. Programación Móvil"
                   [value]="name" (ionInput)="name = $any($event).detail.value"></ion-input>
        <ion-button expand="block" class="st-btn" (click)="add()">Agregar materia</ion-button>
      </div>

      <ion-list lines="none" style="background: transparent; margin-top: 16px">
        @for (s of subjects; track s.id) {
          <ion-item-sliding>
            <ion-item button [detail]="true" [routerLink]="['/materia', s.id]">
              <ion-label><h3>{{ s.name }}</h3><p>{{ s.topics.length }} temas</p></ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option color="dark" (click)="remove(s)"><ion-icon slot="icon-only" name="trash-outline"></ion-icon></ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        } @empty {
          <p style="text-align: center; color: var(--st-gray-400)">Aún no tienes materias. Agrega la primera.</p>
        }
      </ion-list>
    </ion-content>`,
  styles: [`
    ion-item { --background: #fff; --border-radius: 16px; margin-bottom: 8px; }
    ion-button { margin-top: 16px; }
  `],
})
export class SubjectsPage {
  subjects: Subject[] = [];
  name = '';

  constructor(private storage: StorageService) {}

  async ionViewWillEnter() { this.subjects = await this.storage.getSubjects(); }

  async add() {
    const n = (this.name ?? '').trim();
    if (!n || this.subjects.some(s => s.name.toLowerCase() === n.toLowerCase())) return; // vacía o repetida
    await this.storage.addSubject(n);
    this.name = '';
    this.subjects = await this.storage.getSubjects();
  }

  // Las sesiones ya guardadas conservan el nombre de la materia aunque la borres
  async remove(s: Subject) { await this.storage.deleteSubject(s.id); this.subjects = await this.storage.getSubjects(); }
}