import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Fitur Ganti Foto Profil - Aturan Validasi dan Pembaruan Real-Time', () => {
  test.beforeEach(async ({ page }) => {
    // Login sebagai mahasiswa
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('pengguna1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard|.*riwayat-laporan|.*buat-laporan/, { timeout: 10000 });
  });

  test('Validasi format berkas: menolak berkas selain JPG, PNG, atau WEBP', async ({ page }) => {
    // 1. Buka dropdown profil
    const profileTrigger = page.locator('[data-testid="profile-dropdown-trigger"]');
    await profileTrigger.click();

    const fileInput = page.locator('[data-testid="avatar-file-input"]');
    const invalidFilePath = path.join(__dirname, 'fixtures', 'invalid-doc.txt');

    // 2. Unggah berkas dokumen teks
    await fileInput.setInputFiles(invalidFilePath);

    // 3. Verifikasi pesan error format berkas muncul
    const errorMsg = page.locator('[data-testid="avatar-error-message"]');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
    await expect(errorMsg).toContainText('Format file tidak didukung');
  });

  test('Validasi ukuran minimal berkas: menolak foto di bawah 5 KB', async ({ page }) => {
    // 1. Buka dropdown profil
    const profileTrigger = page.locator('[data-testid="profile-dropdown-trigger"]');
    await profileTrigger.click();

    const fileInput = page.locator('[data-testid="avatar-file-input"]');
    const tinyFilePath = path.join(__dirname, 'fixtures', 'tiny-avatar.png');

    // 2. Unggah berkas gambar berukuran di bawah 5 KB
    await fileInput.setInputFiles(tinyFilePath);

    // 3. Verifikasi pesan error ukuran minimal muncul
    const errorMsg = page.locator('[data-testid="avatar-error-message"]');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
    await expect(errorMsg).toContainText('Ukuran foto terlalu kecil. Minimal 5 KB.');
  });

  test('Validasi resolusi dimensi gambar: menolak foto dengan dimensi di bawah 150x150 piksel', async ({ page }) => {
    // 1. Buka dropdown profil
    const profileTrigger = page.locator('[data-testid="profile-dropdown-trigger"]');
    await profileTrigger.click();

    const fileInput = page.locator('[data-testid="avatar-file-input"]');
    const lowResFilePath = path.join(__dirname, 'fixtures', 'lowres-avatar-50x50.png');

    // 2. Unggah berkas gambar dengan dimensi 50x50 piksel
    await fileInput.setInputFiles(lowResFilePath);

    // 3. Verifikasi pesan error resolusi minimal muncul
    const errorMsg = page.locator('[data-testid="avatar-error-message"]');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
    await expect(errorMsg).toContainText('Resolusi foto terlalu kecil. Minimal 150 x 150 piksel.');
  });

  test('Unggah foto profil valid: berhasil memperbarui foto profil seketika', async ({ page }) => {
    // 1. Buka dropdown profil
    const profileTrigger = page.locator('[data-testid="profile-dropdown-trigger"]');
    await profileTrigger.click();

    const fileInput = page.locator('[data-testid="avatar-file-input"]');
    const validFilePath = path.join(__dirname, 'fixtures', 'valid-avatar-200x200.png');

    // Ambil src gambar avatar sebelum diubah
    const avatarImg = page.locator('[data-testid="profile-dropdown-avatar-img"]');
    const oldSrc = await avatarImg.getAttribute('src');

    // 2. Unggah berkas gambar valid (dimensi 200x200 dan ukuran >= 5 KB)
    await fileInput.setInputFiles(validFilePath);

    // 3. Verifikasi pesan sukses muncul
    const successMsg = page.locator('[data-testid="avatar-success-message"]');
    await expect(successMsg).toBeVisible({ timeout: 8000 });
    await expect(successMsg).toContainText('Foto profil berhasil diperbarui.');

    // 4. Verifikasi bahwa src gambar berubah
    await page.waitForTimeout(1000);
    const newSrc = await avatarImg.getAttribute('src');
    expect(newSrc).toBeTruthy();
    expect(newSrc).not.toBe(oldSrc);
  });
});
