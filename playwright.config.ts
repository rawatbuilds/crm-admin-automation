import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './automated-tests',
  fullyParallel: false,
  workers: 1,

  reporter: [
    ['list'],
    ['html', { open: 'always' }]   // change to 'always' if you want (on-failure)
  ],

  use: {
    baseURL: 'https://qa-mdashboard.dev.gokwik.in',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    launchOptions: {
    slowMo: 800, // 👈 800ms delay between actions
  },
  },
});