import OpenAI from 'openai'

export const config = { runtime: 'edge' }

const MAX_GREETING_CHARS = 200

let openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!openai) openai = new OpenAI()
  return openai
}

const PT_TTS_INSTRUCTIONS =
  'Speak in European Portuguese (Portugal) accent — not Brazilian. ' +
  'Clear, warm, and friendly for young children.'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response('Not configured', { status: 503 })
  }

  let childName: string
  let companionName: string
  let companionPersonality: string
  let language: string
  let timeOfDay: string
  let stars: number
  let streak: number

  try {
    const body = (await req.json()) as {
      childName?: unknown
      companionName?: unknown
      companionPersonality?: unknown
      language?: unknown
      timeOfDay?: unknown
      stars?: unknown
      streak?: unknown
    }
    childName = typeof body.childName === 'string' && body.childName.trim() ? body.childName.trim().slice(0, 30) : 'Explorer'
    companionName = typeof body.companionName === 'string' ? body.companionName.trim().slice(0, 30) : 'friend'
    companionPersonality = typeof body.companionPersonality === 'string' ? body.companionPersonality.trim().slice(0, 50) : 'friendly'
    language = typeof body.language === 'string' ? body.language : 'en'
    timeOfDay = typeof body.timeOfDay === 'string' ? body.timeOfDay : 'morning'
    stars = typeof body.stars === 'number' ? body.stars : 0
    streak = typeof body.streak === 'number' ? body.streak : 0
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const isPT = language === 'pt'

  // Build GPT-4o-mini prompt
  const systemPrompt = isPT
    ? 'És um assistente simpático para crianças. Fala em Português de Portugal (não Brasileiro). Responde apenas com a saudação — sem aspas, sem explicações.'
    : 'You are a warm, encouraging assistant for young children. Respond with only the greeting — no quotes, no explanations.'

  const userPrompt = isPT
    ? `Cria uma saudação de boas-vindas de uma frase para ${childName}. A hora é ${timeOfDay === 'morning' ? 'manhã' : timeOfDay === 'afternoon' ? 'tarde' : 'noite'}. O seu companheiro chama-se ${companionName} (${companionPersonality}). Tem ${stars} estrelas e ${streak} dias seguidos. Menciona o nome e algo encorajador. Máximo 30 palavras.`
    : `Create a warm one-sentence welcome greeting for ${childName}. It is ${timeOfDay}. Their companion is ${companionName} (${companionPersonality}). They have ${stars} stars and a ${streak}-day streak. Mention their name and something encouraging. Max 25 words.`

  try {
    // Step 1: Generate personalized greeting text
    const chat = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 80,
      temperature: 0.8,
    })

    const greetingText = (chat.choices[0]?.message?.content ?? '').trim().slice(0, MAX_GREETING_CHARS)
    if (!greetingText) {
      return new Response('No greeting generated', { status: 502 })
    }

    // Step 2: Convert to speech
    const ttsResponse = await getOpenAI().audio.speech.create({
      model: isPT ? 'gpt-4o-mini-tts' : 'tts-1',
      voice: 'nova',
      input: greetingText,
      response_format: 'mp3',
      ...(isPT ? { instructions: PT_TTS_INSTRUCTIONS } : {}),
    } as Parameters<OpenAI['audio']['speech']['create']>[0])

    const arrayBuffer = await ttsResponse.arrayBuffer()

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[speak] error:', err)
    return new Response('Generation failed', { status: 502 })
  }
}
