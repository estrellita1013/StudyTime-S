import { Component } from '@angular/core';

import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  homeOutline,
  playCircleOutline,
  bookOutline,
  trophyOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,

  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],

  template: `
    <ion-tabs>

      <ion-tab-bar slot="bottom">

        <!-- HOY -->
        <ion-tab-button tab="hoy">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Hoy</ion-label>
        </ion-tab-button>

        <!-- ESTUDIAR -->
        <ion-tab-button tab="estudiar">
          <ion-icon name="play-circle-outline"></ion-icon>
          <ion-label>Estudiar</ion-label>
        </ion-tab-button>

        <!-- MATERIAS -->
        <ion-tab-button tab="materias">
          <ion-icon name="book-outline"></ion-icon>
          <ion-label>Materias</ion-label>
        </ion-tab-button>

        <!-- METAS -->
        <ion-tab-button tab="metas">
          <ion-icon name="trophy-outline"></ion-icon>
          <ion-label>Metas</ion-label>
        </ion-tab-button>

        <!-- PERFIL -->
        <ion-tab-button tab="perfil">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Perfil</ion-label>
        </ion-tab-button>

      </ion-tab-bar>

    </ion-tabs>
  `,

  styles: [`

    /* =========================================
       BARRA INFERIOR FLOTANTE
       ========================================= */

    ion-tab-bar {
      --background: #B34B00;
      --color: rgba(255, 255, 255, 0.75);
      --color-selected: #ffffff;

      position: fixed;

      left: 16px;
      right: 16px;
      bottom: 14px;

      width: auto;

      height: 64px;

      border: none;

      border-radius: 20px;

      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.20);

      overflow: hidden;

      z-index: 1000;
    }


    /* =========================================
       BOTONES
       ========================================= */

    ion-tab-button {
      --background: transparent;

      --color: rgba(255, 255, 255, 0.75);

      --color-selected: #ffffff;

      font-size: 11px;

      font-weight: 600;
    }


    /* =========================================
       ICONOS
       ========================================= */

    ion-tab-button ion-icon {
      font-size: 22px;
    }


    /* =========================================
       BOTÓN SELECCIONADO
       ========================================= */

    ion-tab-button.tab-selected {
      color: #ffffff;
    }

  `]
})
export class TabsPage {

  constructor() {

    addIcons({
      homeOutline,
      playCircleOutline,
      bookOutline,
      trophyOutline,
      personOutline
    });

  }

}