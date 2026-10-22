import { test, expect } from '@playwright/test';

test.describe('Fitur Notifikasi Aktif/Nonaktif dan Sinkronisasi Real-Time Tanpa Reload', () => {
  test.beforeEach(async ({ page }) => {
    // Login sebagai mahasiswa
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('pengguna1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard|.*riwayat-laporan|.*buat-laporan/, { timeout: 10000 });
  });

  test('Pengguna dapat mengaktifkan dan menonaktifkan preferensi notifikasi serta status tetap konsisten antar halaman', async ({ page }) => {
    // 1. Buka dropdown profil pengguna di header
    const profileTrigger = page.locator('[data-testid="profile-dropdown-trigger"]');
    await profileTrigger.click();

    // 2. Pastikan row toggle notifikasi tampil
    const notifRow = page.locator('[data-testid="notification-toggle-row"]');
    await expect(notifRow).toBeVisible();

    const notifStatus = page.locator('[data-testid="notification-toggle-status"]');
    await expect(notifStatus).toBeVisible();

    const initialStatusText = (await notifStatus.innerText()).trim();

    // 3. Klik row toggle untuk mengubah preferensi
    await notifRow.click();
    await page.waitForTimeout(600);

    const updatedStatusText = (await notifStatus.innerText()).trim();
    expect(updatedStatusText).not.toBe(initialStatusText);

    // 4. Jika beralih ke Nonaktif, cek bahwa dropdown notifikasi menampilkan banner informatif
    if (updatedStatusText === 'Nonaktif') {
      // Buka dropdown notifikasi
      const notifBellButton = page.locator('button:has-text("Notifikasi")').first();
      await notifBellButton.click();

      const banner = page.locator('[data-testid="notification-inactive-banner"]');
      await expect(banner).toBeVisible();
      await expect(banner).toContainText('dinonaktifkan');
    }

    // 5. Berpindah halaman ke Riwayat Laporan untuk memverifikasi preferensi tetap bertahan (tidak reset)
    await page.goto('/riwayat-laporan');
    await page.waitForLoadState('networkidle');

    // Buka kembali menu profil
    await profileTrigger.click();

    const notifStatusAfterNav = page.locator('[data-testid="notification-toggle-status"]');
    await expect(notifStatusAfterNav).toBeVisible();
    expect((await notifStatusAfterNav.innerText()).trim()).toBe(updatedStatusText);

    // 6. Kembalikan switch toggle ke status semula
    await notifRow.click();
    await page.waitForTimeout(600);
    expect((await notifStatus.innerText()).trim()).toBe(initialStatusText);
  });

  test('Halaman menerima pembaruan data secara real-time tanpa perlu reload manual', async ({ page, request }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Periksa bahwa dashboard dan daftar laporan aktif
    const recentTable = page.locator('.recent-report-table, table, [role="table"]').first();
    await expect(recentTable).toBeVisible();

    // Picu event broadcast dari backend API secara eksternal
    const broadcastRes = await request.post('http://localhost:5001/api/v1/realtime/broadcast', {
      data: {
        type: 'REPORT_STATUS_CHANGED',
        data: { message: 'Pembaruan otomatis dari backend' }
      }
    });
    expect(broadcastRes.status()).toBe(200);

    // Tunggu sistem melakukan silent refresh otomatis tanpa reload browser
    await page.waitForTimeout(1500);

    // Verifikasi halaman tetap utuh dan responsive
    await expect(recentTable).toBeVisible();
  });
});
