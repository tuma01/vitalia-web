import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { withTenantTheme } from './tenant-theme.decorator';

/**
 * 🔘 UiButton Multi-Tenant Showcase
 * 
 * Demonstrates how buttons adapt their variants and custom CSS 
 * (like border-radius or text-transform) per tenant.
 */
const meta: Meta<UiButtonComponent> = {
    title: 'PAL/Demos/Multi-Tenant/Button',
    component: UiButtonComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, UiButtonComponent],
        })
    ],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
};

export default meta;
type Story = StoryObj<UiButtonComponent & { label: string }>;

export const VitaliaDefault: Story = {
    decorators: [withTenantTheme('vitalia')],
    render: (args) => ({
        props: args,
        template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <ui-button [variant]="variant" [size]="size" [loading]="loading" [disabled]="disabled">
            {{ label }}
        </ui-button>
        <ui-button variant="outline" [size]="size">Cancelar</ui-button>
      </div>
    `,
    }),
    args: {
        label: 'Guardar Cambios',
        variant: 'primary',
        size: 'md',
        loading: false,
        disabled: false
    },
};

export const ClinicaVerde: Story = {
    decorators: [withTenantTheme('clinica_verde')],
    render: (args) => ({
        props: args,
        template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <ui-button [variant]="variant" [size]="size">
            {{ label }}
        </ui-button>
        <ui-button variant="secondary" [size]="size">Siguiente</ui-button>
      </div>
    `,
    }),
    args: {
        ...VitaliaDefault.args,
        label: 'Confirmar Cita',
    },
};

export const HospitalModerno: Story = {
    decorators: [withTenantTheme('hospital_moderno')],
    render: (args) => ({
        props: args,
        template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <ui-button [variant]="variant" [size]="size">
            {{ label }}
        </ui-button>
        <ui-button variant="ghost" [size]="size">Omitir</ui-button>
      </div>
    `,
    }),
    args: {
        ...VitaliaDefault.args,
        label: 'Iniciar Proceso',
    },
};

export const DarkPremium: Story = {
    decorators: [withTenantTheme('dark_premium')],
    render: (args) => ({
        props: args,
        template: `
      <div style="padding: 24px; background: var(--ui-surface-background); min-height: 100px; display: flex; gap: 12px; align-items: center;">
        <ui-button [variant]="variant" [size]="size">
            {{ label }}
        </ui-button>
        <ui-button variant="danger" [size]="size">Eliminar</ui-button>
      </div>
    `,
    }),
    args: {
        ...VitaliaDefault.args,
        label: 'Upgrade Account',
        variant: 'primary'
    },
};
