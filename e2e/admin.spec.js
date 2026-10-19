import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('E2E Testing Role Admin (Petugas Sarana & Prasarana)', () => {

  test('Step 1: Autentikasi Admin (Validasi Kredensial Salah & Login Sukses)', async ({ page }) => {
    // 1. Kunjungi halaman login
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.getByRole('button', { name: 'Login' });

    // 2. Coba login dengan password salah
    await emailInput.fill('admin1@telkomuniversity.ac.id');
    await passwordInput.fill('passwordsalah123');
    await loginButton.click();

    // Verifikasi pesan kesalahan muncul
    const errorBanner = page.locator('text=Email atau password salah').or(page.locator('text=tidak valid'));
    await expect(errorBanner).toBeVisible({ timeout: 5000 });

    // 3. Masukkan kredensial akun Admin Sarpras yang benar
    await emailInput.fill('admin1@telkomuniversity.ac.id');
    await passwordInput.fill('Admin123');
    await loginButton.click();

    // 4. Verifikasi pengalihan sukses ke /admin/dashboard
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*admin\/dashboard/);
    await expect(page.locator('text=Halo, Admin').or(page.locator('text=Admin'))).toBeVisible();
  });

  test('Step 2: Inspeksi Kartu Metrik Operasional & Tabel Dashboard Admin', async ({ page }) => {
    // 1. Login sebagai Admin
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 10000 });

    // 2. Verifikasi 5 Kartu Metrik Operasional
    await expect(page.locator('text=Total Laporan Masuk')).toBeVisible();
    await expect(page.locator('text=Menunggu Verifikasi').first()).toBeVisible();
    await expect(page.locator('text=Laporan Diproses')).toBeVisible();
    await expect(page.locator('text=Laporan Selesai')).toBeVisible();
    await expect(page.locator('text=Laporan Ditolak')).toBeVisible();

    // 3. Verifikasi Tabel Laporan Terbaru
    await expect(page.locator('h2:has-text("Laporan Terbaru")')).toBeVisible();
    await expect(page.locator('text=Lihat semua laporan')).toBeVisible();

    // 4. Buka modal detail dari tabel jika ada baris laporan
    const detailBtn = page.getByRole('button', { name: 'Lihat detail' }).first();
    if (await detailBtn.isVisible()) {
      await detailBtn.click();
      const modal = page.locator('h3:has-text("Detail Laporan")');
      await expect(modal).toBeVisible();

      // Tutup modal
      const closeBtn = page.getByRole('button', { name: 'Tutup' });
      await closeBtn.click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('Step 3: Manajemen Daftar Laporan (Penyaringan Multi-Status & Pengurutan)', async ({ page }) => {
    // 1. Login sebagai Admin
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 10000 });

    // 2. Navigasi ke Daftar Laporan melalui sidebar
    const daftarLaporanLink = page.locator('a[href="/admin/daftar-laporan"]').or(page.locator('text=Daftar Laporan')).first();
    await daftarLaporanLink.click();
    await page.waitForURL(/.*admin\/daftar-laporan/, { timeout: 10000 });

    // 3. Verifikasi elemen filter di halaman Daftar Laporan
    await expect(page.locator('text=Sort by:')).toBeVisible();
    const sortSelect = page.locator('select').first();
    await expect(sortSelect).toBeVisible();

    // 4. Uji Pengurutan (Terbaru -> Terlama -> Terbaru)
    await sortSelect.selectOption('Terlama');
    await sortSelect.selectOption('Terbaru');

    // 5. Uji Filter Status (Pilih 'Menunggu Verifikasi' -> 'Semua Status')
    const statusSelect = page.locator('select').nth(1);
    await statusSelect.selectOption('Menunggu Verifikasi');
    await statusSelect.selectOption('Semua Status');

    // 6. Verifikasi tombol "Pilih beberapa" terlihat
    await expect(page.locator('button:has-text("Pilih beberapa")')).toBeVisible();
  });

  test('Step 4: Pemilihan Massal (Bulk Selection) & Alur Konfirmasi Update Status', async ({ page }) => {
    // 1. Login Admin & Masuk ke Daftar Laporan
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 10000 });

    await page.goto('/admin/daftar-laporan');
    await page.waitForURL(/.*admin\/daftar-laporan/, { timeout: 10000 });

    // 2. Klik tombol "Pilih beberapa"
    const bulkBtn = page.locator('button:has-text("Pilih beberapa")');
    await bulkBtn.click();

    // Verifikasi beralih ke mode seleksi massal
    await expect(page.locator('text=Laporan dipilih')).toBeVisible();
    await expect(page.locator('button:has-text("Update status")')).toBeVisible();
    await expect(page.locator('button:has-text("Batal")')).toBeVisible();

    // 3. Pilih baris pertama di tabel
    const firstCheckbox = page.locator('tbody tr td div').first();
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.click();
      await expect(page.locator('text=1 Laporan dipilih')).toBeVisible();

      // 4. Klik tombol "Update status"
      const updateStatusBtn = page.locator('button:has-text("Update status")');
      await updateStatusBtn.click();

      // Verifikasi modal konfirmasi terbuka
      const updateModal = page.locator('h3:has-text("Update Status Laporan?")');
      await expect(updateModal).toBeVisible();

      // Klik Update pada modal
      const modalConfirmBtn = page.getByRole('button', { name: 'Update', exact: true });
      await modalConfirmBtn.click();

      // Verifikasi pengalihan ke Respons Laporan
      await page.waitForURL(/.*admin\/respons-laporan/, { timeout: 10000 });
      await expect(page).toHaveURL(/.*admin\/respons-laporan/);
    }
  });

  test('Step 5: Respons Laporan, Upload Bukti Pengerjaan, & Penyelesaian Laporan', async ({ page }) => {
    // 1. Login Admin
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 10000 });

    // 2. Kunjungi halaman Respons Laporan
    await page.goto('/admin/respons-laporan');
    await page.waitForURL(/.*admin\/respons-laporan/, { timeout: 10000 });

    // 3. Verifikasi form respon dan preview laporan
    await expect(page.locator('h2:has-text("Form Respon")')).toBeVisible();
    await expect(page.locator('h3:has-text("Preview Laporan")')).toBeVisible();

    // 4. Jika ada tombol pilih dari perangkat (mode pengerjaan selesai), uji upload bukti foto
    const uploadBtn = page.locator('text=Pilih dari perangkat');
    if (await uploadBtn.isVisible()) {
      const fileChooserPromise = page.waitForEvent('filechooser');
      await uploadBtn.click();
      const fileChooser = await fileChooserPromise;
      const samplePhotoPath = path.join(__dirname, 'fixtures', 'sample-photo.png');
      await fileChooser.setFiles(samplePhotoPath);
    }

    // 5. Lakukan verifikasi semua laporan atau laporan selesai
    const verifyAllBtn = page.locator('button:has-text("Verifikasi semua laporan")').or(page.locator('button:has-text("Laporan Selesai")')).first();
    if (await verifyAllBtn.isVisible()) {
      await verifyAllBtn.click();

      // Verifikasi kemunculan modal sukses
      const successModal = page.locator('text=berhasil diverifikasi').or(page.locator('text=selesai ditangani')).or(page.locator('role=dialog'));
      await expect(successModal.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('Step 6: Penolakan Laporan dengan Alasan Penolakan Wajib', async ({ page }) => {
    // 1. Login Admin
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 10000 });

    await page.goto('/admin/daftar-laporan');
    await page.waitForURL(/.*admin\/daftar-laporan/, { timeout: 10000 });

    // 2. Buka detail laporan pertama
    const detailBtn = page.getByRole('button', { name: 'Lihat detail' }).first();
    if (await detailBtn.isVisible()) {
      await detailBtn.click();
      const modal = page.locator('h3:has-text("Detail Laporan")');
      await expect(modal).toBeVisible();

      // 3. Cek apakah ada tombol "Tolak laporan"
      const rejectBtn = page.locator('button:has-text("Tolak laporan")').or(page.locator('button:has-text("Tolak")')).first();
      if (await rejectBtn.isVisible()) {
        await rejectBtn.click();

        // Verifikasi RejectReportModal muncul
        const rejectModal = page.locator('h3:has-text("Tolak Laporan")').or(page.locator('text=Alasan Penolakan'));
        if (await rejectModal.isVisible()) {
          // Isi alasan penolakan
          const textarea = page.locator('textarea');
          await textarea.fill('Pengujian otomatis Playwright: Bukti foto tidak sesuai dengan kerusakan yang dilaporkan.');
          
          // Submit penolakan
          const submitReject = page.getByRole('button', { name: 'Tolak' }).last();
          await submitReject.click();
        }
      } else {
        // Tutup modal jika laporan tidak dalam status menunggu verifikasi
        await page.getByRole('button', { name: 'Tutup' }).click();
      }
    }
  });

  test('Step 7: Halaman Data Statistik & Analitik Sarpras Kampus', async ({ page }) => {
    // 1. Login Admin
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 10000 });

    // 2. Navigasi ke Data Statistik
    const statsNav = page.locator('a[href="/admin/data-statistik"]').or(page.locator('text=Data Statistik')).first();
    await statsNav.click();
    await page.waitForURL(/.*admin\/data-statistik/, { timeout: 10000 });

    // 3. Verifikasi elemen halaman Data Statistik
    await expect(page.getByRole('heading', { name: 'Data Statistik' })).toBeVisible();
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('Step 8: Admin FAQ, Notifikasi Popover, dan Logout Admin', async ({ page }) => {
    // 1. Login Admin
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin1@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('Admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*admin\/dashboard/, { timeout: 10000 });

    // 2. Buka Halaman FAQ Admin
    const faqNav = page.locator('a[href="/admin/faq"]').or(page.locator('text=FAQ')).first();
    await faqNav.click();
    await page.waitForURL(/.*admin\/faq/, { timeout: 10000 });
    await expect(page.locator('text=Frequently Asked Questions')).toBeVisible();

    // Uji buka pertanyaan FAQ pertama
    const faqQuestion = page.locator('.faq-item-button').or(page.locator('text=Apa saja kriteria')).first();
    if (await faqQuestion.isVisible()) {
      await faqQuestion.click();
    }

    // 3. Uji Notifikasi Admin
    const notifBtn = page.getByRole('button', { name: 'Notifikasi' });
    await notifBtn.click();
    await expect(page.locator('h3:has-text("Notifikasi")')).toBeVisible();
    const markReadBtn = page.locator('button:has-text("Tandai telah dibaca")');
    if (await markReadBtn.isVisible()) {
      await markReadBtn.click();
    }

    // 4. Uji Menu Profil & Logout Admin
    const avatar = page.locator('header img').first();
    await avatar.click();
    const logoutBtn = page.locator('div:has-text("Keluar")').last();
    await logoutBtn.click();

    // Verifikasi modal konfirmasi keluar
    await expect(page.locator('h3:has-text("Keluar dari Akun?")')).toBeVisible();
    await page.getByRole('button', { name: 'Keluar' }).click();

    // Verifikasi kembali ke login
    await page.waitForURL(/.*login/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*login/);
  });

});
