import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSearchbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonSpinner
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  musicalNotesOutline,
  videocamOutline,
  searchOutline,
  libraryOutline,
  playCircleOutline,
  logoYoutube,
  alertCircleOutline
} from 'ionicons/icons';

import {
  YouTubeService,
  YouTubeVideo
} from '../../services/youtube.service';

import { SoundPlayerComponent } from '../../components/sound-player/sound-player.components';

@Component({
  selector: 'app-multimedia',
  standalone: true,

  imports: [
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSearchbar,
    IonButton,
    IonCard,
    IonCardContent,
    IonSpinner,

    SoundPlayerComponent
  ],

  templateUrl: './multimedia.page.html',
  styleUrls: ['./multimedia.page.scss']
})
export class MultimediaPage {

  tipo: 'videos' | 'audio' = 'videos';

  busqueda = '';

  videos: YouTubeVideo[] = [];

  cargando = false;

  error = '';

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private youtube: YouTubeService
  ) {

    addIcons({
      musicalNotesOutline,
      videocamOutline,
      searchOutline,
      libraryOutline,
      playCircleOutline,
      logoYoutube,
      alertCircleOutline
    });

  }

  cambiarTipo(event: any) {

    this.tipo = event.detail.value;

    this.error = '';

  }

  async buscarVideos() {

    const texto = this.busqueda.trim();

    if (!texto) {

      this.error = 'Escribe algo para buscar.';

      return;
    }

    this.cargando = true;
    this.error = '';
    this.videos = [];

    try {

      this.videos = await this.youtube.buscarVideos(texto);

      if (!this.videos.length) {

        this.error =
          'No encontramos videos para esta búsqueda.';

      }

    } catch (error) {

      console.error(
        'Error buscando en YouTube:',
        error
      );

      this.error =
        'No fue posible conectar con YouTube. Verifica tu API Key y tu conexión a Internet.';

    } finally {

      this.cargando = false;

    }

  }

  abrirVideo(video: YouTubeVideo) {

    window.open(
      this.youtube.getVideoUrl(video.videoId),
      '_blank'
    );

  }

}
