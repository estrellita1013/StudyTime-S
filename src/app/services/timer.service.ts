import { Injectable, computed, signal } from '@angular/core';
import { ActivityType } from '../models/models';
import { fmtClock } from '../utils/time';

@Injectable({ providedIn: 'root' })
export class TimerService {
  seconds = signal(0);
  running = signal(false);
  type = signal<ActivityType>('estudio');
  targetMin = signal(45);
  subject = signal('');   // materia elegida en Estudiar
  topic = signal('');     // tema elegido en Estudiar
  display = computed(() => fmtClock(this.seconds()));
  private handle: any;

  start() {
    if (this.running()) return;
    this.running.set(true);
    const t0 = Date.now() - this.seconds() * 1000; // se calcula con la hora real, no se desfasa
    this.handle = setInterval(() => this.seconds.set(Math.floor((Date.now() - t0) / 1000)), 250);
  }
  pause() { clearInterval(this.handle); this.running.set(false); }
  reset() { this.pause(); this.seconds.set(0); }
}