module.exports = {
  // This is a temporary config to help Storybook work with your Tailwind CSS v4 setup
  content: [
    "../src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Add specific problematic classes here
    'border-border',
    'sm:static',
  ],
  theme: {
    extend: {
      borderColor: {
        border: 'var(--border)',
      },
    },
  },
};