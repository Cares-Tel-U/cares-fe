import { API_BASE_URL } from './api';

/**
 * Layanan EventSource (Server-Sent Events) untuk menerima pembaruan data secara real-time
 * tanpa memerlukan reload halaman oleh pengguna.
 */
export function connectRealtimeEvents(onEvent) {
  if (typeof window === 'undefined' || !window.EventSource) {
    return () => {};
  }

  const sseUrl = `${API_BASE_URL}/realtime/events`;
  let eventSource = null;
  let reconnectTimer = null;
  let isClosed = false;

  const connect = () => {
    if (isClosed) return;

    try {
      eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          if (!event.data) return;
          const parsed = JSON.parse(event.data);
          if (onEvent) {
            onEvent(parsed);
          }
        } catch {
          // Abaikan komentar atau payload non-JSON
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }

        if (!isClosed) {
          // Rekoneksi otomatis setelah 3 detik jika koneksi terputus
          reconnectTimer = setTimeout(connect, 3000);
        }
      };
    } catch {
      // Jika terjadi kesalahan koneksi inisial, coba kembali nanti
      if (!isClosed) {
        reconnectTimer = setTimeout(connect, 5000);
      }
    }
  };

  connect();

  return () => {
    isClosed = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}
