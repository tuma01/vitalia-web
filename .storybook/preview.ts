import type { Preview } from '@storybook/angular'
import { setCompodocJson } from "@storybook/addon-docs/angular";
// @ts-ignore
import docJson from "../documentation.json";

// Import global styles - Standard import
import '../src/styles.scss';

// import { applicationConfig } from '@storybook/angular';
// import { ThemeService, provideThemeService } from '../src/app/core/services/theme.service';
// import { BRAND_PRESETS } from '../src/app/core/services/ui-brand-presets';

setCompodocJson(docJson);

export const globalTypes = {
  brand: {
    name: 'Brand',
    description: 'Selecciona la marca para las historias',
    defaultValue: 'vitalia',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'vitalia', title: 'Vitalia Health' },
        { value: 'school', title: 'Vitalia School' },
      ],
    },
  },
  themeMode: {
    name: 'Theme Mode',
    description: 'Modo de color (Light/Dark)',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light Mode' },
        { value: 'dark', title: 'Dark Mode' },
      ],
    },
  },
  dir: {
    name: 'Direction',
    defaultValue: 'ltr',
    toolbar: {
      icon: 'transfer',
      items: [
        { value: 'ltr', title: 'Left to Right (LTR)' },
        { value: 'rtl', title: 'Right to Left (RTL)' },
      ],
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
    }
  },
  decorators: [
    // applicationConfig({
    //   providers: [
    //     ...provideThemeService()
    //   ],
    // }),
    (story, context) => {
      // Basic attribute setting for direct CSS support (optional)
      const dir = context.globals['dir'] || 'ltr';
      document.documentElement.setAttribute('dir', dir);

      // Removed ThemeService interaction to prevent overriding M3 tokens

      return story();
    },
  ],
};

export default preview;