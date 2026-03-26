import { useSettings } from '../contexts/settings-context'
import { useVoice } from '../contexts/voice-context'
import { pickPhrase, CoachingEvent } from '../lib/voice/coaching'

/**
 * useCoaching
 *
 * Returns a `coach(event)` function that picks a random language-appropriate
 * phrase for the given event and speaks it via VoiceContext.
 *
 * Usage:
 *   const { coach } = useCoaching()
 *   coach('correct')   // speaks e.g. "Correct." or "Correto."
 */
export function useCoaching() {
  const { language } = useSettings()
  const { speak } = useVoice()

  const coach = (event: CoachingEvent) => {
    const phrase = pickPhrase(language, event)
    speak(phrase)
  }

  return { coach }
}
