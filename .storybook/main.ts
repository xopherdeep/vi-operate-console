import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "./stories/*.mdx", 
    "./stories/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {}
    },
  },
  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    // Custom webpack configuration to handle Tailwind CSS 4
    if (config.module && config.module.rules) {
      // Find the existing CSS rule
      const cssRule = config.module.rules.find(
        (rule) => rule.test && rule.test.toString().includes('.css')
      );

      // If we found the CSS rule, modify it to skip postcss-loader
      if (cssRule && Array.isArray(cssRule.use)) {
        // Filter out the postcss-loader to prevent Tailwind processing errors
        cssRule.use = cssRule.use.filter(
          (loader) => {
            if (typeof loader === 'string') {
              return !loader.includes('postcss-loader');
            } else if (typeof loader === 'object' && loader !== null) {
              return !loader.loader || !loader.loader.includes('postcss-loader');
            }
            return true;
          }
        );
      }
    }
    
    // Add alias for @ to point to src directory
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
      };
    }

    return config;
  },
};

export default config;