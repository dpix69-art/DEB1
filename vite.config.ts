import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // important for GitHub Pages (works under subpath)
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        // cache app shell + JSON data
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
      includeAssets: ['pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'B1 Trainer',
        short_name: 'B1',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: './',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
