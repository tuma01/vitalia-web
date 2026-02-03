import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'pal-old-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="pal-old-toast" [class.pal-error]="data.type === 'error'">
       <div class="pal-icon">
         {{ data.type === 'error' ? '!' : 'i' }}
       </div>
       <div class="pal-content">
         <div class="pal-title" *ngIf="data.title">{{ data.title }}</div>
         <div class="pal-message">{{ data.message }}</div>
       </div>
    </div>
  `,
    styles: [`
    .pal-old-toast {
        display: flex;
        padding: 15px;
        background: #333;
        color: white;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        min-width: 300px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        margin-bottom: 10px;
    }
    .pal-error { background: #d9534f; }
    .pal-icon { 
        width: 24px; height: 24px; background: rgba(255,255,255,0.2); 
        border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px;
        font-weight: bold; font-size: 14px;
    }
    .pal-title { font-weight: bold; margin-bottom: 4px; }
    .pal-message { font-size: 13px; opacity: 0.9; }
  `]
})
export class PalOldToastComponent {
    data: any;
    constructor(@Inject('DATA') data: any) {
        this.data = data;
    }
}
