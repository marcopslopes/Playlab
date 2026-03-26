import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load ALL env vars from .env.local (not just VITE_* prefixed ones)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),

      // Dev-only: serve /api/tts locally so OpenAI nova voice works without vercel dev
      {
        name: 'tts-dev',
        configureServer(server) {
          server.middlewares.use('/api/tts', async (req, res) => {
            console.log('[TTS dev] request received, method:', req.method)

            if (req.method !== 'POST') {
              res.writeHead(405); res.end('Method not allowed'); return
            }

            const apiKey = env.OPENAI_API_KEY
            if (!apiKey) {
              console.error('[TTS dev] OPENAI_API_KEY not found in .env.local')
              res.writeHead(503); res.end('TTS not configured'); return
            }

            let body = ''
            req.on('data', (chunk) => { body += chunk.toString() })
            req.on('end', async () => {
              try {
                const { text, language = 'en' } = JSON.parse(body) as { text?: string; language?: string }
                if (!text?.trim()) { res.writeHead(400); res.end('text is required'); return }

                console.log('[TTS dev] generating audio for:', text.trim().slice(0, 50), '| lang:', language)

                const isPT = language === 'pt'
                const PT_INSTRUCTIONS =
                  'Speak in European Portuguese (Portugal) accent — not Brazilian. ' +
                  'Clear, calm, and friendly for young children.'

                // Dynamic import avoids ESM/CJS issues in Vite config context
                const { default: OpenAI } = await import('openai')
                const openai = new OpenAI({ apiKey })
                const response = await openai.audio.speech.create({
                  model: isPT ? 'gpt-4o-mini-tts' : 'tts-1',
                  voice: 'nova',
                  input: text.trim().slice(0, 300),
                  response_format: 'mp3',
                  ...(isPT ? { instructions: PT_INSTRUCTIONS } : {}),
                } as any)

                const buffer = Buffer.from(await response.arrayBuffer())
                res.writeHead(200, {
                  'Content-Type': 'audio/mpeg',
                  'Cache-Control': 'public, max-age=3600',
                })
                res.end(buffer)
                console.log('[TTS dev] audio sent, bytes:', buffer.length)
              } catch (err) {
                console.error('[TTS dev] error:', err)
                res.writeHead(502); res.end('TTS generation failed')
              }
            })
          })
        },
      },
    ],

    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
