import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UiToastConfig } from './ui-toast.types';

@Component({
    selector: 'ui-toast',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './ui-toast.component.html',
    styleUrls: ['./ui-toast.component.scss'],
    animations: [
        trigger('toastAnimation', [
            state('visible', style({ transform: 'translateY(0)', opacity: 1 })),
            transition(':enter', [
                style({ transform: 'translateY(20px)', opacity: 0 }),
                animate('300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
            ])
        ])
    ]
})
export class UiToastComponent implements OnInit, OnDestroy {
    @Input() config!: UiToastConfig;
    @Output() closed = new EventEmitter<void>();

    private timer: any;

    ngOnInit(): void {
        const duration = this.config.duration ?? 5000;
        if (duration > 0) {
            this.timer = setTimeout(() => this.dismiss(), duration);
        }
    }

    ngOnDestroy(): void {
        if (this.timer) clearTimeout(this.timer);
    }

    getIcon(): string {
        if (this.config.icon) return this.config.icon;

        switch (this.config.type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'warning': return 'warning';
            default: return 'info';
        }
    }

    dismiss(): void {
        this.closed.emit();
    }
}
