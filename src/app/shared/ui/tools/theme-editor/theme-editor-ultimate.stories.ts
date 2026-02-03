import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

// Components (Angular Architecture)
import { DemoFormExtendedComponent } from '../../examples/demo-form-extended/demo-form-extended.component';
import { ThemeEditorAdminComponent } from './theme-editor-admin.component';
import { UltimateGridDemoComponent } from './ultimate-grid-demo.component';

// Services
import { provideThemeService } from '../../../../core/services/theme.service';
import { BRAND_PRESETS } from '../../../../core/services/ui-brand-presets';

const meta: Meta<ThemeEditorAdminComponent> = {
    title: 'PAL/Theme Editor Admin Live Preview',
    component: ThemeEditorAdminComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                DemoFormExtendedComponent,
                ThemeEditorAdminComponent,
                UltimateGridDemoComponent
            ],
            providers: [...provideThemeService()],
        }),
    ],
    parameters: {
        layout: 'fullscreen',
        chromatic: { disableSnapshot: false, delay: 2000 },
        tags: ['critical'],
    },
};

export default meta;
type Story = StoryObj<ThemeEditorAdminComponent>;

export const LivePreviewSelector: Story = {
    name: 'Live Preview Selector',
    render: () => ({
        template: `<ui-theme-editor-admin></ui-theme-editor-admin>`,
    }),
};

export const UltimateMatrix: Story = {
    name: 'Ultimate Matrix',
    render: () => ({
        template: `<app-ultimate-grid-demo></app-ultimate-grid-demo>`,
    }),
};
