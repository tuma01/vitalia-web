import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { MatButtonModule } from '@angular/material/button';
import { withTenantTheme } from './tenant-theme.decorator';

const meta: Meta<UiButtonComponent> = {
  title: 'PAL/Demos/Final/Button',
  component: UiButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, UiButtonComponent, MatButtonModule],
    })
  ]
};

export default meta;
type Story = StoryObj<UiButtonComponent & { label: string }>;

export const TenantA_Light_Default: Story = {
  decorators: [withTenantTheme('tenantA', 'light', 'default')],
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 20px; display: flex; gap: 10px;">
        <ui-button variant="primary" [disabled]="disabled">{{ label }}</ui-button>
        <ui-button variant="outline">Cancelar</ui-button>
      </div>
    `,
  }),
  args: {
    label: 'Guardar Cambios',
    disabled: false
  },
};

export const TenantB_Dark_Compact: Story = {
  decorators: [withTenantTheme('tenantB', 'dark', 'compact')],
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 20px; background: var(--ui-surface-background); display: flex; gap: 10px; min-height: 100px;">
        <ui-button variant="primary" [disabled]="disabled">{{ label }}</ui-button>
        <ui-button variant="secondary">Siguiente</ui-button>
      </div>
    `,
  }),
  args: {
    label: 'CONFIRMAR',
    disabled: false
  },
};
