import { expect, test } from '@playwright/test';

test('loads the app and runs one simulation interaction', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('NetLogo Browser Lab')).toBeVisible();
  await expect(page.getByTestId('model-list')).toContainText('Wolf Sheep Predation');
  await page.getByRole('button', { name: /traffic basic/i }).click();
  await expect(page.getByRole('heading', { name: 'Traffic Basic', exact: true })).toBeVisible();
  const canvas = page.getByTestId('simulation-canvas');
  await expect(canvas).toBeVisible();
  await page.getByTestId('run-button').click();
  await expect(page.getByText(/tick/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /star on github/i })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/netlogo-browser-lab',
  );
  await expect(page.getByRole('link', { name: /paypal/i })).toHaveAttribute(
    'href',
    'https://www.paypal.com/paypalme/florinbadita',
  );
});
