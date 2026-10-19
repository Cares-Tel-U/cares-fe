import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Verifikasi Kesesuaian Data Pembuatan Laporan Pelapor dengan History', () => {
  test('Laporan dengan ruangan custom "ruang a" dan deskripsi "deskrip a" harus tampil sesuai di riwayat laporan', async ({ page }) => {
    const timestamp = Date.now();
    const uniqueEmail = `pelapor_custom_${timestamp}@telkomuniversity.ac.id`;
    const uniqueNim = `130${String(timestamp).slice(-7)}`;
    const testRuangan = `ruang a ${timestamp}`;
    const testGedung = `gedung a ${timestamp}`;
    const testDeskripsi = `deskrip a kerusakan fasilitas ${timestamp}`;

    // 1. Registrasi Akun Pelapor Baru agar memiliki kuota laporan bersih
    await page.goto('/register');
    await page.locator('input[placeholder="Masukkan nama lengkap"]').fill('Pelapor Custom Data');
    await page.locator('input[type="email"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Masukkan nomor induk mahasiswa/pegawai"]').fill(uniqueNim);
    await page.locator('input[type="password"]').fill('Password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.waitForURL(/.*login/, { timeout: 10000 });

    // 2. Login dengan akun yang baru dibuat
    await page.locator('input[type="email"]').fill(uniqueEmail);
    await page.locator('input[type="password"]').fill('Password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });

    // 3. Buka Halaman Buat Laporan
    await page.goto('/buat-laporan');
    await expect(page.locator('h3:has-text("Form Laporan")')).toBeVisible({ timeout: 10000 });

    // 4. Masukkan Gedung Custom ("gedung a")
    const gedungInput = page.locator('input[placeholder="Ketik nama gedung..."]');
    await gedungInput.fill(testGedung);

    // 5. Masukkan Ruangan Custom ("ruang a")
    const ruanganInput = page.locator('input[placeholder="Ketik nama ruangan..."]');
    await ruanganInput.fill(testRuangan);

    // 6. Masukkan Deskripsi ("deskrip a")
    const deskripsiInput = page.locator('textarea');
    await deskripsiInput.fill(testDeskripsi);

    // 7. Unggah Foto Bukti
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('text=Pilih dari perangkat').click();
    const fileChooser = await fileChooserPromise;
    const samplePhotoPath = path.join(__dirname, 'fixtures', 'sample-photo.png');
    await fileChooser.setFiles(samplePhotoPath);

    await expect(page.locator('img[alt="Preview 1"]')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);

    // 8. Klik Tombol Laporkan
    const laporkanButton = page.getByRole('button', { name: 'Laporkan' });
    await laporkanButton.click();

    // 9. Verifikasi Modal Sukses Muncul
    const successModal = page.locator('text=Laporan berhasil dibuat');
    await expect(successModal).toBeVisible({ timeout: 10000 });

    // 10. Tunggu Navigasi Otomatis ke /riwayat-laporan
    await page.waitForURL(/.*riwayat-laporan/, { timeout: 10000 });

    // 11. Verifikasi di Tabel Riwayat: Lokasi dan Deskripsi PERSIS sesuai yang dimasukkan
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible();

    const lokasiCell = firstRow.locator('td').nth(1);
    const deskripsiCell = firstRow.locator('td').nth(2);

    await expect(lokasiCell).toContainText(testRuangan);
    await expect(lokasiCell).toContainText(testGedung);
    await expect(deskripsiCell).toContainText(testDeskripsi);

    // 12. Buka Modal Detail dan Verifikasi Informasi Detail
    const detailButton = firstRow.getByRole('button', { name: 'Lihat detail' });
    await detailButton.click();

    const detailTitle = page.locator('h3:has-text("Detail Laporan")');
    await expect(detailTitle).toBeVisible();

    await expect(page.locator('div:has(> div:text("Nama Ruangan"))').locator('div').nth(1)).toContainText(testRuangan);
    await expect(page.locator('div:has(> div:text("Nama Gedung"))').locator('div').nth(1)).toContainText(testGedung);
    await expect(page.locator('p:has-text("' + testDeskripsi + '")')).toBeVisible();

    // Tutup modal
    await page.getByRole('button', { name: 'Tutup' }).click();
    await expect(detailTitle).not.toBeVisible();
  });
});
