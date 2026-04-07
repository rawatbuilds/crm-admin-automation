import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './automated-tests',
  fullyParallel: false,
  workers: 1,
  timeout: process.env.CI ? 60000 : 30000,
  reporter: [
    ['list'],
    ['html', { open: process.env.CI ? 'never' : 'always' }]
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://qa-mdashboard.dev.gokwik.in',
    headless: process.env.CI ? true : false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: process.env.CI ? 0 : 800,
    },
  },
});