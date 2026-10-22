import { test, expect } from '@playwright/test';

test.describe('E2E: Validasi Batasan Karakter Input Form Laporan', () => {
  test.beforeEach(async ({ page }) => {
    // Login sebagai mahasiswa
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('pengguna1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard|.*riwayat-laporan|.*buat-laporan/, { timeout: 10000 });

    // Masuk ke halaman buat laporan
    await page.goto('/buat-laporan');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h3:has-text("Form Laporan")')).toBeVisible({ timeout: 10000 });
  });

  test('Validasi batas minimal karakter untuk Nama Gedung, Nama Ruangan, dan Deskripsi', async ({ page }) => {
    // 1. Ketik Nama Gedung < 3 karakter
    const gedungInput = page.locator('input[placeholder*="nama gedung"]');
    await gedungInput.fill('AB');

    // 2. Ketik Nama Ruangan < 3 karakter
    const ruanganInput = page.locator('input[placeholder*="nama ruangan"]');
    await ruanganInput.fill('12');

    // 3. Ketik Deskripsi < 10 karakter
    const deskripsiInput = page.locator('textarea');
    await deskripsiInput.fill('Rusak');

    // 4. Klik submit form
    await page.locator('button[type="submit"]:has-text("Laporkan")').click();

    // 5. Pastikan pesan error minimal karakter muncul pada masing-masing field
    await expect(page.locator('text=Nama gedung minimal 3 karakter')).toBeVisible();
    await expect(page.locator('text=Nama ruangan minimal 3 karakter')).toBeVisible();
    await expect(page.locator('text=Deskripsi masalah minimal 10 karakter')).toBeVisible();
  });

  test('Validasi batas maksimal input dan peringatan batas maksimal hanya muncul saat mencapai batas', async ({ page }) => {
    const deskripsiInput = page.locator('textarea');

    // Saat masih normal/kosong, tidak ada peringatan batas maksimal
    await expect(page.locator('text=Batas maksimal 1000 karakter telah tercapai')).not.toBeVisible();

    // Pastikan atribut maxLength terpasang
    await expect(deskripsiInput).toHaveAttribute('maxlength', '1000');

    const gedungInput = page.locator('input[placeholder*="nama gedung"]');
    await expect(gedungInput).toHaveAttribute('maxlength', '100');

    const ruanganInput = page.locator('input[placeholder*="nama ruangan"]');
    await expect(ruanganInput).toHaveAttribute('maxlength', '100');

    // Isi 1000 karakter penuh untuk memicu pesan batas maksimal
    const maxText = 'A'.repeat(1000);
    await deskripsiInput.fill(maxText);
    await expect(page.locator('text=Batas maksimal 1000 karakter telah tercapai')).toBeVisible();
  });

  test('Pesan error otomatis hilang ketika input memenuhi batas minimal', async ({ page }) => {
    const deskripsiInput = page.locator('textarea');
    await deskripsiInput.fill('Pendek');

    // Submit untuk memicu pesan error
    await page.locator('button[type="submit"]:has-text("Laporkan")').click();
    await expect(page.locator('text=Deskripsi masalah minimal 10 karakter')).toBeVisible();

    // Ketik hingga >= 10 karakter
    await deskripsiInput.fill('Lampu ruangan kuliah padam total');
    await expect(page.locator('text=Deskripsi masalah minimal 10 karakter')).not.toBeVisible();
  });
});
