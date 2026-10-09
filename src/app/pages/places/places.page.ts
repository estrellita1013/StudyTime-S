import { Component, OnDestroy } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonFab, IonFabButton, IonIcon, IonChip, ToastController,
} from '@ionic/angular';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

const PLACES = [
  { name: 'Biblioteca Nacional Pedro Henríquez Ureña', desc: 'Plaza de la Cultura, Santo Domingo', lat: 18.47082, lng: -69.90783 },
  { name: 'Biblioteca Pedro Mir — UASD', desc: 'Ciudad Universitaria, Santo Domingo', lat: 18.46146, lng: -69.91794 },
  { name: 'Parque Central de Sabaneta', desc: 'San Ignacio de Sabaneta, Santiago Rodríguez', lat: 19.47566, lng: -71.3418 },
];

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonFab, IonFabButton, IonIcon, IonChip],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/perfil" text=""></ion-back-button></ion-buttons>
        <ion-title>Lugares de estudio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [scrollY]="false">
      @if (nearest) { <ion-chip class="near" color="dark">{{ nearest }}</ion-chip> }
      <div id="map"></div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button (click)="locate()"><ion-icon name="locate-outline"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>`,
  styles: [`
    #map { height: 100%; width: 100%; }
    .near { position: absolute; top: 8px; left: 8px; z-index: 1000; }
  `],
})
export class PlacesPage implements OnDestroy {
  map?: L.Map;
  me?: L.CircleMarker;
  nearest = '';

  constructor(private toast: ToastController) {}

  ionViewDidEnter() {
    if (!this.map) {
      this.map = L.map('map').setView([PLACES[0].lat, PLACES[0].lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(this.map);
      // Se usan círculos y no el pin por defecto de Leaflet: el pin suele romperse con el empaquetado de Angular
      PLACES.forEach(p =>
        L.circleMarker([p.lat, p.lng], { radius: 10, color: '#047857', fillColor: '#10B981', fillOpacity: 1 })
          .addTo(this.map!).bindPopup(`<b>${p.name}</b><br>${p.desc}`));
    }
    setTimeout(() => this.map?.invalidateSize(), 300); // corrige el tamaño del mapa dentro de Ionic
  }

  async locate() {
    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      const here = L.latLng(pos.coords.latitude, pos.coords.longitude);
      this.me?.remove();
      this.me = L.circleMarker(here, { radius: 9, color: '#ffffff', weight: 3, fillColor: '#111111', fillOpacity: 1 })
        .addTo(this.map!).bindPopup('Estás aquí');
      this.map!.setView(here, 16);

      // Cercanía: busca el lugar más próximo (idea base de una geovalla)
      const best = PLACES.map(p => ({ p, d: here.distanceTo(L.latLng(p.lat, p.lng)) })).sort((a, b) => a.d - b.d)[0];
      this.nearest = best.d < 150 ? `Estás en: ${best.p.name}` : `Más cercano: ${best.p.name} (${Math.round(best.d)} m)`;
    } catch {
      (await this.toast.create({ message: 'No se pudo obtener la ubicación. Revisa los permisos.', duration: 2500 })).present();
    }
  }

  ngOnDestroy() { this.map?.remove(); }
}
