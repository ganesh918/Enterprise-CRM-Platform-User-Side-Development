import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function userPanelBanner() {
  return {
    name: 'user-panel-banner',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const addr = server.httpServer?.address()
        const port = typeof addr === 'object' && addr ? addr.port : addr
        // eslint-disable-next-line no-console
        console.log(
          `\n  ✅ CRM USER PANEL → http://localhost:${port}/login\n`,
        )
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), userPanelBanner()],
  server: {
    port: 5310,
    strictPort: false,
    open: '/login',
  },
  preview: {
    port: 5310,
    strictPort: false,
  },
})
