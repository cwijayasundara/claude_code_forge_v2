# Playwright E2E Patterns

## Selector Priority

1. `getByRole()` — buttons, links, headings (best)
2. `getByLabel()` — form inputs
3. `getByText()` — visible text
4. `getByTestId()` — last resort (data-testid attribute)

Never use: CSS class selectors, XPath, nth-child.

## Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Document Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('uploads PDF and shows processing status', async ({ page }) => {
    await page.getByRole('button', { name: 'Upload' }).click();
    await page.locator('input[type="file"]').setInputFiles('docs/sample.pdf');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Processing')).toBeVisible({ timeout: 10000 });
  });

  test('rejects non-PDF files', async ({ page }) => {
    await page.getByRole('button', { name: 'Upload' }).click();
    await page.locator('input[type="file"]').setInputFiles('docs/readme.txt');
    await expect(page.getByText('Unsupported file type')).toBeVisible();
  });
});
```

## Config

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.claude/testing/e2e/flows',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'docker compose up',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
```
