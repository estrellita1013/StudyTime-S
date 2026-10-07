import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-ring',
  standalone: true,
  template: `
    <div class="ring">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" class="bg"></circle>
        <circle cx="60" cy="60" r="52" class="fg"
                [style.stroke-dasharray]="circ" [style.stroke-dashoffset]="offset"></circle>
      </svg>
      <div class="center"><ng-content></ng-content></div>
    </div>`,
  styles: [`
    .ring { position: relative; width: 260px; height: 260px; margin: 0 auto; }
    svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    circle { fill: none; stroke-width: 10; }
    .bg { stroke: var(--st-gray-200); }
    .fg { stroke: var(--st-emerald); stroke-linecap: round; transition: stroke-dashoffset .6s ease; }
    .center { position: absolute; inset: 0; display: flex; flex-direction: column;
              align-items: center; justify-content: center; text-align: center; }
  `],
})
export class ProgressRingComponent {
  @Input() value = 0; // de 0 a 1
  circ = 2 * Math.PI * 52;
  get offset() { return this.circ * (1 - Math.min(1, Math.max(0, this.value))); }
}