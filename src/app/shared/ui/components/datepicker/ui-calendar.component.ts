import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  addMonths,
  addDays,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfDay,
  setMonth,
  setYear
} from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { UiDatepickerI18n, DEFAULT_PAL_I18N } from '../../config/ui-i18n.types';

export type UiCalendarView = 'days' | 'months' | 'years';

@Component({
  selector: 'ui-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-calendar.component.html',
  styles: [`
    :host {
      display: block;
      width: 320px;
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

    .ui-calendar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .ui-calendar__month-display {
      font-weight: 700;
      color: #1f2937;
      cursor: pointer;
      font-size: 1.1rem;
      transition: opacity 0.2s;
    }

    .ui-calendar__nav-btn {
      background: transparent;
      border: none;
      color: #1f2937;
      padding: 5px;
      cursor: pointer;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      &:hover { background: rgba(0, 85, 164, 0.08); }
    }

    .ui-calendar__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-bottom: 8px;
      text-align: center;
    }

    .ui-calendar__weekday {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #9ca3af;
    }

    .ui-calendar__days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .ui-calendar__day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      color: inherit;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      &:hover:not(.ui-calendar__day--selected) {
        background: rgba(0, 85, 164, 0.08);
        transform: translateY(-1px);
      }
    }

    .ui-calendar__day--other-month { opacity: 0.3; }

    .ui-calendar__day--today {
      color: #0055A4;
      font-weight: 800;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        bottom: 4px;
        width: 4px;
        height: 4px;
        background: currentColor;
        border-radius: 50%;
      }
    }

    .ui-calendar__day--selected {
      background: linear-gradient(135deg, #0055A4 0%, #003366 100%);
      color: #ffffff;
      font-weight: 700;
      box-shadow: 0 4px 6px -1px rgba(0, 85, 164, 0.4);
      transform: scale(1.1);
      z-index: 1;
    }

    .ui-calendar__footer {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: center;
    }

    .ui-calendar__today-btn {
      background: transparent;
      border: none;
      color: #0055A4;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      padding: 4px 12px;
      border-radius: 4px;
      &:hover { background: rgba(0, 85, 164, 0.08); }
    }

    :host-context(.theme-dark) {
      background: rgba(30, 30, 30, 0.9);
      border-color: rgba(255, 255, 255, 0.1);
      color: #d1d5db;
      .ui-calendar__month-display, .ui-calendar__nav-btn { color: #f3f4f6; }
      .ui-calendar__day:hover:not(.ui-calendar__day--selected) { background: rgba(255, 255, 255, 0.1); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCalendarComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Input() locale: 'es' | 'en' = 'es';
  @Input() i18n: UiDatepickerI18n = DEFAULT_PAL_I18N.datepicker;
  @Output() dateSelect = new EventEmitter<Date>();

  currentDate = signal(startOfDay(new Date()));
  view = signal<UiCalendarView>('days');

  // Computed properties for the grid
  monthLabel = computed(() => {
    const localeObj = this.locale === 'es' ? es : enUS;
    return format(this.currentDate(), 'MMMM yyyy', { locale: localeObj });
  });

  daysOfWeek = computed(() => {
    // If I18N provides labels, they are prioritized. 
    // Usually these start with Sunday as per our DEFAULT_PAL_I18N.
    if (this.i18n.weekdays && this.i18n.weekdays.length === 7) {
      return this.i18n.weekdays;
    }

    // Fallback: Generate labels starting from Sunday to ensure grid alignment
    const localeObj = this.locale === 'es' ? es : enUS;
    const start = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday
    return Array.from({ length: 7 }).map((_, i) =>
      format(addDays(start, i), 'EEEEE', { locale: localeObj })
    );
  });

  calendarDays = computed(() => {
    // CRITICAL: We MUST force weekStartsOn: 0 (Sunday) to match our I18N labels.
    // Otherwise, 'es' locale starts on Monday (1), shifting the whole grid.
    const monthStart = startOfMonth(this.currentDate());
    const monthEnd = endOfMonth(this.currentDate());

    const start = startOfWeek(monthStart, { weekStartsOn: 0 });
    const end = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const today = startOfDay(new Date());

    return eachDayOfInterval({ start, end }).map(date => {
      const normalizedDate = startOfDay(date);
      return {
        date: normalizedDate,
        isCurrentMonth: isSameMonth(normalizedDate, monthStart),
        isToday: isSameDay(normalizedDate, today),
        isSelected: this.selectedDate ? isSameDay(normalizedDate, startOfDay(this.selectedDate)) : false
      };
    });
  });

  ngOnInit(): void {
    if (this.selectedDate) {
      this.currentDate.set(new Date(this.selectedDate));
    }
  }

  nextMonth(): void {
    this.currentDate.update(d => addMonths(d, 1));
  }

  prevMonth(): void {
    this.currentDate.update(d => subMonths(d, 1));
  }

  onDateClick(date: Date): void {
    this.dateSelect.emit(date);
  }

  selectToday(): void {
    this.currentDate.set(new Date());
  }

  toggleView(): void {
    // Basic toggle for now
    this.view.set(this.view() === 'days' ? 'months' : 'days');
  }
}
