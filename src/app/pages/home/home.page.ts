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


  // =========================================
  // CONSEJOS LOCALES
  // =========================================

  private localTips: Tip[] = [
    {
      id: 1,
      title: 'Consejo del día',
      body: 'Organiza tu tiempo y comienza por la tarea más importante.'
    },
    {
      id: 2,
      title: 'Consejo del día',
      body: 'Estudiar un poco cada día es mejor que dejar todo para el último momento.'
    },
    {
      id: 3,
      title: 'Consejo del día',
      body: 'Elimina las distracciones y dedica unos minutos de concentración total a tus estudios.'
    },
    {
      id: 4,
      title: 'Consejo del día',
      body: 'Haz una pausa cuando la necesites. Descansar también forma parte de estudiar bien.'
    },
    {
      id: 5,
      title: 'Consejo del día',
      body: 'Define una meta para cada sesión de estudio y trabaja hasta conseguirla.'
    },
    {
      id: 6,
      title: 'Consejo del día',
      body: 'La constancia convierte pequeños esfuerzos en grandes resultados.'
    }
  ];


  // =========================================
  // ACCESOS RÁPIDOS
  // =========================================

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


  // =========================================
  // ENTRAR AL DASHBOARD
  // =========================================

  ionViewWillEnter() {

    this.load();

  }


  // =========================================
  // CARGAR DASHBOARD
  // =========================================

  async load() {

    this.loading = true;

    this.error = false;


    // =========================================
    // MOSTRAR CONSEJO INMEDIATAMENTE
    // =========================================

    const day =
      new Date().getDate() %
      this.localTips.length;

    this.tips = [
      this.localTips[day]
    ];


    // =========================================
    // CARGAR PERFIL Y TIEMPO
    // =========================================

    try {

      const profile =
        await this.storage.getProfile();

      this.name =
        profile.name || 'Estudiante';

      this.goal =
        (profile.goalHours || 4) * 3600;

      this.today =
        await this.storage.secondsSince(
          startOfToday()
        );

    } catch (error) {

      console.error(
        'Error cargando Dashboard:',
        error
      );

    }


    // =========================================
    // TERMINAR CARGA
    // =========================================

    this.loading = false;

  }


  // =========================================
  // ACTUALIZAR
  // =========================================

  async refresh(event: any) {

    await this.load();

    event.target.complete();

  }

}