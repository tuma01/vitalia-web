import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiTimepickerI18n, DEFAULT_PAL_I18N } from '../../config/ui-i18n.types';

@Component({
  selector: 'ui-time-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-time-selector.component.html',
  styles: [`
    :host {
      display: block;
      width: 260px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(229, 231, 235, 0.5);
      border-radius: 16px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      color: #4b5563;
      font-family: inherit;
      user-select: none;
      box-sizing: border-box;
    }

    .ui-time-selector__header {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
      font-weight: 700;
      color: #1f2937;
      font-size: 1.1rem;
    }

    .ui-time-selector__columns {
      display: flex;
      gap: 12px;
      height: 200px;
    }

    .ui-time-selector__column {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 85, 164, 0.2) transparent;
      
      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(0, 85, 164, 0.2); border-radius: 4px; }
    }

    .ui-time-selector__item {
      padding: 8px;
      text-align: center;
      cursor: pointer;
      border-radius: 8px;
      font-variant-numeric: tabular-nums;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: 2px;
      
      &:hover:not(.ui-time-selector__item--selected) {
        background: rgba(0, 85, 164, 0.08);
      }
      
      &--selected {
        background: linear-gradient(135deg, #0055A4 0%, #003366 100%);
        color: #ffffff;
        font-weight: 700;
        box-shadow: 0 4px 6px -1px rgba(0, 85, 164, 0.4);
      }
    }

    .ui-time-selector__period {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-left: 12px;
      border-left: 1px solid rgba(0, 0, 0, 0.05);
    }

    .ui-time-selector__footer {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: flex-end;
    }

    .ui-time-selector__set-btn {
      background: #0055A4;
      color: white;
      border: none;
      padding: 6px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover { background: #003366; }
    }

    :host-context(.theme-dark) {
      background: rgba(30, 30, 30, 0.9);
      border-color: rgba(255, 255, 255, 0.1);
      color: #d1d5db;
      .ui-time-selector__header { color: #f3f4f6; }
      .ui-time-selector__item:hover:not(.ui-time-selector__item--selected) { background: rgba(255, 255, 255, 0.1); }
      .ui-time-selector__column { scrollbar-color: rgba(255, 255, 255, 0.1) transparent; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTimeSelectorComponent implements OnInit {
  @Input() initialTime: string = '00:00';
  @Input() format: '12h' | '24h' = '24h';
  @Input() i18n: UiTimepickerI18n = DEFAULT_PAL_I18N.timepicker;
  @Output() timeSelect = new EventEmitter<string>();

  hours = signal<number>(0);
  minutes = signal<number>(0);
  period = signal<'AM' | 'PM'>('AM');

  hourList = computed(() => {
    const limit = this.format === '24h' ? 24 : 12;
    const start = this.format === '24h' ? 0 : 1;
    return Array.from({ length: limit }, (_, i) => i + start);
  });

  minuteList = signal(Array.from({ length: 60 }, (_, i) => i));

  ngOnInit(): void {
    this.parseInitialTime();
  }

  parseInitialTime() {
    if (!this.initialTime) return;
    const [h, m] = this.initialTime.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      if (this.format === '12h') {
        this.period.set(h >= 12 ? 'PM' : 'AM');
        const h12 = h % 12 || 12;
        this.hours.set(h12);
      } else {
        this.hours.set(h);
      }
      this.minutes.set(m);
    }
  }

  selectHour(h: number) {
    this.hours.set(h);
  }

  selectMinute(m: number) {
    this.minutes.set(m);
  }

  selectPeriod(p: 'AM' | 'PM') {
    this.period.set(p);
  }

  confirm() {
    let h = this.hours();
    if (this.format === '12h') {
      if (this.period() === 'PM' && h < 12) h += 12;
      if (this.period() === 'AM' && h === 12) h = 0;
    }
    const hh = h.toString().padStart(2, '0');
    const mm = this.minutes().toString().padStart(2, '0');
    this.timeSelect.emit(`${hh}:${mm}`);
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
