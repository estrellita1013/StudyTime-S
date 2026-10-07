import { Component, OnDestroy } from '@angular/core';
import { IonList, IonItem, IonIcon, IonLabel, IonRange } from '@ionic/angular';

interface Sound { name: string; file: string; }

@Component({
  selector: 'app-sound-player',
  standalone: true,
  imports: [IonList, IonItem, IonIcon, IonLabel, IonRange],
  template: `
    <div class="st-card" style="margin-top:24px">
      <div class="st-label">Sonidos de enfoque</div>
      <ion-list lines="none">
        @for (s of sounds; track s.file) {
          <ion-item button detail="false" (click)="toggle(s)">
            <ion-icon slot="start" color="primary" [name]="current === s ? 'pause-circle' : 'play-circle'"></ion-icon>
            <ion-label>{{ s.name }}</ion-label>
          </ion-item>
        }
      </ion-list>
      <ion-range min="0" max="100" [value]="volume" (ionInput)="setVolume($any($event).detail.value)"></ion-range>
    </div>`,
})
export class SoundPlayerComponent implements OnDestroy {
  sounds: Sound[] = [
    { name: 'Lluvia suave', file: 'assets/audio/lluvia.mp3' },
    { name: 'Cafetería', file: 'assets/audio/cafeteria.mp3' },
    { name: 'Piano', file: 'assets/audio/piano.mp3' },
  ];
  audio = new Audio(); // API HTML5 Audio
  current: Sound | null = null;
  volume = 50;

  toggle(s: Sound) {
    if (this.current === s) { this.audio.pause(); this.current = null; return; }
    this.audio.src = s.file;
    this.audio.loop = true;
    this.audio.volume = this.volume / 100;
    this.audio.play();
    this.current = s;
  }
  setVolume(v: number) { this.volume = v; this.audio.volume = v / 100; }
  ngOnDestroy() { this.audio.pause(); }
}