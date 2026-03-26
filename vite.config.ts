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

      // Dev-only: serve /api/speak locally (GPT-4o-mini → TTS)
      {
        name: 'speak-dev',
        configureServer(server) {
          server.middlewares.use('/api/speak', async (req, res) => {
            console.log('[speak dev] request received, method:', req.method)

            if (req.method !== 'POST') {
              res.writeHead(405); res.end('Method not allowed'); return
            }

            const apiKey = env.OPENAI_API_KEY
            if (!apiKey) {
              console.error('[speak dev] OPENAI_API_KEY not found in .env.local')
              res.writeHead(503); res.end('Not configured'); return
            }

            let body = ''
            req.on('data', (chunk) => { body += chunk.toString() })
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body) as {
                  childName?: string; companionName?: string; companionPersonality?: string
                  language?: string; timeOfDay?: string; stars?: number; streak?: number
                }
                const childName = parsed.childName?.trim().slice(0, 30) || 'Explorer'
                const companionName = parsed.companionName?.trim().slice(0, 30) || 'friend'
                const companionPersonality = parsed.companionPersonality?.trim().slice(0, 50) || 'friendly'
                const language = parsed.language || 'en'
                const timeOfDay = parsed.timeOfDay || 'morning'
                const stars = parsed.stars ?? 0
                const streak = parsed.streak ?? 0
                const isPT = language === 'pt'

                const systemPrompt = isPT
                  ? 'És um assistente simpático para crianças. Fala em Português de Portugal (não Brasileiro). Responde apenas com a saudação — sem aspas, sem explicações.'
                  : 'You are a warm, encouraging assistant for young children. Respond with only the greeting — no quotes, no explanations.'

                const userPrompt = isPT
                  ? `Cria uma saudação de boas-vindas de uma frase para ${childName}. A hora é ${timeOfDay === 'morning' ? 'manhã' : timeOfDay === 'afternoon' ? 'tarde' : 'noite'}. O seu companheiro chama-se ${companionName} (${companionPersonality}). Tem ${stars} estrelas e ${streak} dias seguidos. Menciona o nome e algo encorajador. Máximo 30 palavras.`
                  : `Create a warm one-sentence welcome greeting for ${childName}. It is ${timeOfDay}. Their companion is ${companionName} (${companionPersonality}). They have ${stars} stars and a ${streak}-day streak. Mention their name and something encouraging. Max 25 words.`

                console.log('[speak dev] generating greeting for:', childName, '| lang:', language)

                const { default: OpenAI } = await import('openai')
                const openai = new OpenAI({ apiKey })

                const chat = await openai.chat.completions.create({
                  model: 'gpt-4o-mini',
                  messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                  ],
                  max_tokens: 80,
                  temperature: 0.8,
                })

                const greetingText = (chat.choices[0]?.message?.content ?? '').trim().slice(0, 200)
                if (!greetingText) {
                  res.writeHead(502); res.end('No greeting generated'); return
                }

                console.log('[speak dev] greeting text:', greetingText)

                const PT_TTS_INSTRUCTIONS =
                  'Speak in European Portuguese (Portugal) accent — not Brazilian. ' +
                  'Clear, warm, and friendly for young children.'

                const ttsResponse = await openai.audio.speech.create({
                  model: isPT ? 'gpt-4o-mini-tts' : 'tts-1',
                  voice: 'nova',
                  input: greetingText,
                  response_format: 'mp3',
                  ...(isPT ? { instructions: PT_TTS_INSTRUCTIONS } : {}),
                } as any)

                const buffer = Buffer.from(await ttsResponse.arrayBuffer())
                res.writeHead(200, {
                  'Content-Type': 'audio/mpeg',
                  'Cache-Control': 'no-store',
                })
                res.end(buffer)
                console.log('[speak dev] audio sent, bytes:', buffer.length)
              } catch (err) {
                console.error('[speak dev] error:', err)
                res.writeHead(502); res.end('Generation failed')
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
