import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="hoy"><ion-icon name="time-outline"></ion-icon><ion-label>Dashboard</ion-label></ion-tab-button>
        <ion-tab-button tab="perfil"><ion-icon name="person-outline"></ion-icon><ion-label>Perfil</ion-label></ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>`,
})
export class TabsPage {}