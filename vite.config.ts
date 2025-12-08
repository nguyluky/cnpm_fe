import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            includeAssets: [
                'apple-touch-icon.png',
                'favicon.ico',
                'robots.txt',
                'favicon.svg',
                'pwa-192x192.png',
                'pwa-512x512.png',
                'pwa-maskable-512x512.png',
                'pwa-maskable-192x192.png',
            ],
            registerType: 'autoUpdate',
            manifest: false,
            injectRegister: null,
            workbox: {
                cleanupOutdatedCaches: true,
                sourcemap: true,
                maximumFileSizeToCacheInBytes: 5000000,
            },
            devOptions: {
                enabled: true
            }
        }),
    ], server: {
        allowedHosts: true
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    }
})
