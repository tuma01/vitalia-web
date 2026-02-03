import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

// components
import { DemoFormExtendedComponent, DemoUIState } from './demo-form-extended.component';
import { provideThemeService } from '../../../../core/services/theme.service';
import { UiColorMode } from '../../../../core/services/ui-theme.types';

/**
 * 🧪 Experience Sandbox: Extended States Matrix
 * 
 * Este sandbox valida el 100% de las permutaciones críticas:
 * Brand x Mode x UI State.
 */
const meta: Meta = {
    title: 'PAL/Examples/Extended Matrix Sandbox',
    component: DemoFormExtendedComponent,
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
type Story = StoryObj;

const BRANDS = ['vitalia', 'school'] as const;
const MODES: UiColorMode[] = ['light', 'dark'];
const STATES: DemoUIState[] = ['default', 'focused', 'filled', 'error', 'disabled', 'required'];

// --- Dynamic Combinations Generator ---
const combinations = BRANDS.flatMap(brand =>
    MODES.flatMap(mode =>
        STATES.map(state => ({
            brand,
            mode,
            state,
            label: `${brand.toUpperCase()} | ${mode.toUpperCase()} | ${state.toUpperCase()}`
        }))
    )
);

/**
 * 🚀 Matriz Industrial de Estados Críticos
 * 
 * Captura masiva de baselines para Chromatic.
 */
export const ChromaticExtendedMatrix: Story = {
    name: 'Full States Matrix (Chrome-ready)',
    render: () => ({
        props: { combinations },
        template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; padding: 24px; background: #e2e8f0; min-height: 100vh;">
        <div *ngFor="let c of combinations" style="display: flex; flex-direction: column; gap: 8px;">
          <h5 style="margin: 0; font-family: 'Inter', sans-serif; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">{{ c.label }}</h5>
          <app-demo-form-extended [brand]="c.brand" [mode]="c.mode" [state]="c.state"></app-demo-form-extended>
        </div>
      </div>
    `
    })
};

/**
 * 🏥 Vitalia Health - All States
 */
export const Vitalia_All_States: Story = {
    name: 'Vitalia Health | All States',
    render: () => ({
        props: {
            brand: 'vitalia',
            states: STATES
        },
        template: `
            <div style="display: flex; gap: 24px; overflow-x: auto; padding: 24px; background: #f8fafc;">
                <div *ngFor="let s of states" style="min-width: 320px;">
                    <app-demo-form-extended [brand]="brand" mode="light" [state]="s"></app-demo-form-extended>
                    <div style="margin-top: 16px;">
                        <app-demo-form-extended [brand]="brand" mode="dark" [state]="s"></app-demo-form-extended>
                    </div>
                </div>
            </div>
        `
    })
};
