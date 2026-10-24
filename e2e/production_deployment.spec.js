import { test, expect } from '@playwright/test';

const PROD_URL = 'https://cares-fe.vercel.app';

test.describe('E2E Verification on Production Deployment (Vercel + Azure VM)', () => {

  test('1. Verifikasi Autentikasi Admin & Dashboard Operasional', async ({ page }) => {
    // 1. Kunjungi halaman login
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

    // 4. Periksa kartu metrik operasional terisi data dari database Azure VM
    await expect(page.locator('text=Menunggu Verifikasi').first()).toBeVisible();
    await expect(page.locator('text=Laporan Diproses')).toBeVisible();
    await expect(page.locator('text=Laporan Selesai')).toBeVisible();
    await expect(page.locator('text=Laporan Ditolak')).toBeVisible();

    // 5. Periksa tabel laporan terbaru
    await expect(page.locator('h2:has-text("Laporan Terbaru")')).toBeVisible();
  });

  test('2. Verifikasi Halaman Daftar Laporan Admin, Filter & Bulk Action', async ({ page }) => {
    // 1. Login sebagai Admin
    await page.goto(`${PROD_URL}/login`);
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 15000 });

    // 2. Navigasi ke Halaman Daftar Laporan via sidebar
    const daftarLaporanLink = page.locator('a[href="/admin/daftar-laporan"]').or(page.locator('text=Daftar Laporan')).first();
    await daftarLaporanLink.click();
    await page.waitForURL(/.*admin\/daftar-laporan/, { timeout: 15000 });

    // 3. Verifikasi elemen filter di halaman Daftar Laporan
    await expect(page.locator('text=Sort by:')).toBeVisible({ timeout: 10000 });
    const sortSelect = page.locator('select').first();
    await expect(sortSelect).toBeVisible();

    // 4. Verifikasi tombol "Pilih beberapa" (Bulk selection)
    await expect(page.locator('button:has-text("Pilih beberapa")')).toBeVisible();
  });

  test('3. Verifikasi Autentikasi Pelapor, Dashboard, Form Buat Laporan & Riwayat', async ({ page }) => {
    // 1. Kunjungi halaman login
    await page.goto(`${PROD_URL}/login`);
    await page.locator('input[type="email"]').fill('pengguna1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Verifikasi pengalihan sukses ke Dashboard Pelapor (/dashboard)
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });
    await expect(page.locator('text=Halo, Pengguna').or(page.locator('text=Pengguna Satu'))).toBeVisible({ timeout: 15000 });

    // 3. Navigasi ke Form Buat Laporan melalui tombol "Buat Laporan"
    const buatLaporanBtn = page.getByRole('button', { name: 'Buat Laporan' }).first();
    await buatLaporanBtn.click();
    await page.waitForURL(/.*buat-laporan/, { timeout: 15000 });

    // 4. Verifikasi komponen form laporan dan identitas pelapor termuat
    await expect(page.locator('h3:has-text("Identitas Pelapor")')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h3:has-text("Form Laporan")')).toBeVisible({ timeout: 15000 });

    // 5. Navigasi ke Riwayat Laporan melalui navigasi menu
    const riwayatLink = page.locator('a[href="/riwayat-laporan"]').or(page.locator('text=Riwayat Laporan')).first();
    await riwayatLink.click();
    await page.waitForURL(/.*riwayat-laporan/, { timeout: 15000 });
    await expect(page.locator('h1:has-text("Riwayat Laporan")').or(page.locator('text=Riwayat Laporan').first())).toBeVisible({ timeout: 15000 });
  });

});
