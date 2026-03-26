import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import OpenAI from 'openai'

// Vite dev middleware — mirrors the Vercel /api/tts Edge function for local dev.
// In production (Vercel), the real /api/tts.ts serverless function is used instead.
function ttsDevPlugin() {
  return {
    name: 'tts-dev',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/tts', async (req: import('http').IncomingMessage, res: import('http').ServerResponse) => {
        if (req.method !== 'POST') {
          res.writeHead(405); res.end('Method not allowed'); return
        }
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
          res.writeHead(503); res.end('TTS not configured'); return
        }
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const { text } = JSON.parse(body) as { text?: string }
            if (!text?.trim()) { res.writeHead(400); res.end('text is required'); return }
            const openai = new OpenAI({ apiKey })
            const response = await openai.audio.speech.create({
              model: 'tts-1', voice: 'nova', input: text.trim().slice(0, 300), response_format: 'mp3',
            })
            const buffer = Buffer.from(await response.arrayBuffer())
            res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=3600' })
            res.end(buffer)
          } catch (err) {
            console.error('[TTS dev]', err)
            res.writeHead(502); res.end('TTS generation failed')
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    ttsDevPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
