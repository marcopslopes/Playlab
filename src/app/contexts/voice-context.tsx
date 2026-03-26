import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useSettings } from './settings-context'

// ─── Types ────────────────────────────────────────────────────────────────────

interface VoiceContextType {
  muted: boolean
  volume: number   // 0–1
  speed: number    // 0.5–2.0
  setMuted: (v: boolean) => void
  setVolume: (v: number) => void
  setSpeed: (v: number) => void
  speak: (text: string) => void
  stop: () => void
}

// ─── Module-level audio state (survives re-renders, cleared on page unload) ───

const audioCache = new Map<string, string>()
let currentAudio: HTMLAudioElement | null = null

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripEmoji(text: string): string {
  // Remove emoji characters so TTS receives clean text
  return text.replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/gu, '').trim()
}

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
}

function playBlobUrl(url: string, volume: number, speed: number) {
  const audio = new Audio(url)
  audio.volume = volume
  audio.playbackRate = speed
  currentAudio = audio
  audio.play().catch(() => {
    // Autoplay may be blocked before first user interaction — silently ignore
  })
  audio.onended = () => {
    if (currentAudio === audio) currentAudio = null
  }
}


// ─── Context ──────────────────────────────────────────────────────────────────

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: ReactNode }) {
  const { language } = useSettings()

  const [muted, setMutedState] = useState(false)
  const [volume, setVolumeState] = useState(0.7)  // matches 'Normal' in Settings card
  const [speed, setSpeedState] = useState(0.9)    // matches 'Normal' in Settings card

  // Load persisted preferences on mount
  useEffect(() => {
    const m = localStorage.getItem('cc-voice-muted')
    const v = localStorage.getItem('cc-voice-volume')
    const s = localStorage.getItem('cc-voice-speed')
    if (m !== null) setMutedState(m === 'true')
    if (v !== null) {
      const parsed = parseFloat(v)
      if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) setVolumeState(parsed)
    }
    if (s !== null) {
      const parsed = parseFloat(s)
      if (Number.isFinite(parsed) && parsed >= 0.5 && parsed <= 2) setSpeedState(parsed)
    }
  }, [])

  const setMuted = (v: boolean) => {
    setMutedState(v)
    localStorage.setItem('cc-voice-muted', String(v))
    if (v) stopCurrentAudio()
  }

  const setVolume = (v: number) => {
    setVolumeState(v)
    localStorage.setItem('cc-voice-volume', String(v))
  }

  const setSpeed = (v: number) => {
    setSpeedState(v)
    localStorage.setItem('cc-voice-speed', String(v))
  }

  const speak = useCallback(
    async (text: string) => {
      if (muted) return
      const trimmed = stripEmoji(text).trim()
      if (!trimmed) return

      stopCurrentAudio()

      // Serve from cache if available (sync — no await needed)
      const cached = audioCache.get(trimmed)
      if (cached) {
        playBlobUrl(cached, volume, speed)
        return
      }

      // Try OpenAI TTS via /api/tts (works in both dev via Vite middleware and production via Vercel)
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed, language }),
        })

        const contentType = res.headers.get('content-type') || ''
        if (!res.ok || !contentType.includes('audio')) return // silent — no fallback

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        audioCache.set(trimmed, url)
        if (audioCache.size > 50) {
          const firstKey = audioCache.keys().next().value
          if (firstKey !== undefined) {
            URL.revokeObjectURL(audioCache.get(firstKey)!)
            audioCache.delete(firstKey)
          }
        }
        playBlobUrl(url, volume, speed)
      } catch {
        // Network error — silent, no fallback
      }
    },
    [muted, volume, speed, language]
  )

  const stop = useCallback(() => {
    stopCurrentAudio()
  }, [])

  return (
    <VoiceContext.Provider value={{ muted, volume, speed, setMuted, setVolume, setSpeed, speak, stop }}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const ctx = useContext(VoiceContext)
  if (!ctx) throw new Error('useVoice must be used within VoiceProvider')
  return ctx
}
