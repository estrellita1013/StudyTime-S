import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonRange,
  IonButton,
  IonIcon,
  AlertController,
  ToastController,
  NavController,
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  cameraOutline,
  listOutline,
  imagesOutline,
  mapOutline,
  bluetoothOutline,
  chatbubbleOutline,
  personOutline,
} from 'ionicons/icons';

import {
  Camera,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';

import { Profile } from '../../models/models';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonRange,
    IonButton,
    IonIcon,
    RouterLink,
  ],

  template: `

    <!-- =========================
         ENCABEZADO
         ========================= -->

    <ion-header>

      <ion-toolbar>

        <ion-title>
          Perfil
        </ion-title>

      </ion-toolbar>

    </ion-header>


    <!-- =========================
         CONTENIDO
         ========================= -->

    <ion-content class="ion-padding">


      <!-- =========================
           DATOS DEL PERFIL
           ========================= -->

      <div class="st-card">


        <!-- FOTO DE PERFIL -->

        <div
          class="avatar"
          (click)="takePhoto()">

          @if (profile.photo) {

            <img
              [src]="profile.photo"
              alt="Foto de perfil" />

          } @else {

            <ion-icon
              name="camera-outline">
            </ion-icon>

          }

        </div>


        <!-- NOMBRE -->

        <ion-input
          label="Nombre"
          labelPlacement="stacked"
          [value]="profile.name"
          (ionInput)="profile.name = $any($event).detail.value">
        </ion-input>


        <!-- CARRERA -->

        <ion-input
          label="Carrera"
          labelPlacement="stacked"
          placeholder="Ej. Ingeniería de Software"
          [value]="profile.career"
          (ionInput)="profile.career = $any($event).detail.value">
        </ion-input>


        <!-- META DIARIA -->

        <div
          class="st-label"
          style="margin-top: 16px">

          Meta diaria: {{ profile.goalHours }} h

        </div>


        <ion-range
          min="1"
          max="10"
          step="1"
          snaps="true"
          [value]="profile.goalHours"
          (ionInput)="profile.goalHours = $any($event).detail.value">
        </ion-range>


        <!-- GUARDAR -->

        <ion-button
          expand="block"
          class="st-btn"
          (click)="save()">

          Guardar perfil

        </ion-button>

      </div>


      <!-- =========================
           OPCIONES DEL PERFIL
           ========================= -->

      <ion-list
        class="st-card profile-options"
        lines="full">


        <!-- HISTORIAL -->

        <ion-item
          routerLink="/historial"
          [detail]="true">

          <ion-icon
            slot="start"
            name="list-outline">
          </ion-icon>

          <ion-label>
            Historial de sesiones
          </ion-label>

        </ion-item>


        <!-- NOTAS -->

        <ion-item
          routerLink="/notas"
          [detail]="true">

          <ion-icon
            slot="start"
            name="images-outline">
          </ion-icon>

          <ion-label>
            Notas con foto
          </ion-label>

        </ion-item>


        <!-- LUGARES -->

        <ion-item
          routerLink="/lugares"
          [detail]="true">

          <ion-icon
            slot="start"
            name="map-outline">
          </ion-icon>

          <ion-label>
            Lugares de estudio
          </ion-label>

        </ion-item>


        <!-- BLUETOOTH -->

        <ion-item
          routerLink="/bluetooth"
          [detail]="true">

          <ion-icon
            slot="start"
            name="bluetooth-outline">
          </ion-icon>

          <ion-label>
            Dispositivos cercanos
          </ion-label>

        </ion-item>


        <!-- COMENTARIOS -->

        <ion-item
          button
          [detail]="true"
          (click)="feedback()">

          <ion-icon
            slot="start"
            name="chatbubble-outline">
          </ion-icon>

          <ion-label>
            Enviar comentarios
          </ion-label>

        </ion-item>


        <!-- CERRAR SESIÓN -->

        <ion-item
          button
          [detail]="true"
          (click)="logout()">

          <ion-icon
            slot="start"
            name="person-outline">
          </ion-icon>

          <ion-label>
            Cerrar sesión
          </ion-label>

        </ion-item>


      </ion-list>

    </ion-content>
  `,


  styles: [`

    /* =========================
       FOTO DE PERFIL
       ========================= */

    .avatar {

      width: 96px;
      height: 96px;

      border-radius: 50%;

      background: var(--st-emerald-soft);

      margin: 0 auto 16px;

      display: flex;

      align-items: center;
      justify-content: center;

      overflow: hidden;

      cursor: pointer;
    }


    .avatar img {

      width: 100%;
      height: 100%;

      object-fit: cover;
    }


    .avatar ion-icon {

      font-size: 36px;

      color: var(--st-emerald-dark);
    }


    /* =========================
       BOTÓN GUARDAR
       ========================= */

    ion-button {

      margin-top: 20px;
    }


    /* =========================
       LISTA DEL PERFIL
       ========================= */

    .profile-options {

      margin-top: 16px;

      padding: 4px 12px;
    }


    .profile-options ion-item {

      --background: transparent;

      --min-height: 54px;
    }


    .profile-options ion-icon {

      font-size: 22px;

      color: var(--uapa-blue);

      margin-right: 8px;
    }


    .profile-options ion-label {

      font-weight: 600;
    }

  `],
})
export class ProfilePage {

  profile: Profile = {
    name: '',
    career: '',
    goalHours: 4,
  };


  constructor(
    private storage: StorageService,
    private api: ApiService,
    private auth: AuthService,
    private alert: AlertController,
    private toast: ToastController,
    private nav: NavController,
  ) {

    /* =========================
       REGISTRAR ICONOS
       ========================= */

    addIcons({

      cameraOutline,
      listOutline,
      imagesOutline,
      mapOutline,
      bluetoothOutline,
      chatbubbleOutline,
      personOutline,

    });

  }


  /* =========================
     CARGAR PERFIL
     ========================= */

  async ionViewWillEnter() {

    this.profile =
      await this.storage.getProfile();

  }


  /* =========================
     MENSAJE
     ========================= */

  async say(message: string) {

    (
      await this.toast.create({

        message,

        duration: 2000,

        color: 'dark',

      })
    ).present();

  }


  /* =========================
     GUARDAR PERFIL
     ========================= */

  async save() {

    await this.storage.saveProfile(
      this.profile
    );

    this.say(
      'Perfil guardado'
    );

  }


  /* =========================
     TOMAR FOTO
     ========================= */

  async takePhoto() {

    try {

      const img =
        await Camera.getPhoto({

          quality: 70,

          width: 400,

          resultType:
            CameraResultType.DataUrl,

          source:
            CameraSource.Prompt,

        });

      this.profile.photo =
        img.dataUrl;

    } catch {

      // El usuario canceló la selección de foto.

    }

  }


  /* =========================
     CERRAR SESIÓN
     ========================= */

  async logout() {

    await this.auth.logout();

    /*
     * Ir directamente al nuevo
     * login de StudyTime.
     */

    this.nav.navigateRoot(
      '/login'
    );

  }


  /* =========================
     ENVIAR COMENTARIOS
     ========================= */

  async feedback() {

    const a =
      await this.alert.create({

        header:
          'Enviar comentarios',

        inputs: [

          {
            name: 'msg',

            type: 'textarea',

            placeholder:
              'Cuéntanos qué mejorarías',
          },

        ],

        buttons: [

          {
            text: 'Cancelar',

            role: 'cancel',
          },

          {

            text: 'Enviar',

            handler: async (d) => {

              try {

                await this.api.sendFeedback(
                  'Comentario StudyTime',
                  d.msg
                );

                this.say(
                  '¡Gracias! Comentario enviado'
                );

              } catch {

                this.say(
                  'Sin conexión: inténtalo más tarde'
                );

              }

            },

          },

        ],

      });

    await a.present();

  }

}