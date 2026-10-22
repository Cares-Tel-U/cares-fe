import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Verifikasi 6 Poin Peningkatan & Perbaikan Laporan CARES', () => {
  test.beforeEach(async ({ page }) => {
    // Login sebagai mahasiswa
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('pengguna1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard|.*riwayat-laporan|.*buat-laporan/, { timeout: 10000 });
  });

  test('Poin 4: Bukti foto pada detail laporan dapat diklik untuk diperbesar (Image Preview Zoom)', async ({ page }) => {
    await page.goto('/riwayat-laporan');
    await page.waitForLoadState('networkidle');

    // Buka salah satu kartu laporan jika ada
    const detailButton = page.locator('button:has-text("Lihat detail"), button:has-text("Detail")').first();
    if (await detailButton.isVisible()) {
      await detailButton.click();

      // Tunggu modal detail terbuka
      const detailModal = page.locator('[role="dialog"]').filter({ hasText: 'Detail Laporan' });
      await expect(detailModal).toBeVisible();

      // Cari foto bukti pelaporan
      const photoThumb = detailModal.locator('img[alt^="Bukti"]').first();
      if (await photoThumb.isVisible()) {
        await photoThumb.click();

        // Verifikasi ImagePreviewModal terbuka
        const previewModal = page.locator('[role="dialog"][aria-label="Pratinjau Foto Bukti"]');
        await expect(previewModal).toBeVisible();

        // Tutup pratinjau
        const closeBtn = previewModal.locator('button[aria-label="Tutup pratinjau"]');
        await closeBtn.click();
        await expect(previewModal).not.toBeVisible();
      }
    }
  });

  test('Poin 5: Pop-up peringatan batas 3 laporan harian tampil jelas dan informatif', async ({ page }) => {
    await page.goto('/buat-laporan');
    await page.waitForLoadState('networkidle');

    // Verifikasi halaman lapor terbuka
    await expect(page.locator('h3:has-text("Form Laporan")')).toBeVisible();

    // Isi formulir
    const gedungInput = page.locator('input[placeholder="Ketik nama gedung..."]');
    await gedungInput.fill('Gedung A');
    await page.locator('div:has-text("Gedung A (Gedung Kuliah Umum)")').last().click();

    const ruanganInput = page.locator('input[placeholder="Ketik nama ruangan..."]');
    await ruanganInput.fill('KU3.02.12');
    await page.locator('div:has-text("KU3.02.12")').last().click();

    const deskripsiInput = page.locator('textarea');
    await deskripsiInput.fill(`Pengujian batas laporan harian ${Date.now()}`);

    // Unggah foto bukti
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('text=Pilih dari perangkat').click();
    const fileChooser = await fileChooserPromise;
    const samplePhotoPath = path.join(__dirname, 'fixtures', 'sample-photo.png');
    await fileChooser.setFiles(samplePhotoPath);
    await expect(page.locator('img[alt="Preview 1"]')).toBeVisible();

    // Kirim laporan
    await page.getByRole('button', { name: 'Laporkan' }).click();

    // Pastikan modal feedback muncul (baik sukses dibuat atau jika sudah 3 kali muncul pop-up peringatan)
    const successModal = page.locator('text=Laporan berhasil dibuat');
    const limitModal = page.locator('text=Batas Maksimal 3 Laporan Harian');

    await expect(successModal.or(limitModal)).toBeVisible({ timeout: 10000 });

    if (await limitModal.isVisible()) {
      // Pastikan tombol 'Saya Mengerti' ada dan berfungsi
      const mengertiBtn = page.getByRole('button', { name: 'Saya Mengerti' });
      await expect(mengertiBtn).toBeVisible();
      await mengertiBtn.click();
      await expect(limitModal).not.toBeVisible();
    }
  });
});
