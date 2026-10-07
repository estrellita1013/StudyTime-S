import { Component } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  IonIcon,
  IonSpinner,
  IonButtons,
  IonMenuButton,
  IonButton
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  wifiOutline,
  cloudOfflineOutline,
  personOutline,
  trophyOutline,
  arrowForwardOutline,
  bulbOutline,
  libraryOutline,
  timeOutline,
  trendingUpOutline,
  calendarOutline,
  pieChartOutline
} from 'ionicons/icons';

import { ProgressRingComponent } from '../../components/progress-ring/progress-ring.components';
import { NetworkService } from '../../services/network.service';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';
import { TimerService } from '../../services/timer.service';

import { Tip } from '../../models/models';
import { fmtHM, startOfToday } from '../../utils/time';

@Component({
  selector: 'app-home',
  standalone: true,

  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],

  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonBadge,
    IonIcon,
    IonSpinner,
    IonButtons,
    IonMenuButton,
    IonButton,

    RouterLink,
    AsyncPipe,
    DecimalPipe,

    ProgressRingComponent
  ],
})
export class HomePage {

  name = '';

  today = 0;

  goal = 4 * 3600;

  tips: Tip[] = [];

  loading = false;

  error = false;

  fmt = fmtHM;

  menu = [
    {
      label: 'Materias',
      icon: 'library-outline',
      url: '/materias'
    },
    {
      label: 'Estudiar',
      icon: 'time-outline',
      url: '/estudiar'
    },
    {
      label: 'Metas',
      icon: 'trending-up-outline',
      url: '/metas'
    },
    {
      label: 'Calendario',
      icon: 'calendar-outline',
      url: '/calendario'
    },
    {
      label: 'Estadísticas',
      icon: 'pie-chart-outline',
      url: '/estadisticas'
    }
  ];

  constructor(
    public net: NetworkService,
    public timer: TimerService,

    private storage: StorageService,
    private api: ApiService
  ) {

    addIcons({
      wifiOutline,
      cloudOfflineOutline,
      personOutline,
      trophyOutline,
      arrowForwardOutline,
      bulbOutline,

      libraryOutline,
      timeOutline,
      trendingUpOutline,
      calendarOutline,
      pieChartOutline
    });

  }

  ionViewWillEnter() {
    return this.load();
  }

  async load() {

    this.loading = true;

    try {

      const profile = await this.storage.getProfile();

      this.name = profile.name || 'Estudiante';

      this.goal = (profile.goalHours || 4) * 3600;

      this.today =
        await this.storage.secondsSince(startOfToday());

      this.tips =
        await this.api.getTips();

      this.error = this.tips.length === 0;

    } catch (error) {

      console.error(
        'Error cargando Dashboard:',
        error
      );

      this.error = true;

    } finally {

      this.loading = false;

    }
  }

  async refresh(event: any) {

    await this.load();

    event.target.complete();

  }

}