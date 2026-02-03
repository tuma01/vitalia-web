import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

// components
import { DemoFormUltraComponent, DemoFormPattern, DemoUIState } from './demo-form-ultra.component';
import { provideThemeService } from '../../../../core/services/theme.service';
import { UiColorMode } from '../../../../core/services/ui-theme.types';

/**
 * 🧪 Experience Sandbox: Ultra ADVANCED 5D Matrix
 * 
 * La resolución definitiva de gobernanza visual:
 * Brand x Mode x State x Pattern x Component
 */
const meta: Meta = {
    title: 'PAL/Examples/Ultra Matrix Sandbox',
    component: DemoFormUltraComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule],
            providers: [
                provideThemeService()
            ],
        }),
    ],
    parameters: {
        chromatic: { delay: 1000, viewports: [1024] } // Delay alto para asegurar renderizado masivo
    },
    tags: ['critical'], // 🛡️ Activador de validación visual Chromatic
};

export default meta;
type Story = StoryObj;

const BRANDS = ['vitalia', 'school'] as const;
const MODES: UiColorMode[] = ['light', 'dark'];
const STATES: DemoUIState[] = ['default', 'focused', 'filled', 'error', 'disabled', 'required'];
const PATTERNS: DemoFormPattern[] = ['LoginForm', 'MedicalFormSection', 'DataTableFilters'];

// --- Helper for Matrix Rendering ---
const generateCombinations = (pattern: DemoFormPattern) => {
    return BRANDS.flatMap(brand =>
        MODES.flatMap(mode =>
            STATES.map(state => ({
                brand,
                mode,
                state,
                pattern,
                label: `${brand.toUpperCase()} | ${mode.toUpperCase()} | ${state.toUpperCase()}`
            }))
        )
    );
};

/**
 * 🔐 Pattern: Login Form (Ultra Matrix)
 */
export const Login_Ultra_Matrix: Story = {
    name: 'Pattern: Login (Brand x Mode x State)',
    render: () => ({
        props: { combinations: generateCombinations('LoginForm') },
        template: `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; padding: 24px; background: #cbd5e1;">
                <div *ngFor="let c of combinations">
                    <app-demo-form-ultra [brand]="c.brand" [mode]="c.mode" [state]="c.state" [pattern]="c.pattern"></app-demo-form-ultra>
                </div>
            </div>
        `
    })
};

/**
 * 🏥 Pattern: Medical Section (Ultra Matrix)
 */
export const Medical_Ultra_Matrix: Story = {
    name: 'Pattern: Medical (Brand x Mode x State)',
    render: () => ({
        props: { combinations: generateCombinations('MedicalFormSection') },
        template: `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; padding: 24px; background: #94a3b8;">
                <div *ngFor="let c of combinations">
                    <app-demo-form-ultra [brand]="c.brand" [mode]="c.mode" [state]="c.state" [pattern]="c.pattern"></app-demo-form-ultra>
                </div>
            </div>
        `
    })
};

/**
 * 📊 Pattern: Filters (Ultra Matrix)
 */
export const Filters_Ultra_Matrix: Story = {
    name: 'Pattern: Filters (Brand x Mode x State)',
    render: () => ({
        props: { combinations: generateCombinations('DataTableFilters') },
        template: `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; padding: 24px; background: #64748b;">
                <div *ngFor="let c of combinations">
                    <app-demo-form-ultra [brand]="c.brand" [mode]="c.mode" [state]="c.state" [pattern]="c.pattern"></app-demo-form-ultra>
                </div>
            </div>
        `
    })
};

/**
 * 🌌 THE BIG BANG: All Patterns Matrix
 */
export const Full_5D_Matrix: Story = {
    name: 'THE BIG BANG (288 Permutations)',
    render: () => {
        const allCombs = PATTERNS.flatMap(p => generateCombinations(p));
        return {
            props: { combinations: allCombs },
            template: `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 16px; padding: 16px; background: #1e293b;">
                    <div *ngFor="let c of combinations">
                        <app-demo-form-ultra [brand]="c.brand" [mode]="c.mode" [state]="c.state" [pattern]="c.pattern"></app-demo-form-ultra>
                    </div>
                </div>
            `
        };
    }
};
