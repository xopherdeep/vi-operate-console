import type { Preview } from "@storybook/react";
import "../src/styles/_globals.css";

// Import theme provider
import { ThemeProvider } from "next-themes";

const preview: Preview = {
  parameters: {
    // Removed argTypesRegex in favor of using fn() in play functions
    actions: { },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
      ],
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    // Apply theme provider to all stories
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;