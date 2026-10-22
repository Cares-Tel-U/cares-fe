import { test, expect } from '@playwright/test';

test.describe('Fitur Lupa Kata Sandi & Atur Ulang Kata Sandi', () => {
  const targetEmail = 'pengguna1@telkomuniversity.ac.id';
  const originalPassword = 'Password123';
  const newPassword = 'PasswordBaru123';

  test('Alur Lengkap: Validasi Email di DB -> Kirim Instruksi -> Reset Password -> Login dengan Password Baru', async ({ page }) => {
    // 1. Masuk ke halaman login
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // 2. Klik link "Lupa Password?"
    const forgotLink = page.getByRole('link', { name: 'Lupa Password?' });
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();

    // Pastikan berada di halaman /forgot-password
    await page.waitForURL('**/forgot-password');
    await expect(page.getByRole('heading', { name: 'Lupa Kata Sandi?' })).toBeVisible();

    // 3. Uji tombol "Kirim Instruksi Pemulihan" saat email belum diisi
    const submitBtn = page.getByRole('button', { name: 'Kirim Instruksi Pemulihan' });
    await expect(submitBtn).toBeDisabled();

    // 4. Masukkan email yang TIDAK terdaftar
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('emailtidakada999@telkomuniversity.ac.id');

    // Tunggu sistem mengecek database
    await expect(page.locator('text=Alamat email tidak terdaftar dalam sistem CARES.')).toBeVisible({ timeout: 5000 });
    await expect(submitBtn).toBeDisabled();

    // 5. Masukkan email yang TERDAFTAR di database
    await emailInput.fill(targetEmail);

    // Tunggu sistem mengecek database dan mengonfirmasi email terdaftar
    await expect(page.locator('text=Alamat email terdaftar dalam sistem.')).toBeVisible({ timeout: 5000 });
    await expect(submitBtn).toBeEnabled();

    // 6. Klik tombol "Kirim Instruksi Pemulihan"
    await submitBtn.click();

    // Pastikan diarahkan kembali ke halaman /login dengan notifikasi sukses (berikan toleransi transmisi SMTP riil)
    await page.waitForURL('**/login', { timeout: 25000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.locator('text=Tautan pemulihan kata sandi telah dikirim ke email terdaftar Anda')).toBeVisible();

    // 7. Ambil token reset langsung dari backend API forgot-password untuk keperluan pengujian end-to-end
    const forgotRes = await page.request.post('http://localhost:5001/api/v1/auth/forgot-password', {
      data: { email: targetEmail },
    });
    expect(forgotRes.status()).toBe(200);
    const forgotData = await forgotRes.json();
    const resetToken = forgotData.data.resetToken;
    expect(resetToken).toBeTruthy();

    // 8. Buka halaman Atur Ulang Kata Sandi dengan token tersebut
    await page.goto(`/reset-password?token=${resetToken}`);
    await expect(page.getByRole('heading', { name: 'Atur Ulang Kata Sandi' })).toBeVisible();

    const newPassInput = page.locator('input[type="password"]').nth(0);
    const confirmPassInput = page.locator('input[type="password"]').nth(1);
    const saveBtn = page.getByRole('button', { name: 'Simpan Password' });

    // 9. Uji validasi: password pendek (< 8 karakter)
    await newPassInput.fill('short');
    await confirmPassInput.fill('short');
    await expect(page.locator('text=Password kurang dari 8 karakter')).toBeVisible();
    await expect(saveBtn).toBeDisabled();

    // 10. Uji validasi: password tidak sesuai pola (tidak ada angka)
    await newPassInput.fill('PasswordSemua');
    await confirmPassInput.fill('PasswordSemua');
    await expect(page.locator('text=mengandung kombinasi huruf besar, huruf kecil, serta angka')).toBeVisible();
    await expect(saveBtn).toBeDisabled();

    // 11. Uji validasi: konfirmasi password tidak cocok
    await newPassInput.fill(newPassword);
    await confirmPassInput.fill('PasswordLain123');
    await expect(page.locator('text=Konfirmasi password baru tidak cocok')).toBeVisible();
    await expect(saveBtn).toBeDisabled();

    // 12. Masukkan password valid yang cocok
    await confirmPassInput.fill(newPassword);
    await expect(saveBtn).toBeEnabled();

    // 13. Simpan password baru
    await saveBtn.click();

    // Diarahkan kembali ke halaman login
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.locator('text=Kata sandi Anda telah berhasil diatur ulang')).toBeVisible();

    // 14. Login menggunakan password baru
    const loginEmailInput = page.locator('input[type="email"]');
    const loginPasswordInput = page.locator('input[type="password"]');
    await loginEmailInput.fill(targetEmail);
    await loginPasswordInput.fill(newPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    // Berhasil masuk ke dashboard pelapor
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Halo,')).toBeVisible();

    // 15. Kembalikan password ke semula (Password123) agar pengujian lain tidak terganggu
    const restoreRes = await page.request.post('http://localhost:5001/api/v1/auth/forgot-password', {
      data: { email: targetEmail },
    });
    const restoreData = await restoreRes.json();
    await page.request.post('http://localhost:5001/api/v1/auth/reset-password', {
      data: {
        token: restoreData.data.resetToken,
        newPassword: originalPassword,
      },
    });
  });
});
