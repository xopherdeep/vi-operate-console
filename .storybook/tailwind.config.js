const path = require('path');
const mainTailwindConfig = require('../tailwind.config.js');

module.exports = {
  ...mainTailwindConfig,
  content: [
    '../src/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...mainTailwindConfig.theme,
    extend: {
      ...mainTailwindConfig.theme?.extend,
      borderColor: {
        ...mainTailwindConfig.theme?.extend?.borderColor,
        border: 'var(--border)',
      },
    },
  },
};