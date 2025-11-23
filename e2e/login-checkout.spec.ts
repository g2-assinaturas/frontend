import { test, expect, Page, Route, Response } from '@playwright/test';

test.describe('Fluxo login → planos → checkout', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.route('**/auth/login', async (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'fake-token' })
      });
    });
    await page.route('**/subscriptions/plans', async (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'plan_basic', name: 'Basic', price: 4900, currency: 'BRL', interval: 'MONTHLY', active: true },
          { id: 'plan_pro', name: 'Pro', price: 9900, currency: 'BRL', interval: 'MONTHLY', active: true }
        ])
      });
    });
    await page.route('**/subscriptions/checkout', async (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'sub_1', status: 'ACTIVE', plan: { id: 'plan_basic', name: 'Basic', price: 4900 } })
      });
    });
    await page.route('**/subscriptions/current', async (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'sub_1', status: 'ACTIVE', plan: { id: 'plan_basic', name: 'Basic', price: 4900 } })
      });
    });
  });

  test('realiza login, escolhe plano e vê estado da subscrição', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'secret12');
    await page.click('button:has-text("Entrar")');
    
    await page.waitForURL('**/plans');
    await expect(page.getByText('Basic')).toBeVisible();
    await page.click('button[aria-label="Escolher plano Basic"]');
    await page.waitForResponse((r: Response) => r.url().includes('/subscriptions/checkout'));
    await page.goto('http://localhost:3000/dashboard/subscription');
    await expect(page.getByText(/Estado da Subscrição/i)).toBeVisible();
    await expect(page.getByText(/Basic/)).toBeVisible();
  });
});
