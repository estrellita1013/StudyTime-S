import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  homeOutline,
  bookOutline,
  playCircleOutline,
  trophyOutline,
  calendarOutline,
  statsChartOutline,
  timeOutline,
  documentTextOutline,
  locationOutline,
  bluetoothOutline,
  personOutline,
  musicalNotesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  imports: [
    RouterLink,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle
],
})
export class AppComponent {

  constructor() {
    addIcons({
      homeOutline,
      bookOutline,
      playCircleOutline,
      trophyOutline,
      calendarOutline,
      statsChartOutline,
      timeOutline,
      documentTextOutline,
      locationOutline,
      bluetoothOutline,
      personOutline,
      musicalNotesOutline
    });
  }

}
