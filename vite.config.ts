import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), VitePWA({
    // generates 'manifest.webmanifest' file on build
    manifest: {
      // caches the assets/icons mentioned (assets/* includes all the assets present in your src/ directory) 
      name: 'insquoo',
      short_name: 'insquoo',
      start_url: '/',
      background_color: '#F3F7FC',
      theme_color: '#17223B',
      display: 'standalone',
      categories: ["productivity", "utilities"],
      description: 'A powerful note-taking friend. Make every new tab a notebook, and create pages seamlessly in your browser.',
      icons: [
        {
          src: '/images/vire-logo-icon-48.png',
          sizes: '48x48',
          type: 'image/png'
        },
        {
          src: '/images/vire-logo-icon-128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: '/images/vire-logo-icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/images/vire-logo-icon-1024.png',
          sizes: '1024x1024',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      // defining cached files formats
      globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
    }
  })],
  server: {
    port: 5173,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups;',
    },
  }
})
