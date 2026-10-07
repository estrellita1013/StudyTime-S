import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Note } from '../../models/models';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonButton, IonIcon,
    IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, FormsModule, DatePipe,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/perfil" text=""></ion-back-button></ion-buttons>
        <ion-title>Notas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="st-card">
        <ion-input label="Nueva nota" labelPlacement="stacked" placeholder="¿Qué quieres recordar?" [(ngModel)]="text"></ion-input>
        @if (photo) { <img [src]="photo" class="thumb" alt="Foto de la nota" /> }
        <div class="btns">
          <ion-button fill="outline" color="dark" (click)="takePhoto()"><ion-icon slot="start" name="camera-outline"></ion-icon>Foto</ion-button>
          <ion-button (click)="add()">Guardar</ion-button>
        </div>
      </div>

      <ion-list lines="none" style="background: transparent; margin-top: 16px">
        @for (n of notes; track n.id) {
          <ion-item-sliding>
            <ion-item>
              @if (n.photo) { <img slot="start" [src]="n.photo" class="thumb-sm" alt="" /> }
              <ion-label><h3>{{ n.text }}</h3><p>{{ n.date | date: 'd MMM, h:mm a' }}</p></ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option color="dark" (click)="remove(n)"><ion-icon slot="icon-only" name="trash-outline"></ion-icon></ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        } @empty {
          <p style="text-align: center; color: var(--st-gray-400)">Aún no tienes notas.</p>
        }
      </ion-list>
    </ion-content>`,
  styles: [`
    .thumb { width: 100%; border-radius: 16px; margin-top: 12px; }
    .thumb-sm { width: 56px; height: 56px; object-fit: cover; border-radius: 12px; }
    .btns { display: flex; justify-content: space-between; margin-top: 12px; }
    ion-item { --background: #fff; --border-radius: 16px; margin-bottom: 8px; }
  `],
})
export class NotesPage {
  notes: Note[] = [];
  text = '';
  photo?: string;

  constructor(private storage: StorageService) {}

  async ionViewWillEnter() { this.notes = await this.storage.getNotes(); }

  async takePhoto() {
    try {
      const img = await Camera.getPhoto({ quality: 60, width: 800, resultType: CameraResultType.DataUrl, source: CameraSource.Prompt });
      this.photo = img.dataUrl;
    } catch { /* cancelado */ }
  }

  async add() {
    if (!this.text.trim() && !this.photo) return;
    await this.storage.addNote({ id: Date.now().toString(), text: this.text.trim() || 'Nota sin texto', photo: this.photo, date: new Date().toISOString() });
    this.text = ''; this.photo = undefined;
    this.notes = await this.storage.getNotes();
  }

  async remove(n: Note) { await this.storage.deleteNote(n.id); this.notes = await this.storage.getNotes(); }
}