import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonCheckbox, IonItemSliding, IonItemOptions, IonItemOption, NavController,
} from '@ionic/angular';
import { Subject, Topic } from '../../models/models';
import { StorageService } from '../../services/storage.service';
import { TimerService } from '../../services/timer.service';
import { fmtHM } from '../../utils/time';

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonButton, IonIcon,
    IonList, IonItem, IonLabel, IonCheckbox, IonItemSliding, IonItemOptions, IonItemOption,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/materias" text=""></ion-back-button></ion-buttons>
        <ion-title>{{ subject?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      @if (subject) {
        <div class="st-card">
          <div class="st-label">Tiempo estudiado</div>
          <div class="big">{{ fmt(studied) }}</div>
          <div class="sub">{{ doneCount }} de {{ subject.topics.length }} temas completados</div>
          <ion-button expand="block" class="st-btn" (click)="study()">Estudiar esta materia</ion-button>
        </div>

        <div class="st-label" style="margin: 24px 0 8px">Temas</div>
        <div class="st-card">
          <ion-input label="Nuevo tema" labelPlacement="stacked" placeholder="Ej. Navegación en Ionic"
                     [value]="topic" (ionInput)="topic = $any($event).detail.value"></ion-input>
          <ion-button expand="block" fill="outline" color="dark" (click)="addTopic()">Agregar tema</ion-button>
        </div>

        <ion-list lines="none" style="background: transparent; margin-top: 16px">
          @for (t of subject.topics; track t.id) {
            <ion-item-sliding>
              <ion-item>
                <ion-checkbox slot="start" [checked]="t.done" (ionChange)="toggle(t)"></ion-checkbox>
                <ion-label [class.done]="t.done">{{ t.name }}</ion-label>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option color="dark" (click)="removeTopic(t)"><ion-icon slot="icon-only" name="trash-outline"></ion-icon></ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          } @empty {
            <p style="text-align: center; color: var(--st-gray-400)">Esta materia aún no tiene temas.</p>
          }
        </ion-list>
      } @else {
        <p>No se encontró la materia.</p>
      }
    </ion-content>`,
  styles: [`
    .big { font-size: 40px; font-weight: 800; }
    .sub { color: var(--st-gray-400); margin-bottom: 8px; }
    ion-item { --background: #fff; --border-radius: 16px; margin-bottom: 8px; }
    .done { text-decoration: line-through; opacity: 0.5; }
    ion-button { margin-top: 16px; }
  `],
})
export class SubjectDetailPage {
  private route = inject(ActivatedRoute);
  subject?: Subject;
  topic = '';
  studied = 0;
  fmt = fmtHM;

  constructor(private storage: StorageService, private timer: TimerService, private nav: NavController) {}

  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.subject = (await this.storage.getSubjects()).find(s => s.id === id);
    if (this.subject) this.studied = await this.storage.secondsSince(new Date(0), this.subject.name);
  }

  get doneCount() { return this.subject?.topics.filter(t => t.done).length ?? 0; }

  private save() { return this.storage.updateSubject(this.subject!); }

  async addTopic() {
    const n = (this.topic ?? '').trim();
    if (!this.subject || !n) return;
    this.subject.topics = [...this.subject.topics, { id: Date.now().toString(), name: n, done: false }];
    await this.save();
    this.topic = '';
  }

  async toggle(t: Topic) { t.done = !t.done; await this.save(); }

  async removeTopic(t: Topic) {
    this.subject!.topics = this.subject!.topics.filter(x => x.id !== t.id);
    await this.save();
  }

  // Lleva a Estudiar con esta materia ya elegida
  study() {
    this.timer.subject.set(this.subject!.name);
    this.timer.topic.set('');
    this.nav.navigateForward('/estudiar');
  }
}