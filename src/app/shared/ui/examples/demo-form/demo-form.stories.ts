import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

// components
import { DemoFormComponent } from './demo-form.component';
import { provideThemeService } from '../../../../core/services/theme.service';

/**
 * 🧪 Experience Sandbox: DemoForm
 * 
 * Este sandbox integra el motor de temas reactivo en un escenario real de formulario.
 * Valida la consistencia de marcas y modos en una experiencia de usuario completa.
 */
const meta: Meta<DemoFormComponent> = {
    title: 'PAL/Examples/DemoForm Sandbox',
    component: DemoFormComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule],
            providers: [
                provideThemeService()
            ],
        }),
    ],
    tags: ['critical'], // 🛡️ Activador de validación visual Chromatic
};

export default meta;
type Story = StoryObj<DemoFormComponent>;

/**
 * 1. Vitalia Health - Experiencia Clínica Estándar
 */
export const VitaliaHealth_Light: Story = {
    name: 'Vitalia Health (LIGHT)',
    args: {
        brand: 'vitalia',
        mode: 'light',
    }
};

export const VitaliaHealth_Dark: Story = {
    name: 'Vitalia Health (DARK)',
    args: {
        brand: 'vitalia',
        mode: 'dark',
    }
};

/**
 * 2. Vitalia School - Experiencia Educativa
 */
export const VitaliaSchool_Light: Story = {
    name: 'Vitalia School (LIGHT)',
    args: {
        brand: 'school',
        mode: 'light',
    }
};

export const VitaliaSchool_Dark: Story = {
    name: 'Vitalia School (DARK)',
    args: {
        brand: 'school',
        mode: 'dark',
    }
};

/**
 * 3. Matriz Crítica Chromatic (Vista Industrial)
 * 
 * Genera automáticamente todas las combinaciones de Brand x Mode
 * en una grilla de inspección rápida para CI/CD.
 */
export const ChromaticMatrix: Story = {
    name: 'Industrial Validation Matrix (Chrome-ready)',
    render: () => {
        const combinations = [
            { brand: 'vitalia', mode: 'light', label: 'Vitalia Health | LIGHT' },
            { brand: 'vitalia', mode: 'dark', label: 'Vitalia Health | DARK' },
            { brand: 'school', mode: 'light', label: 'Vitalia School | LIGHT' },
            { brand: 'school', mode: 'dark', label: 'Vitalia School | DARK' },
        ];

        return {
            props: { combinations },
            template: `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 32px; padding: 24px; background: #f5f5f5; min-height: 100vh;">
          <div *ngFor="let c of combinations" style="display: flex; flex-direction: column; gap: 12px;">
            <h4 style="margin: 0; font-family: sans-serif; color: #555; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">{{ c.label }}</h4>
            <app-demo-form [brand]="c.brand" [mode]="c.mode"></app-demo-form>
          </div>
        </div>
      `
        };
    }
};
