import { Injectable, computed, signal } from '@angular/core';
import { ActivityType } from '../models/models';
import { fmtClock } from '../utils/time';

@Injectable({ providedIn: 'root' })
export class TimerService {
  seconds = signal(0);
  running = signal(false);

  type = signal<ActivityType>('estudio');
  targetMin = signal(45);

  subject = signal('');
  topic = signal('');

  display = computed(() => fmtClock(this.seconds()));

  private handle?: ReturnType<typeof setInterval>;
  private startedAt = 0;

  start() {
    if (this.running()) return;

    this.running.set(true);

    // Conserva el tiempo acumulado al reanudar.
    this.startedAt = Date.now() - this.seconds() * 1000;

    this.handle = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startedAt) / 1000);
      this.seconds.set(elapsed);
    }, 250);
  }

  pause() {
    if (this.handle) {
      clearInterval(this.handle);
      this.handle = undefined;
    }

    this.running.set(false);
  }

  reset() {
    this.pause();
    this.seconds.set(0);
    this.startedAt = 0;
  }
}