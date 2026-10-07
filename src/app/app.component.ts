import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  bookOutline, libraryOutline, documentTextOutline, gameControllerOutline,
  calendarOutline, timeOutline, pieChartOutline, personOutline,
  playOutline, pauseOutline, stopOutline, trashOutline, cameraOutline,
  locateOutline, bluetoothOutline, mapOutline, imagesOutline, shareOutline,
  chatbubbleOutline, listOutline, trendingUpOutline, playCircle, pauseCircle,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    // Se registran una sola vez; todas las páginas pueden usar estos iconos por nombre.
    addIcons({
      bookOutline, libraryOutline, documentTextOutline, gameControllerOutline,
      calendarOutline, timeOutline, pieChartOutline, personOutline,
      playOutline, pauseOutline, stopOutline, trashOutline, cameraOutline,
      locateOutline, bluetoothOutline, mapOutline, imagesOutline, shareOutline,
      chatbubbleOutline, listOutline, trendingUpOutline, playCircle, pauseCircle,
    });
  }
}