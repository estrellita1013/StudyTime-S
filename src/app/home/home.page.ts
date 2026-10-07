import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  trophyOutline,
  calendarOutline,
  statsChartOutline,
  playCircleOutline,
  musicalNotesOutline,
  wifiOutline,
  cloudOfflineOutline,
  timeOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

import { StorageService } from '../services/storage.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonProgressBar
  ],
})
export class HomePage implements OnInit, OnDestroy {

  userName = 'Estudiante';
  goalHours = 2;
  studiedSeconds = 0;

  subjectsCount = 0;
  goalsCount = 0;

  online = true;

  private networkSubscription?: Subscription;

  constructor(
    private storage: StorageService,
    private network: NetworkService,
    private router: Router
  ) {
    addIcons({
      bookOutline,
      trophyOutline,
      calendarOutline,
      statsChartOutline,
      playCircleOutline,
      musicalNotesOutline,
      wifiOutline,
      cloudOfflineOutline,
      timeOutline
    });
  }

  async ngOnInit() {
    await this.loadDashboard();

    this.networkSubscription = this.network.online$.subscribe(status => {
      this.online = status;
    });
  }

  async loadDashboard() {
    const profile = await this.storage.getProfile();
    const sessions = await this.storage.getSessions();
    const subjects = await this.storage.getSubjects();
    const goals = await this.storage.getGoals();

    this.userName = profile.name || 'Estudiante';
    this.goalHours = profile.goalHours || 2;

    this.subjectsCount = subjects.length;
    this.goalsCount = goals.length;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    this.studiedSeconds = sessions
      .filter(session => {
        const date = new Date(session.date);
        return date >= today;
      })
      .reduce((total, session) => total + session.seconds, 0);
  }

  get goalSeconds(): number {
    return this.goalHours * 60 * 60;
  }

  get progress(): number {
    if (this.goalSeconds <= 0) {
      return 0;
    }

    return Math.min(this.studiedSeconds / this.goalSeconds, 1);
  }

  get progressPercent(): number {
    return Math.round(this.progress * 100);
  }

  get studiedTime(): string {
    const hours = Math.floor(this.studiedSeconds / 3600);
    const minutes = Math.floor((this.studiedSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }

    return `${minutes} min`;
  }

  startStudy() {
    this.router.navigate(['/estudiar']);
  }

  openSubjects() {
    this.router.navigate(['/materias']);
  }

  openGoals() {
    this.router.navigate(['/metas']);
  }

  openCalendar() {
    this.router.navigate(['/calendario']);
  }

  openStats() {
    this.router.navigate(['/estadisticas']);
  }

  openSounds() {
    this.router.navigate(['/estudiar']);
  }

  ngOnDestroy() {
    this.networkSubscription?.unsubscribe();
  }
}