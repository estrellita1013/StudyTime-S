import { Component } from '@angular/core';

import {
  IonContent,
  IonIcon,
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  NavController
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  arrowBackOutline,
  bookOutline
} from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    IonContent,
    IonIcon,
    IonInput,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel
  ],

  template: `
    <ion-content [fullscreen]="true">

      <div class="login-page">

        <!-- ENCABEZADO -->

        <div class="top-section">

          <button
            class="back-button"
            type="button"
            (click)="back()">

            <ion-icon name="arrow-back-outline"></ion-icon>

          </button>

          <div class="brand">

            <div class="brand-icon">
              <ion-icon name="book-outline"></ion-icon>
            </div>

            <span>StudyTime</span>

          </div>

        </div>


        <!-- USUARIO / BIENVENIDA -->

        <div class="avatar-section">

          <div class="avatar">

            <ion-icon name="person-outline"></ion-icon>

          </div>

          <h1>
            {{ mode === 'login'
              ? 'Bienvenido'
              : 'Crear tu cuenta'
            }}
          </h1>

          <p>
            {{ mode === 'login'
              ? 'Inicia sesión para continuar con tu aprendizaje.'
              : 'Crea tu cuenta y comienza a organizar tus estudios.'
            }}
          </p>

        </div>


        <!-- FORMULARIO -->

        <div class="login-card">

          <ion-segment
            [value]="mode"
            (ionChange)="changeMode($any($event).detail.value)">

            <ion-segment-button value="login">
              <ion-label>Entrar</ion-label>
            </ion-segment-button>

            <ion-segment-button value="register">
              <ion-label>Crear cuenta</ion-label>
            </ion-segment-button>

          </ion-segment>


          @if (mode === 'register') {

            <div class="input-group">

              <div class="input-icon">
                <ion-icon name="person-outline"></ion-icon>
              </div>

              <ion-input
                type="text"
                placeholder="Nombre completo"
                [value]="name"
                (ionInput)="name = $any($event).detail.value">
              </ion-input>

            </div>

          }


          <!-- CORREO -->

          <div class="input-group">

            <div class="input-icon">
              <ion-icon name="mail-outline"></ion-icon>
            </div>

            <ion-input
              type="email"
              placeholder="Correo electrónico"
              [value]="email"
              (ionInput)="email = $any($event).detail.value">
            </ion-input>

          </div>


          <!-- CONTRASEÑA -->

          <div class="input-group">

            <div class="input-icon">
              <ion-icon name="lock-closed-outline"></ion-icon>
            </div>

            <ion-input
              [type]="showPassword ? 'text' : 'password'"
              placeholder="Contraseña"
              [value]="password"
              (ionInput)="password = $any($event).detail.value">
            </ion-input>

            <button
              class="password-toggle"
              type="button"
              (click)="togglePassword()">

              <ion-icon
                [name]="showPassword
                  ? 'eye-off-outline'
                  : 'eye-outline'">
              </ion-icon>

            </button>

          </div>


          <!-- ERROR -->

          @if (error) {

            <div class="error-message">

              <ion-icon name="lock-closed-outline"></ion-icon>

              <span>{{ error }}</span>

            </div>

          }


          <!-- RECUPERAR CONTRASEÑA -->

          @if (mode === 'login') {

            <button
              type="button"
              class="forgot-button">

              ¿Olvidaste tu contraseña?

            </button>

          }


          <!-- BOTÓN -->

          <ion-button
            expand="block"
            class="login-button"
            (click)="submit()">

            {{ mode === 'login'
              ? 'INICIAR SESIÓN'
              : 'CREAR CUENTA'
            }}

          </ion-button>


          <!-- CAMBIO DE MODO -->

          <div class="bottom-text">

            @if (mode === 'login') {

              <span>¿No tienes una cuenta?</span>

              <button
                type="button"
                (click)="changeMode('register')">

                Crear cuenta

              </button>

            } @else {

              <span>¿Ya tienes una cuenta?</span>

              <button
                type="button"
                (click)="changeMode('login')">

                Iniciar sesión

              </button>

            }

          </div>

        </div>


        <!-- PIE -->

        <div class="footer">

          <span>StudyTime</span>

          <small>
            Organiza tu tiempo. Mejora tu aprendizaje.
          </small>

        </div>

      </div>

    </ion-content>
  `,

  styles: [`

    /* =========================
       FONDO GENERAL
       ========================= */

    ion-content {
      --background: #080840;
    }

    .login-page {

      min-height: 100%;

      background:
        linear-gradient(
          180deg,
          #080840 0%,
          #080840 38%,
          #f5f6fa 38%,
          #f5f6fa 100%
        );

      padding: 22px 20px 28px;

      display: flex;
      flex-direction: column;
      align-items: center;

      box-sizing: border-box;
    }


    /* =========================
       ENCABEZADO
       ========================= */

    .top-section {

      width: 100%;
      max-width: 480px;

      display: flex;
      align-items: center;
      justify-content: center;

      position: relative;

      margin-bottom: 18px;
    }


    .back-button {

      position: absolute;

      left: 0;

      width: 42px;
      height: 42px;

      border: 0;
      border-radius: 14px;

      background: rgba(255,255,255,.10);

      color: #ffffff;

      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;
    }


    .back-button ion-icon {
      font-size: 22px;
    }


    /* =========================
       STUDYTIME
       ========================= */

    .brand {

      display: flex;
      align-items: center;
      justify-content: center;

      gap: 10px;

      color: #ffffff !important;

      font-size: 25px;

      font-weight: 800;

      text-align: center;
    }


    /* FORZAR TEXTO STUDYTIME EN BLANCO */

    .brand span {
      color: #ffffff !important;
    }


    .brand-icon {

      width: 42px;
      height: 42px;

      border-radius: 12px;

      background: #B34B00;

      display: flex;
      align-items: center;
      justify-content: center;
    }


    .brand-icon ion-icon {

      font-size: 24px;

      color: #ffffff;
    }


    /* =========================
       AVATAR / BIENVENIDA
       ========================= */

    .avatar-section {

      width: 100%;
      max-width: 480px;

      text-align: center;

      color: #ffffff;

      margin-bottom: 28px;
    }


    /* LOGO DE USUARIO */

    .avatar {

      width: 120px;
      height: 120px;

      margin: 0 auto 18px;

      border-radius: 50%;

      background: #ffffff;

      border: 5px solid rgba(255,255,255,.18);

      box-shadow:
        0 12px 32px rgba(0,0,0,.28);

      display: flex;
      align-items: center;
      justify-content: center;
    }


    .avatar ion-icon {

      font-size: 72px;

      color: #080840;
    }


    /* =========================
       BIENVENIDO
       ========================= */

    .avatar-section h1 {

      margin: 0 0 10px;

      text-align: center;

      color: #ffffff;

      font-size: 30px;

      font-weight: 800;
    }


    .avatar-section p {

      margin: 0 auto;

      max-width: 340px;

      color: rgba(255,255,255,.78);

      font-size: 14px;

      line-height: 1.5;

      text-align: center;
    }


    /* =========================
       TARJETA
       ========================= */

    .login-card {

      width: 100%;
      max-width: 480px;

      box-sizing: border-box;

      padding: 22px;

      background: #ffffff;

      border-radius: 24px;

      box-shadow:
        0 15px 40px rgba(8,8,64,.18);
    }


    /* =========================
       SEGMENTOS
       ========================= */

    ion-segment {

      --background: #f0f0f7;

      border-radius: 14px;

      padding: 4px;

      margin-bottom: 22px;
    }


    ion-segment-button {

      --color: #687083;

      --color-checked: #ffffff;

      --indicator-color: #080840;

      min-height: 44px;

      font-size: 13px;

      font-weight: 700;
    }


    /* =========================
       CAMPOS
       ========================= */

    .input-group {

      min-height: 54px;

      display: flex;

      align-items: center;

      margin-bottom: 14px;

      padding: 0 12px;

      border: 1px solid #e4e5ec;

      border-radius: 14px;

      background: #fafafd;

      transition: .2s;
    }


    .input-group:focus-within {

      border-color: #B34B00;

      box-shadow:
        0 0 0 3px rgba(179,75,0,.10);

      background: #ffffff;
    }


    .input-icon {

      width: 34px;

      display: flex;

      align-items: center;

      justify-content: center;
    }


    .input-icon ion-icon {

      font-size: 20px;

      color: #B34B00;
    }


    .input-group ion-input {

      --color: #080840;

      --placeholder-color: #8b91a1;

      --padding-start: 4px;

      --padding-end: 4px;

      font-size: 14px;
    }


    /* =========================
       MOSTRAR CONTRASEÑA
       ========================= */

    .password-toggle {

      width: 38px;
      height: 38px;

      border: 0;

      background: transparent;

      color: #687083;

      display: flex;

      align-items: center;
      justify-content: center;

      cursor: pointer;
    }


    .password-toggle ion-icon {

      font-size: 20px;
    }


    /* =========================
       ERROR
       ========================= */

    .error-message {

      display: flex;

      align-items: center;

      gap: 8px;

      margin: 4px 0 12px;

      padding: 11px 12px;

      border-radius: 12px;

      background: #fff0e6;

      color: #8F3C00;

      font-size: 13px;

      font-weight: 600;
    }


    .error-message ion-icon {

      font-size: 18px;

      flex-shrink: 0;
    }


    /* =========================
       RECUPERAR CONTRASEÑA
       ========================= */

    .forgot-button {

      display: block;

      width: 100%;

      margin: 2px 0 16px;

      padding: 0;

      border: 0;

      background: transparent;

      text-align: right;

      color: #B34B00;

      font-size: 13px;

      font-weight: 700;

      cursor: pointer;
    }


    /* =========================
       BOTÓN LOGIN
       ========================= */

    .login-button {

      --background: #B34B00;

      --background-hover: #8F3C00;

      --border-radius: 14px;

      height: 52px;

      margin: 0;

      font-size: 14px;

      font-weight: 800;

      letter-spacing: .02em;
    }


    /* =========================
       CREAR CUENTA
       ========================= */

    .bottom-text {

      display: flex;

      justify-content: center;

      align-items: center;

      gap: 5px;

      margin-top: 20px;

      color: #687083;

      font-size: 13px;
    }


    .bottom-text button {

      border: 0;

      background: transparent;

      color: #080840;

      font-weight: 800;

      cursor: pointer;
    }


    /* =========================
       FOOTER
       ========================= */

    .footer {

      width: 100%;
      max-width: 480px;

      margin-top: auto;

      padding-top: 24px;

      text-align: center;

      color: #687083;
    }


    .footer span {

      display: block;

      color: #080840;

      font-size: 13px;

      font-weight: 800;
    }


    .footer small {

      display: block;

      margin-top: 4px;

      font-size: 11px;
    }


    /* =========================
       PANTALLAS GRANDES
       ========================= */

    @media (min-width: 700px) {

      .login-page {

        padding-top: 30px;
      }


      .avatar-section {

        margin-bottom: 34px;
      }


      .avatar {

        width: 120px;
        height: 120px;
      }


      .login-card {

        padding: 28px;
      }

    }

  `],
})
export class LoginPage {

  mode: 'login' | 'register' = 'login';

  name = '';
  email = '';
  password = '';

  error = '';

  showPassword = false;


  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private auth: AuthService,

    // eslint-disable-next-line @angular-eslint/prefer-inject
    private nav: NavController
  ) {

    addIcons({
      personOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      arrowBackOutline,
      bookOutline
    });

  }


  changeMode(mode: 'login' | 'register') {

    this.mode = mode;

    this.error = '';

  }


  togglePassword() {

    this.showPassword = !this.showPassword;

  }


  back() {

    this.nav.navigateBack('/bienvenida');

  }


  async submit() {

    const email = (this.email ?? '').trim();

    const pass = this.password ?? '';


    if (!email.includes('@')) {

      this.error = 'Escribe un correo válido';

      return;

    }


    if (pass.length < 4) {

      this.error =
        'La contraseña debe tener al menos 4 caracteres';

      return;

    }


    if (
      this.mode === 'register' &&
      !(this.name ?? '').trim()
    ) {

      this.error = 'Escribe tu nombre';

      return;

    }


    const err = this.mode === 'login'

      ? await this.auth.login(email, pass)

      : await this.auth.register(
          this.name,
          email,
          pass
        );


    if (err) {

      this.error = err;

      return;

    }


    this.nav.navigateRoot('/tabs/hoy');

  }

}