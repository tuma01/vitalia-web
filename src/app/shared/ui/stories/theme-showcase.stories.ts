import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { ThemeShowcaseComponent } from './theme-showcase.component';
import { ThemeService } from '../../../core/services/theme.service';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<ThemeShowcaseComponent> = {
    title: 'Platform/Design System/Theme Showcase',
    component: ThemeShowcaseComponent,
    decorators: [
        applicationConfig({
            providers: [
                ThemeService,
                importProvidersFrom(BrowserAnimationsModule)
            ],
        }),
    ],
    argTypes: {
        brand: {
            control: 'select',
            options: ['vitalia', 'school'],
            description: 'Sector-specific brand identity'
        },
        mode: {
            control: 'radio',
            options: ['light', 'dark'],
            description: 'Color mode'
        },
        primaryColor: { control: 'color' },
        secondaryColor: { control: 'color' },
        linkColor: { control: 'color' },
        accentColor: { control: 'color' },
        fontFamily: { control: 'text' }
    } as any
};

export default meta;
type Story = StoryObj<ThemeShowcaseComponent>;

export const Interactive: Story = {
    args: {
        brand: 'vitalia',
        mode: 'light',
        primaryColor: '#0055A4',
        secondaryColor: '#00AABB',
        linkColor: '#2563EB',
        accentColor: '#F59E0B',
        fontFamily: 'Inter, sans-serif'
    } as any,
    render: (args: any) => ({
        props: {
            themeConfig: {
                brand: args.brand,
                mode: args.mode,
                overrides: {
                    primaryColor: args.primaryColor,
                    secondaryColor: args.secondaryColor,
                    linkColor: args.linkColor,
                    accentColor: args.accentColor,
                    fontFamily: args.fontFamily
                }
            }
        },
    }),
};

export const VitaliaHealth: Story = {
    args: {
        brand: 'vitalia',
        mode: 'light',
    } as any
};

export const ModernSchool: Story = {
    args: {
        brand: 'school',
        mode: 'light',
        primaryColor: '#4F46E5', // Indigo school
        secondaryColor: '#EC4899' // Pink accents
    } as any
};

export const DarkModeTenant: Story = {
    args: {
        brand: 'vitalia',
        mode: 'dark',
        primaryColor: '#90CAF9',
        secondaryColor: '#F48FB1'
    } as any
};
