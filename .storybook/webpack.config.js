// .storybook/webpack.config.js

/**
 * This is a custom webpack configuration for Storybook that specifically
 * helps handle Tailwind CSS 4 processing issues.
 */
module.exports = ({ config }) => {
  // Find the existing CSS rule
  const cssRule = config.module.rules.find(
    (rule) => rule.test && rule.test.test('.css')
  );

  // If we found the CSS rule, modify it to skip postcss-loader
  if (cssRule && cssRule.use) {
    // Filter out the postcss-loader to prevent Tailwind processing errors
    cssRule.use = cssRule.use.filter(
      (loader) => !loader.loader || !loader.loader.includes('postcss-loader')
    );
  }

  // Return the modified config
  return config;
};