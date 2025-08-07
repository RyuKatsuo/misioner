import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// [PERBAIKAN KUNCI 1]
// Kita bungkus semuanya dalam fungsi untuk mendapatkan variabel 'command'
export default defineConfig(({ command }) => {
    const isServe = command === 'serve';

    // URL publik untuk Vite. WAJIB HTTPS dan WAJIB diakhiri dengan /
    const VITE_TUNNEL_URL = 'https://abc.cnts.my.id/';

    return {
        // [PERBAIKAN KUNCI 2]
        // Ini akan memaksa Vite menggunakan URL tunnel saat 'npm run dev'
        base: isServe ? VITE_TUNNEL_URL : '/build/',

        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        server: {
            host: '0.0.0.0',
            hmr: {
                // Ini sudah benar di konfigurasi Anda
                host: new URL(VITE_TUNNEL_URL).hostname,
            },
        },
        esbuild: {
            jsx: 'automatic',
        },
        resolve: {
            alias: {
                'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            },
        },
    };
});