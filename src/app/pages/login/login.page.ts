import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonInput, IonButton, IonSegment, IonSegmentButton, IonLabel, NavController,
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonButton, IonSegment, IonSegmentButton, IonLabel],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/bienvenida" text=""></ion-back-button></ion-buttons>
        <ion-title>Cuenta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="st-card">
        <ion-segment [value]="mode" (ionChange)="mode = $any($event).detail.value; error = ''">
          <ion-segment-button value="login"><ion-label>Entrar</ion-label></ion-segment-button>
          <ion-segment-button value="register"><ion-label>Crear cuenta</ion-label></ion-segment-button>
        </ion-segment>

        @if (mode === 'register') {
          <ion-input label="Nombre" labelPlacement="stacked" [value]="name" (ionInput)="name = $any($event).detail.value"></ion-input>
        }
        <ion-input label="Correo" labelPlacement="stacked" type="email" placeholder="tu@correo.com"
                   [value]="email" (ionInput)="email = $any($event).detail.value"></ion-input>
        <ion-input label="Contraseña" labelPlacement="stacked" type="password"
                   [value]="password" (ionInput)="password = $any($event).detail.value"></ion-input>

        @if (error) { <p class="error">{{ error }}</p> }

        <ion-button expand="block" class="st-btn" (click)="submit()">{{ mode === 'login' ? 'Entrar' : 'Crear cuenta' }}</ion-button>
      </div>
    </ion-content>`,
  styles: [`
    ion-button { margin-top: 20px; }
    .error { color: var(--st-black); font-weight: 600; margin: 12px 0 0; }
  `],
})
export class LoginPage {
  mode: 'login' | 'register' = 'login';
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private nav: NavController) {}

  async submit() {
    const email = (this.email ?? '').trim();
    const pass = this.password ?? '';
    if (!email.includes('@')) { this.error = 'Escribe un correo válido'; return; }
    if (pass.length < 4) { this.error = 'La contraseña debe tener al menos 4 caracteres'; return; }
    if (this.mode === 'register' && !(this.name ?? '').trim()) { this.error = 'Escribe tu nombre'; return; }

    const err = this.mode === 'login'
      ? await this.auth.login(email, pass)
      : await this.auth.register(this.name, email, pass);

    if (err) { this.error = err; return; }
    this.nav.navigateRoot('/tabs/hoy');
  }
}