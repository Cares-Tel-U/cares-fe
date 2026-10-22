import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Verifikasi Dinamis Form Laporan Area Luar vs Dalam Gedung', () => {
  test('Header field, placeholder, dan opsi autocomplete harus menyesuaikan saat memilih Area Luar', async ({ page }) => {
    // 1. Login sebagai mahasiswa pelapor
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('pengguna1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });

    // 2. Navigasi ke halaman Buat Laporan
    await page.goto('/buat-laporan');
    await page.waitForURL(/.*buat-laporan/, { timeout: 10000 });

    // 3. Verifikasi kondisi awal (Dalam Gedung)
    const radioDalam = page.locator('input[type="radio"][value="Dalam Gedung"]');
    const radioLuar = page.locator('input[type="radio"][value="Area Luar"]');
    await expect(radioDalam).toBeChecked();
    await expect(radioLuar).not.toBeChecked();

    // Pastikan label dan placeholder awal adalah Nama Gedung & Nama Ruangan
    await expect(page.locator('label:has-text("Nama Gedung")')).toBeVisible();
    await expect(page.locator('label:has-text("Nama Ruangan")')).toBeVisible();
    await expect(page.locator('input[placeholder="Ketik nama gedung..."]')).toBeVisible();
    await expect(page.locator('input[placeholder="Ketik nama ruangan..."]')).toBeVisible();

    // 4. Beralih ke Area Luar
    await radioLuar.click();
    await expect(radioLuar).toBeChecked();

    // 5. Verifikasi label dan placeholder berubah ke Area & Lokasi Spesifik
    await expect(page.getByText('Area *')).toBeVisible();
    await expect(page.getByText('Lokasi Spesifik *')).toBeVisible();
    await expect(page.locator('input[placeholder="Ketik nama area..."]')).toBeVisible();
    await expect(page.locator('input[placeholder="Ketik lokasi spesifik..."]')).toBeVisible();

    // 6. Uji Autocomplete Area Luar
    const areaInput = page.locator('input[placeholder="Ketik nama area..."]');
    await areaInput.fill('Area Parkir');
    const areaSuggestion = page.locator('div:has-text("Area Parkir")').last();
    await expect(areaSuggestion).toBeVisible();
    await areaSuggestion.click();

    // 7. Uji Autocomplete Lokasi Spesifik berdasarkan Area Parkir
    const lokasiInput = page.locator('input[placeholder="Ketik lokasi spesifik..."]');
    await lokasiInput.fill('Parkir Motor TULT');
    const spesifikSuggestion = page.locator('div:has-text("Parkir Motor TULT")').last();
    await expect(spesifikSuggestion).toBeVisible();
    await spesifikSuggestion.click();

    // 8. Uji beralih kembali ke Dalam Gedung: input harus direset dan label kembali normal
    await radioDalam.click();
    await expect(page.locator('label:has-text("Nama Gedung")')).toBeVisible();
    await expect(page.locator('label:has-text("Nama Ruangan")')).toBeVisible();
    const gedungInputReset = page.locator('input[placeholder="Ketik nama gedung..."]');
    const ruanganInputReset = page.locator('input[placeholder="Ketik nama ruangan..."]');
    await expect(gedungInputReset).toHaveValue('');
    await expect(ruanganInputReset).toHaveValue('');

    // 9. Kembali pilih Area Luar dan kirim laporan untuk menguji alur submission
    await radioLuar.click();
    await areaInput.fill('Area Parkir');
    await page.locator('div:has-text("Area Parkir")').last().click();

    const uniqueTimestamp = Date.now();
    await lokasiInput.fill(`Parkir Motor Timur Blok ${uniqueTimestamp}`);

    const deskripsiInput = page.locator('textarea');
    await deskripsiInput.fill(`Uji Pelaporan Area Luar: Kerusakan paving block ${uniqueTimestamp}`);

    // Unggah bukti foto
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('text=Pilih dari perangkat').click();
    const fileChooser = await fileChooserPromise;
    const samplePhotoPath = path.join(__dirname, 'fixtures', 'sample-photo.png');
    await fileChooser.setFiles(samplePhotoPath);
    await expect(page.locator('img[alt="Preview 1"]')).toBeVisible();

    // Kirim formulir
    await page.getByRole('button', { name: 'Laporkan' }).click();

    // Verifikasi feedback modal muncul (sukses atau kuota)
    const successModal = page.locator('text=Laporan berhasil dibuat');
    const quotaModal = page.locator('text=Batas Maksimal 3 Laporan Harian').or(page.locator('text=melebihi batas'));
    await expect(successModal.or(quotaModal)).toBeVisible({ timeout: 10000 });
  });
});
