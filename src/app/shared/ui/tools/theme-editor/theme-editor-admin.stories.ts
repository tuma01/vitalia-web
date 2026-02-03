import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

// Components
import { ThemeEditorAdminComponent } from './theme-editor-admin.component';
import { UiFormFieldComponent } from '../../components/form-field/ui-form-field.component';
import { provideThemeService } from '../../../../core/services/theme.service';

const meta: Meta<ThemeEditorAdminComponent> = {
    title: 'PAL/Demo/Theme Editor Admin Live Preview',
    component: ThemeEditorAdminComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, ThemeEditorAdminComponent, UiFormFieldComponent],
            providers: [...provideThemeService()],
        }),
    ],
    parameters: {
        layout: 'fullscreen',
        chromatic: { disableSnapshot: false },
        tags: ['critical'],
    },
};

export default meta;
type Story = StoryObj<ThemeEditorAdminComponent>;

export const LiveSandbox: Story = {
    name: 'Live Sandbox',
    render: () => ({
        template: `<ui-theme-editor-admin></ui-theme-editor-admin>`,
    }),
};

export const Default: Story = {
    name: 'Theme Editor Console',
    render: () => ({
        template: `<ui-theme-editor-admin></ui-theme-editor-admin>`,
    }),
};
