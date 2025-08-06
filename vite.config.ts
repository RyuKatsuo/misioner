import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        basicSsl(),
    ],
    server: {
        host: '0.0.0.0', // <-- 4. Izinkan koneksi dari luar localhost
        cors: true,      // <-- 5. Izinkan semua origin (CORS)
        hmr: {
            host: 'am.cnts.my.id', // <-- 6. Arahkan Hot Reload ke domain Cloudflare Anda
            protocol: 'wss',       // <-- 7. Gunakan WebSocket Secure
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
});
