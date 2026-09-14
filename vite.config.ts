/// <reference types="vitest/config" />
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Historically @sakaniui/react was consumed as a local `file:` dependency
    // (a sibling repo, not an npm-workspace member) that resolved
    // react/react-dom/lucide-react against its OWN node_modules -- `dedupe`
    // forced every import onto this app's single copy to avoid duplicate-
    // React errors. Now that it's a normal npm dependency there's only ever
    // one copy of each to begin with, so this is a no-op -- left in place
    // since it's harmless and costs nothing to keep.
    dedupe: ['react', 'react-dom', 'lucide-react'],
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(import.meta.dirname, '.storybook'),
        }),
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{ browser: 'chromium' }],
        },
      },
    }],
  },
});
