import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('E2E Testing Role Pelapor (Civitas Akademika / Mahasiswa)', () => {

  test('Step 1: Registrasi Akun Mahasiswa Baru & Validasi Password', async ({ page }) => {
    // 1. Kunjungi halaman register
    await page.goto('/register');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();

    // 2. Cek validasi password kurang dari 8 karakter
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('12345');
    await expect(page.locator('text=Password kurang dari 8 karakter')).toBeVisible();

    // 3. Masukkan password valid >= 8 karakter dan data unik
    const uniqueTime = Date.now();
    const testEmail = `mhs.${uniqueTime}@telkomuniversity.ac.id`;
    
    await page.locator('input[placeholder="Masukkan nama lengkap"]').fill(`Mahasiswa Uji ${uniqueTime}`);
    await page.locator('input[placeholder="Masukkan nomor induk mahasiswa/pegawai"]').fill(`130121${uniqueTime.toString().slice(-4)}`);
    await page.locator('input[type="email"]').fill(testEmail);
    await passwordInput.fill('password123');

    // 4. Submit form pendaftaran
    const submitButton = page.getByRole('button', { name: 'Sign Up' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 5. Verifikasi pengalihan ke halaman login setelah registrasi berhasil
    await page.waitForURL(/.*login/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('Step 2: Login Pelapor (Validasi Kredensial Salah & Login Sukses)', async ({ page }) => {
    // 1. Kunjungi halaman login
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.getByRole('button', { name: 'Login' });

    // 2. Percobaan login dengan kata sandi salah
    await emailInput.fill('ambangawi@telkomuniversity.ac.id');
    await passwordInput.fill('passwordsalah123');
    await loginButton.click();

    // Verifikasi pesan error muncul
    const errorBanner = page.locator('text=Email atau password salah').or(page.locator('text=tidak valid'));
    await expect(errorBanner).toBeVisible({ timeout: 5000 });

    // 3. Login dengan kredensial yang valid
    await emailInput.fill('ambangawi@telkomuniversity.ac.id');
    await passwordInput.fill('password123');
    await loginButton.click();

    // 4. Verifikasi berhasil masuk ke Dashboard
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Halo,')).toBeVisible();
    await expect(page.locator('text=Total Laporan Anda')).toBeVisible();
  });

  test('Step 3: Eksplorasi Dashboard Pelapor & Modal Detail Laporan', async ({ page }) => {
    // 1. Login terlebih dahulu
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('ambangawi@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });

    // 2. Verifikasi 4 Stat Cards
    await expect(page.locator('text=Total Laporan Anda')).toBeVisible();
    await expect(page.locator('text=Menunggu Verifikasi').first()).toBeVisible();
    await expect(page.locator('text=Laporan Diproses')).toBeVisible();
    await expect(page.locator('text=Laporan Selesai')).toBeVisible();

    // 3. Verifikasi Tabel Riwayat Laporan Terkini
    const tableTitle = page.locator('h3:has-text("Riwayat Laporan")');
    await expect(tableTitle).toBeVisible();

    // 4. Klik tombol "Lihat detail" pertama di tabel
    const detailButton = page.getByRole('button', { name: 'Lihat detail' }).first();
    if (await detailButton.isVisible()) {
      await detailButton.click();

      // Verifikasi Modal Detail Laporan terbuka
      const modal = page.locator('h3:has-text("Detail Laporan")');
      await expect(modal).toBeVisible();
      await expect(page.locator('text=Timeline Laporan')).toBeVisible();
      await expect(page.locator('text=Bukti Foto')).toBeVisible();

      // Tutup modal
      const closeButton = page.getByRole('button', { name: 'Tutup' });
      await closeButton.click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('Step 4: Pembuatan Laporan Kerusakan Baru (Dengan Foto & Mode Anonim)', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('ambangawi@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });

    // 2. Klik tombol "Buat Laporan"
    const buatLaporanBtn = page.getByRole('button', { name: 'Buat Laporan' }).first();
    await buatLaporanBtn.click();
    await page.waitForURL(/.*buat-laporan/, { timeout: 10000 });

    // 3. Verifikasi halaman Buat Laporan
    await expect(page.locator('h3:has-text("Identitas Pelapor")')).toBeVisible();
    await expect(page.locator('h3:has-text("Form Laporan")')).toBeVisible();

    // 4. Pastikan toggle mode anonim dicentang
    const anonimCheckbox = page.locator('input[type="checkbox"]');
    const isChecked = await anonimCheckbox.isChecked();
    if (!isChecked) {
      await anonimCheckbox.check();
    }

    // 5. Autocomplete Gedung: Ketik dan pilih gedung
    const gedungInput = page.locator('input[placeholder="Ketik nama gedung..."]');
    await gedungInput.fill('Gedung A');
    await page.locator('div:has-text("Gedung A (Gedung Kuliah Umum)")').last().click();

    // 6. Autocomplete Ruangan: Ketik dan pilih ruangan
    const ruanganInput = page.locator('input[placeholder="Ketik nama ruangan..."]');
    await ruanganInput.fill('KU3.02.12');
    await page.locator('div:has-text("KU3.02.12")').last().click();

    // 7. Masukkan Deskripsi Masalah
    const uniqueTime = Date.now();
    const deskripsiText = `Uji Playwright: Kerusakan stopkontak di ruang kuliah ${uniqueTime}`;
    const deskripsiInput = page.locator('textarea');
    await deskripsiInput.fill(deskripsiText);

    // 8. Unggah foto bukti
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('text=Pilih dari perangkat').click();
    const fileChooser = await fileChooserPromise;
    const samplePhotoPath = path.join(__dirname, 'fixtures', 'sample-photo.png');
    await fileChooser.setFiles(samplePhotoPath);

    // Verifikasi preview foto muncul
    await expect(page.locator('img[alt="Preview 1"]')).toBeVisible();

    // 9. Kirim Formulir Laporan
    const laporkanButton = page.getByRole('button', { name: 'Laporkan' });
    await laporkanButton.click();

    // 10. Verifikasi Modal Notifikasi Keberhasilan atau Batas Harian
    const successModal = page.locator('text=Laporan berhasil dibuat');
    const quotaModal = page.locator('text=melebihi batas laporan harian');

    // Menunggu salah satu modal status muncul
    await expect(successModal.or(quotaModal)).toBeVisible({ timeout: 10000 });

    // Jika berhasil, tunggu pengalihan ke /riwayat-laporan
    if (await successModal.isVisible()) {
      await page.waitForURL(/.*riwayat-laporan/, { timeout: 10000 });
      await expect(page).toHaveURL(/.*riwayat-laporan/);
    }
  });

  test('Step 5: Halaman Riwayat Laporan (Penyaringan Status & Pengurutan)', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('ambangawi@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });

    // 2. Navigasi ke Riwayat Laporan melalui sidebar
    const riwayatNav = page.locator('a[href="/riwayat-laporan"]').or(page.locator('text=Riwayat Laporan')).first();
    await riwayatNav.click();
    await page.waitForURL(/.*riwayat-laporan/, { timeout: 10000 });

    // 3. Verifikasi elemen filter dropdown
    await expect(page.locator('text=Sort by:')).toBeVisible();
    await expect(page.locator('button:has-text("Semua Status")')).toBeVisible();

    // 4. Uji Pengurutan (Terbaru -> Terlama -> Terbaru)
    const sortDropdownBtn = page.locator('button:has-text("Terbaru")').or(page.locator('button:has-text("Terlama")')).first();
    await sortDropdownBtn.click();
    const terlamaOption = page.locator('div:has-text("Terlama")').last();
    if (await terlamaOption.isVisible()) {
      await terlamaOption.click();
    }

    // 5. Uji Filter Status (Pilih 'Menunggu Verifikasi')
    const statusDropdownBtn = page.locator('button:has-text("Semua Status")').first();
    if (await statusDropdownBtn.isVisible()) {
      await statusDropdownBtn.click();
      const waitingOption = page.locator('div:has-text("Menunggu Verifikasi")').last();
      if (await waitingOption.isVisible()) {
        await waitingOption.click();
      }
    }

    // 6. Buka Detail dari tabel riwayat jika ada laporan
    const detailButtons = page.getByRole('button', { name: 'Lihat detail' });
    if (await detailButtons.count() > 0) {
      await detailButtons.first().click();
      const modal = page.locator('h3:has-text("Detail Laporan")');
      await expect(modal).toBeVisible();
      await page.getByRole('button', { name: 'Tutup' }).click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('Step 6: Navigasi Header, Notifikasi, Pengaturan Profil, dan Logout', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('ambangawi@telkomuniversity.ac.id');
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });

    // 2. Uji Buka Notifikasi Popover
    const notifBtn = page.getByRole('button', { name: 'Notifikasi' });
    await notifBtn.click();
    const notifHeader = page.locator('h3:has-text("Notifikasi")');
    await expect(notifHeader).toBeVisible();

    // Klik "Tandai telah dibaca"
    const markReadBtn = page.locator('button:has-text("Tandai telah dibaca")');
    if (await markReadBtn.isVisible()) {
      await markReadBtn.click();
    }

    // 3. Uji Menu Profil Pengguna
    const profileAvatar = page.locator('img[alt="Amba Ngawi"]').or(page.locator('header img')).first();
    await profileAvatar.click();

    // Verifikasi nama dan email pada dropdown profil
    await expect(page.locator('text=amba@gmail.com').or(page.locator('text=@telkomuniversity.ac.id'))).toBeVisible();
    await expect(page.locator('text=Ubah Foto Profil')).toBeVisible();

    // 4. Uji Tombol Keluar / Logout
    const logoutMenu = page.locator('div:has-text("Keluar")').last();
    await logoutMenu.click();

    // Verifikasi Modal Konfirmasi Logout Muncul
    const confirmLogoutModal = page.locator('h3:has-text("Keluar dari Akun?")');
    await expect(confirmLogoutModal).toBeVisible();

    // Konfirmasi Logout
    const confirmBtn = page.getByRole('button', { name: 'Keluar' });
    await confirmBtn.click();

    // 5. Verifikasi Kembali ke Halaman Login
    await page.waitForURL(/.*login/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

});
