import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiFormManagerService } from '../services/ui-form-manager.service';
import { UiFocusRule } from '../services/ui-form-manager.types';

@Component({
  selector: 'pattern-ux-behavior-engine',
  standalone: true,
  imports: [CommonModule, UiFormFieldComponent, UiInputComponent],
  template: `
    <div class="scroll-container">
      <div class="header">
        <h2>UX Behavior Engine Demo</h2>
        <p>El PAL ahora orquesta el foco basado en reglas de negocio y carga cognitiva.</p>
        
        <div class="actions">
          <button class="sb-button-primary" (click)="resolve('FIRST_INVALID')">
            📍 Ir al primer error (DOM)
          </button>
          <button class="sb-button-warning" (click)="resolve('HIGHEST_SEVERITY')">
            🔥 Priorizar Errores Críticos
          </button>
        </div>
      </div>

      <div class="form-grid">
        @for (item of fields; track item.id) {
          <ui-form-field 
            [label]="item.label" 
            [error]="item.error()"
            [required]="true"
            class="demo-field"
          >
            <ui-input [placeholder]="'Enter ' + item.label"></ui-input>
          </ui-form-field>
        }
      </div>

      <div class="footer">
         <p>Fin del Formulario</p>
      </div>
    </div>

    <style>
      .scroll-container { max-width: 600px; margin: 0 auto; padding: 40px; }
      .header { 
        position: sticky; top: 0; background: white; z-index: 10; 
        padding-bottom: 24px; border-bottom: 1px solid #eee; margin-bottom: 32px;
      }
      .actions { display: flex; gap: 12px; margin-top: 16px; }
      .form-grid { display: flex; flex-direction: column; gap: 80px; }
      .demo-field { display: block; }
      .sb-button-primary {
        background: var(--ui-primary, #3f51b5);
        color: white; border: none; padding: 12px 20px; 
        border-radius: 6px; cursor: pointer; font-weight: 600;
        box-shadow: 0 4px 6px rgba(63, 81, 181, 0.2);
      }
      .sb-button-warning {
        background: #f44336;
        color: white; border: none; padding: 12px 20px; 
        border-radius: 6px; cursor: pointer; font-weight: 600;
        box-shadow: 0 4px 6px rgba(244, 67, 54, 0.2);
      }
      .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; text-align: center; }
    </style>
  `
})
class UXBehaviorEngineDemoComponent {
  private formManager = inject(UiFormManagerService);

  fields = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    label: `Campo ${i + 1}`,
    error: signal<string | null>(null)
  }));

  constructor() {
    setTimeout(() => {
      // Un error al principio (posición DOM 3)
      this.fields[2].error.set('Este es un error menor (info)');

      // Un error crítico muy abajo (posición DOM 12)
      this.fields[11].error.set('¡ERROR CRÍTICO! (Prioridad alta)');
    }, 500);
  }

  resolve(rule: UiFocusRule) {
    this.formManager.resolveFocus(rule);
  }
}

const meta: Meta<UXBehaviorEngineDemoComponent> = {
  title: 'Patterns/UX Behavior Engine',
  component: UXBehaviorEngineDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<UXBehaviorEngineDemoComponent>;

export const Demo: Story = {};
