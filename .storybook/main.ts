import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    "../src/app/shared/ui/**/*.mdx",
    "../src/app/shared/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
    "@storybook/addon-viewport"
  ],
  framework: {
    name: "@storybook/angular",
    options: {}
  },
  docs: {
    autodocs: true
  },
  webpackFinal: async (config) => {
    // Handle circular dependencies
    if (config.optimization) {
      config.optimization.usedExports = false;
    }

    // Disable circular dependency warnings
    if (config.ignoreWarnings) {
      config.ignoreWarnings.push(/Circular dependency/);
    } else {
      config.ignoreWarnings = [/Circular dependency/];
    }

    return config;
  }
};
export default config;