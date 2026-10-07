import { Component } from '@angular/core';
import { IonButton, IonContent, IonIcon, NavController } from '@ionic/angular';
import { ProgressRingComponent } from '../../components/progress-ring/progress-ring.components';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { fmtHM, startOfToday } from '../../utils/time';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, ProgressRingComponent],
  template: `
    <ion-content class="ion-padding">
      <div class="wrap">
        <div class="brand">
          <div class="st-icon-box"><ion-icon name="book-outline"></ion-icon></div>
          <span>StudyTime</span>
        </div>

        <div>
          <app-progress-ring [value]="today / goal">
            <div class="big">{{ fmt(today) }}</div>
            <div class="sub">de {{ goal / 3600 }}h hoy</div>
          </app-progress-ring>
          <h3>Tiempo estudiado hoy</h3>
          <p class="sub">¡Vas por buen camino! Falta poco para tu meta</p>
        </div>

        <div class="actions">
          <ion-button expand="block" class="st-btn" (click)="login()">Iniciar sesión</ion-button>
          <ion-button fill="clear" color="medium" (click)="enter()"><u>Explorar sin cuenta</u></ion-button>
        </div>
      </div>
    </ion-content>`,
  styles: [`
    .wrap { height: 100%; display: flex; flex-direction: column; justify-content: space-between;
            align-items: center; text-align: center; }
    .brand { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 700; margin-top: 24px; }
    .big { font-size: 44px; font-weight: 800; }
    .sub { color: var(--st-gray-400); margin: 4px 0; }
    .actions { width: 100%; display: flex; flex-direction: column; align-items: center; }
  `],
})
export class WelcomePage {
  today = 0;
  goal = 4 * 3600;
  fmt = fmtHM;

  constructor(private storage: StorageService, private auth: AuthService, private nav: NavController) {}

  async ionViewWillEnter() {
    if (await this.auth.isLogged()) { this.enter(); return; } // ya habías iniciado sesión
    const p = await this.storage.getProfile();
    this.goal = p.goalHours * 3600;
    this.today = await this.storage.secondsSince(startOfToday());
  }

  enter() { this.nav.navigateRoot('/tabs/hoy'); }
  login() { this.nav.navigateForward('/login'); }
}