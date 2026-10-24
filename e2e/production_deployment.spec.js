import { test, expect } from '@playwright/test';

const PROD_URL = 'https://cares-fe.vercel.app';

test.describe('E2E Verification on Production Deployment (Vercel + Azure VM)', () => {

  test('1. Verifikasi Halaman Login & Autentikasi Admin', async ({ page }) => {
    // 1. Kunjungi halaman login produksi
    await page.goto(`${PROD_URL}/login`);
    await expect(page).toHaveTitle(/CARES/i);
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 });

    // 2. Login menggunakan kredensial Admin Seeder
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    // 3. Verifikasi pengalihan sukses ke Dashboard Admin
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 15000 });
    await expect(page.locator('text=Total Laporan Masuk')).toBeVisible({ timeout: 15000 });

    // 4. Periksa kartu metrik operasional
    await expect(page.locator('text=Menunggu Verifikasi').first()).toBeVisible();
    await expect(page.locator('text=Laporan Diproses')).toBeVisible();
    await expect(page.locator('text=Laporan Selesai')).toBeVisible();
  });

  test('2. Verifikasi Halaman Daftar Laporan Admin & Filter', async ({ page }) => {
    // 1. Login sebagai Admin
    await page.goto(`${PROD_URL}/login`);
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 15000 });

    // 2. Navigasi ke Halaman Daftar Laporan
    await page.goto(`${PROD_URL}/admin/laporan`);
    await expect(page.locator('text=Daftar Laporan Kerusakan').or(page.locator('h1'))).toBeVisible({ timeout: 15000 });

    // 3. Verifikasi data laporan termuat dari backend Azure VM
    const tableOrCard = page.locator('table').or(page.locator('text=ID Laporan').or(page.locator('text=Daftar Laporan')));
    await expect(tableOrCard.first()).toBeVisible({ timeout: 15000 });
  });

  test('3. Verifikasi Autentikasi Pelapor & Navigasi Dashboard Pelapor', async ({ page }) => {
    // 1. Kunjungi halaman login
    await page.goto(`${PROD_URL}/login`);
    await page.locator('input[type="email"]').fill('pengguna1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Verifikasi pengalihan sukses ke Dashboard Pelapor
    await page.waitForURL(/.*pelapor\/dashboard/, { timeout: 15000 });
    await expect(page.locator('text=Halo, Pengguna').or(page.locator('text=Pengguna Satu'))).toBeVisible({ timeout: 15000 });

    // 3. Verifikasi tombol Buat Laporan dan Riwayat Laporan
    await expect(page.locator('text=Buat Laporan').first()).toBeVisible();

    // 4. Navigasi ke Form Buat Laporan
    await page.goto(`${PROD_URL}/pelapor/lapor`);
    await expect(page.locator('input[name="judul"]').or(page.locator('input[placeholder*="judul" i]'))).toBeVisible({ timeout: 15000 });

    // 5. Navigasi ke Riwayat Laporan Pelapor
    await page.goto(`${PROD_URL}/pelapor/riwayat`);
    await expect(page.locator('text=Riwayat Laporan').first()).toBeVisible({ timeout: 15000 });
  });

});
