import OpenAI from 'openai'

export const config = { runtime: 'edge' }

const MAX_TEXT_LENGTH = 300

let openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!openai) openai = new OpenAI()
  return openai
}

const PT_INSTRUCTIONS =
  'Speak in European Portuguese (Portugal) accent — not Brazilian. ' +
  'Clear, calm, and friendly for young children.'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response('TTS not configured', { status: 503 })
  }

  let text: string
  let language: string = 'en'
  try {
    const body = (await req.json()) as { text?: unknown; language?: unknown }
    if (typeof body.text !== 'string' || !body.text.trim()) {
      return new Response('text is required', { status: 400 })
    }
    text = body.text.trim().slice(0, MAX_TEXT_LENGTH)
    if (typeof body.language === 'string') language = body.language
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  try {
    const isPT = language === 'pt'

    const response = await getOpenAI().audio.speech.create({
      model: isPT ? 'gpt-4o-mini-tts' : 'tts-1',
      voice: 'nova',
      input: text,
      response_format: 'mp3',
      ...(isPT ? { instructions: PT_INSTRUCTIONS } : {}),
    } as Parameters<OpenAI['audio']['speech']['create']>[0])

    const arrayBuffer = await response.arrayBuffer()

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error('[TTS] OpenAI error:', err)
    return new Response('TTS generation failed', { status: 502 })
  }
}
