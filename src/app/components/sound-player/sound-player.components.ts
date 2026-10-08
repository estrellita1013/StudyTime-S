import {
  Component,
  OnDestroy
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonRange,
  IonSearchbar,
  IonBadge,
  IonSpinner,
  IonButton
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  pauseCircle,
  playCircle,
  musicalNotesOutline,
  searchOutline,
  cloudDownloadOutline,
  alertCircleOutline,
  openOutline
} from 'ionicons/icons';

import {
  JamendoService,
  JamendoTrack
} from '../../services/jamendo.service';


interface LocalSound {
  name: string;
  file: string;
  category: string;
  icon: string;
}


@Component({
  selector: 'app-sound-player',
  standalone: true,

  imports: [
    FormsModule,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonRange,
    IonSearchbar,
    IonBadge,
    IonSpinner,
    IonButton
  ],

  template: `

    <div class="st-card sound-card">

      <div class="st-label">
        SONIDOS DE ENFOQUE
      </div>

      <h2 class="sound-title">
        Audio para estudiar
      </h2>

      <p class="sound-description">
        Busca música y sonidos para acompañar
        tus sesiones de estudio.
      </p>


      <!-- BUSCADOR -->

      <ion-searchbar
        [(ngModel)]="search"
        (ionInput)="onSearch()"
        (keyup.enter)="buscarJamendo()"
        placeholder="Buscar música o sonido..."
        search-icon="search-outline"
        debounce="400">
      </ion-searchbar>


      <ion-button
        expand="block"
        class="search-button"
        (click)="buscarJamendo()"
        [disabled]="loading">

        @if (loading) {

          <ion-spinner name="crescent"></ion-spinner>

        } @else {

          <ion-icon
            slot="start"
            name="search-outline">
          </ion-icon>

          Buscar en Jamendo

        }

      </ion-button>


      <!-- CATEGORÍAS -->

      <div class="categories">

        @for (
          category of categories;
          track category
        ) {

          <ion-badge
            [color]="
              selectedCategory === category
                ? 'primary'
                : 'medium'
            "
            (click)="selectCategory(category)">

            {{ category }}

          </ion-badge>

        }

      </div>


      <!-- ERROR -->

      @if (error) {

        <div class="error-box">

          <ion-icon
            name="alert-circle-outline">
          </ion-icon>

          <span>
            {{ error }}
          </span>

        </div>

      }


      <!-- RESULTADOS JAMENDO -->

      @if (jamendoResults.length) {

        <div class="results-header">

          <div class="st-label">
            JAMENDO
          </div>

          <strong>
            Resultados encontrados
          </strong>

        </div>


        <ion-list lines="none">

          @for (
            track of jamendoResults;
            track track.id
          ) {

            <ion-item
              button
              detail="false"
              class="sound-item"
              (click)="playJamendo(track)">


              @if (track.imageUrl) {

                <img
                  slot="start"
                  class="cover"
                  [src]="track.imageUrl"
                  [alt]="track.name">

              } @else {

                <div
                  class="sound-icon"
                  slot="start">

                  <ion-icon
                    name="musical-notes-outline">
                  </ion-icon>

                </div>

              }


              <ion-label>

                <h3>
                  {{ track.name }}
                </h3>

                <p>
                  {{ track.artistName }}
                </p>

                <small>
                  {{ formatDuration(track.duration) }}
                </small>

              </ion-label>


              <ion-icon
                slot="end"
                [color]="
                  currentJamendo === track
                    ? 'primary'
                    : 'medium'
                "
                [name]="
                  currentJamendo === track
                    ? 'pause-circle'
                    : 'play-circle'
                ">
              </ion-icon>

            </ion-item>

          }

        </ion-list>

      }


      <!-- BIBLIOTECA LOCAL -->

      <div class="results-header local-header">

        <div class="st-label">
          MI BIBLIOTECA
        </div>

        <strong>
          Sonidos disponibles
        </strong>

      </div>


      <ion-list lines="none">

        @for (
          sound of filteredSounds;
          track sound.file
        ) {

          <ion-item
            button
            detail="false"
            class="sound-item"
            (click)="playLocal(sound)">


            <div
              class="sound-icon"
              slot="start">

              <ion-icon
                [name]="sound.icon">
              </ion-icon>

            </div>


            <ion-label>

              <h3>
                {{ sound.name }}
              </h3>

              <p>
                {{ sound.category }}
              </p>

            </ion-label>


            <ion-icon
              slot="end"
              [color]="
                currentLocal === sound
                  ? 'primary'
                  : 'medium'
              "
              [name]="
                currentLocal === sound
                  ? 'pause-circle'
                  : 'play-circle'
              ">
            </ion-icon>

          </ion-item>

        }

      </ion-list>


      <!-- SIN RESULTADOS -->

      @if (
        !filteredSounds.length &&
        !jamendoResults.length &&
        !loading
      ) {

        <div class="no-results">

          <ion-icon
            name="musical-notes-outline">
          </ion-icon>

          <strong>
            No encontramos sonidos
          </strong>

          <span>
            Prueba con otro nombre.
          </span>

        </div>

      }


      <!-- VOLUMEN -->

      <div class="volume-area">

        <div class="volume-label">

          <span>
            Volumen
          </span>

          <strong>
            {{ volume }}%
          </strong>

        </div>

        <ion-range
          min="0"
          max="100"
          [value]="volume"
          (ionInput)="
            setVolume($any($event).detail.value)
          ">
        </ion-range>

      </div>


      <!-- FUENTE JAMENDO -->

      @if (currentJamendo) {

        <div class="source-info">

          <ion-icon
            name="cloud-download-outline">
          </ion-icon>

          <span>
            Reproduciendo desde Jamendo
          </span>

          <ion-button
            fill="clear"
            size="small"
            (click)="openJamendo(currentJamendo)">

            <ion-icon
              slot="icon-only"
              name="open-outline">
            </ion-icon>

          </ion-button>

        </div>

      }

    </div>

  `,

  styles: [`

    .sound-card {
      margin-top: 24px;
    }

    .sound-title {
      margin: 6px 0 4px;
      color: #080840;
      font-size: 20px;
      font-weight: 700;
    }

    .sound-description {
      margin: 0 0 14px;
      color: #687083;
      font-size: 13px;
      line-height: 1.5;
    }

    ion-searchbar {
      --background: #f5f5fa;
      --border-radius: 14px;
      --box-shadow: none;
      --color: #080840;
      --placeholder-color: #8a8fa0;

      padding: 0;
      margin: 10px 0 12px;
    }

    .search-button {
      --background: #B34B00;
      --background-hover: #8F3C00;
      --border-radius: 14px;

      height: 46px;
      margin: 0 0 14px;

      font-weight: 700;
    }

    .categories {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 2px 0 12px;
    }

    .categories ion-badge {
      flex-shrink: 0;
      cursor: pointer;

      padding: 8px 12px;

      border-radius: 999px;

      font-size: 11px;
    }

    .results-header {
      display: flex;
      flex-direction: column;
      gap: 4px;

      margin: 18px 0 8px;
    }

    .results-header strong {
      color: #080840;
      font-size: 15px;
    }

    .local-header {
      margin-top: 22px;
    }

    .sound-item {
      --padding-start: 8px;
      --padding-end: 8px;
      --inner-padding-end: 8px;
      --background: transparent;

      margin-bottom: 4px;

      border-radius: 14px;
    }

    .sound-item:hover {
      --background: #f5f5fa;
    }

    .sound-icon {
      width: 42px;
      height: 42px;
      min-width: 42px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-right: 12px;

      border-radius: 12px;

      background: #FFF0E6;
    }

    .sound-icon ion-icon {
      font-size: 22px;
      color: #B34B00;
    }

    .cover {
      width: 46px;
      height: 46px;
      min-width: 46px;

      margin-right: 12px;

      border-radius: 10px;

      object-fit: cover;
    }

    .sound-item h3 {
      margin: 0 0 3px;

      color: #080840;

      font-size: 14px;
      font-weight: 700;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sound-item p {
      margin: 0;

      color: #8a8fa0;

      font-size: 12px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sound-item small {
      color: #B34B00;
      font-size: 11px;
    }

    .sound-item > ion-icon[slot="end"] {
      font-size: 30px;
    }

    .error-box {
      display: flex;
      align-items: center;
      gap: 10px;

      padding: 12px;

      margin: 8px 0 14px;

      border-radius: 12px;

      background: #fff0e6;

      color: #8F3C00;

      font-size: 13px;
    }

    .error-box ion-icon {
      font-size: 22px;
      flex-shrink: 0;
    }

    .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      gap: 6px;

      padding: 28px 16px;

      text-align: center;

      color: #687083;
    }

    .no-results ion-icon {
      font-size: 36px;
      color: #B34B00;
      margin-bottom: 6px;
    }

    .no-results strong {
      color: #080840;
      font-size: 15px;
    }

    .no-results span {
      font-size: 12px;
    }

    .volume-area {
      margin-top: 14px;
      padding-top: 14px;

      border-top: 1px solid #eeeef5;
    }

    .volume-label {
      display: flex;
      align-items: center;
      justify-content: space-between;

      color: #687083;

      font-size: 13px;
    }

    .volume-label strong {
      color: #080840;
    }

    ion-range {
      --bar-background: #e2e2eb;
      --bar-background-active: #B34B00;
      --knob-background: #B34B00;
      --knob-size: 20px;

      padding-left: 0;
      padding-right: 0;
    }

    .source-info {
      display: flex;
      align-items: center;
      gap: 8px;

      margin-top: 14px;

      padding: 8px 10px;

      border-radius: 12px;

      background: #f0f0fa;

      color: #080840;

      font-size: 12px;
    }

    .source-info > ion-icon {
      color: #B34B00;
      font-size: 18px;
    }

    .source-info span {
      flex: 1;
    }

  `]
})


export class SoundPlayerComponent
  implements OnDestroy {


  search = '';

  selectedCategory = 'Todos';


  categories = [
    'Todos',
    'Lluvia',
    'Ambiente',
    'Música'
  ];


  sounds: LocalSound[] = [

    {
      name: 'Lluvia suave',
      file: 'assets/audio/lluvia.mp3',
      category: 'Lluvia',
      icon: 'musical-notes-outline'
    },

    {
      name: 'Cafetería',
      file: 'assets/audio/cafeteria.mp3',
      category: 'Ambiente',
      icon: 'musical-notes-outline'
    },

    {
      name: 'Piano',
      file: 'assets/audio/piano.mp3',
      category: 'Música',
      icon: 'musical-notes-outline'
    }

  ];


  filteredSounds: LocalSound[] = [
    ...this.sounds
  ];


  jamendoResults: JamendoTrack[] = [];

  loading = false;

  error = '';

  currentJamendo:
    JamendoTrack | null = null;

  currentLocal:
    LocalSound | null = null;


  audio = new Audio();

  volume = 50;


  constructor(
    private jamendo: JamendoService
  ) {

    addIcons({
      pauseCircle,
      playCircle,
      musicalNotesOutline,
      searchOutline,
      cloudDownloadOutline,
      alertCircleOutline,
      openOutline
    });

  }


  onSearch() {
    this.filterLocalSounds();
  }


  async buscarJamendo() {

    const texto =
      this.search.trim();


    if (!texto) {

      this.error =
        'Escribe algo para buscar.';

      return;
    }


    this.loading = true;
    this.error = '';
    this.jamendoResults = [];


    try {

      this.jamendoResults =
        await this.jamendo.buscarAudios(
          texto
        );


      if (!this.jamendoResults.length) {

        this.error =
          'No encontramos música para esta búsqueda.';
      }

    } catch (error) {

      console.error(
        'Error buscando en Jamendo:',
        error
      );

      this.error =
        'No fue posible conectar con Jamendo. Verifica tu conexión a Internet.';

    } finally {

      this.loading = false;

    }

  }


  filterLocalSounds() {

    const texto =
      this.search
        .trim()
        .toLowerCase();


    this.filteredSounds =
      this.sounds.filter(sound => {

        const coincideTexto =
          !texto ||
          sound.name
            .toLowerCase()
            .includes(texto) ||
          sound.category
            .toLowerCase()
            .includes(texto);


        const coincideCategoria =
          this.selectedCategory === 'Todos' ||
          sound.category === this.selectedCategory;


        return (
          coincideTexto &&
          coincideCategoria
        );

      });

  }


  selectCategory(
    category: string
  ) {

    this.selectedCategory =
      category;

    this.filterLocalSounds();

  }


  playJamendo(
    track: JamendoTrack
  ) {

    if (
      this.currentJamendo === track
    ) {

      this.audio.pause();

      this.currentJamendo = null;

      return;
    }


    this.audio.pause();

    this.audio.src =
      track.audioUrl;

    this.audio.loop = false;

    this.audio.volume =
      this.volume / 100;

    this.audio.currentTime = 0;


    this.audio.play()
      .then(() => {

        console.log(
          'Reproduciendo:',
          track.name
        );

      })
      .catch(error => {

        console.error(
          'No se pudo reproducir Jamendo:',
          error
        );

        this.error =
          'No fue posible reproducir este audio.';

      });


    this.currentJamendo =
      track;

    this.currentLocal =
      null;

  }


  playLocal(
    sound: LocalSound
  ) {

    if (
      this.currentLocal === sound
    ) {

      this.audio.pause();

      this.currentLocal = null;

      return;
    }


    this.audio.pause();

    this.audio.src =
      sound.file;

    this.audio.loop = true;

    this.audio.volume =
      this.volume / 100;

    this.audio.currentTime = 0;


    this.audio.play()
      .catch(error => {

        console.error(
          'No se pudo reproducir el audio local:',
          error
        );

      });


    this.currentLocal =
      sound;

    this.currentJamendo =
      null;

  }


  setVolume(
    value: number
  ) {

    this.volume =
      Number(value);

    this.audio.volume =
      this.volume / 100;

  }


  formatDuration(
    seconds: number
  ): string {

    if (!seconds) {
      return '0:00';
    }


    const minutes =
      Math.floor(seconds / 60);

    const remaining =
      Math.floor(seconds % 60);


    return `${minutes}:${remaining
      .toString()
      .padStart(2, '0')}`;

  }


  openJamendo(
    track: JamendoTrack
  ) {

    if (!track.id) {
      return;
    }


    window.open(
      `https://www.jamendo.com/track/${track.id}`,
      '_blank'
    );

  }


  ngOnDestroy() {

    this.audio.pause();

    this.audio.src = '';

  }

}