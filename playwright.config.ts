import { defineConfig } from '@playwright/test';

const config = defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
export default config;
