import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Desktop Large', width: 1440, height: 900 },
  { name: 'Desktop Standard', width: 1280, height: 720 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Mobile Large', width: 425, height: 800 },
  { name: 'Mobile Standard', width: 375, height: 667 },
  { name: 'Mobile Small', width: 320, height: 568 },
];

test.describe('Audit Responsivitas UI di Berbagai Device', () => {

  for (const vp of viewports) {
    test(`Pemeriksaan Responsivitas Halaman Login [${vp.name}: ${vp.width}x${vp.height}]`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

      // Cek apakah ada horizontal overflow yang merusak UI
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // toleransi 2px subpixel rounding
    });

    test(`Pemeriksaan Responsivitas Dashboard Pelapor [${vp.name}: ${vp.width}x${vp.height}]`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/login');
      await page.locator('input[type="email"]').fill('pengguna1@telkomuniversity.ac.id');
      await page.locator('input[type="password"]').fill('Password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForURL(/.*dashboard/, { timeout: 10000 });

      // Verifikasi komponen utama terlihat
      await expect(page.locator('text=Halo,')).toBeVisible();

      // Cek horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    });

    test(`Pemeriksaan Responsivitas Form Buat Laporan [${vp.name}: ${vp.width}x${vp.height}]`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/login');
      await page.locator('input[type="email"]').fill('pengguna1@telkomuniversity.ac.id');
      await page.locator('input[type="password"]').fill('Password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForURL(/.*dashboard/, { timeout: 10000 });

      await page.goto('/buat-laporan');
      await page.waitForURL(/.*buat-laporan/, { timeout: 10000 });

      // Verifikasi form terlihat
      await expect(page.locator('h3:has-text("Identitas Pelapor")')).toBeVisible();
      await expect(page.locator('h3:has-text("Form Laporan")')).toBeVisible();

      // Cek horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    });

    test(`Pemeriksaan Responsivitas Dashboard Admin [${vp.name}: ${vp.width}x${vp.height}]`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/login');
      await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
      await page.locator('input[type="password"]').fill('Admin123');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForURL(/.*admin\/dashboard/, { timeout: 10000 });

      // Verifikasi metrik admin terlihat
      await expect(page.locator('text=Total Laporan Masuk')).toBeVisible();

      // Cek horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    });
  }

});
