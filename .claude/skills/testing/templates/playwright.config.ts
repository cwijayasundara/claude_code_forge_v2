import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for E2E tests.
 *
 * Assumes Docker Compose stack is running (backend:8000, frontend:3000, db:5432).
 * The webServer block auto-starts Docker Compose if not already running.
 */
export default defineConfig({
  testDir: '.claude/testing/e2e/flows',
  outputDir: '.claude/testing/e2e/results',

  /* Fail the build on CI if test.only was left in source */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,

  /* Parallel workers — 1 on CI to avoid Docker resource contention */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: [
    ['html', { outputFolder: '.claude/testing/e2e/report' }],
    ['list'],
  ],

  /* Shared settings for all tests */
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  /* Browser projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* Uncomment for cross-browser:
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],

  /* Auto-start Docker Compose stack before tests */
  webServer: [
    {
      command: 'docker compose up',
      url: 'http://localhost:8000/health',
      reuseExistingServer: true,
      timeout: 120000,     // 2 min — covers Docker build + DB init
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: '',         // frontend started by docker compose above
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 60000,
    },
  ],

  /* Global timeout per test */
  timeout: 30000,

  /* Assertion timeout */
  expect: {
    timeout: 10000,
  },
});
