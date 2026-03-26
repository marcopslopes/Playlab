// Supported voice languages — a subset of the app's full language list.
// To add a new language: add its code to VoiceLanguage and add a full
// COACHING_PHRASES entry for it. No other file needs to change.
export type VoiceLanguage = 'en' | 'pt'
// Future: | 'es' | 'ca' | 'fr'

export type CoachingEvent =
  | 'correct'         // right answer feedback
  | 'wrong'           // wrong answer feedback
  | 'game_start'      // when a game or session loads
  | 'game_end'        // when a game completes
  | 'companion_cheer' // companion clicked for encouragement

export const COACHING_PHRASES: Record<VoiceLanguage, Record<CoachingEvent, string[]>> = {
  en: {
    correct: ['Correct.', 'Well done.', "That's right.", 'Good job.', 'Yes, that one.'],
    wrong: ['Try again.', 'Not quite.', 'Have another go.', 'Almost there.'],
    game_start: ["Let's begin.", 'Here we go.', "Ready? Let's start.", 'Time to play.'],
    game_end: ['Well done.', 'Great effort.', 'All finished.', 'Good work today.'],
    companion_cheer: ["You're doing great.", 'Keep going.', 'Amazing work.', 'I believe in you.'],
  },
  pt: {
    correct: ['Correto.', 'Muito bem.', 'Isso mesmo.', 'Boa resposta.', 'Exatamente.'],
    wrong: ['Tenta outra vez.', 'Não foi dessa.', 'Tenta de novo.', 'Quase lá.'],
    game_start: ['Vamos começar.', 'Pronto? Vamos lá.', 'Aqui vamos nós.', 'Hora de jogar.'],
    game_end: ['Muito bem.', 'Ótimo esforço.', 'Terminaste.', 'Bom trabalho hoje.'],
    companion_cheer: ['Estás a ir muito bem.', 'Continua assim.', 'Fantástico.', 'Acredito em ti.'],
  },
}

/** Pick a random phrase for the given language and event. Falls back to 'en' if language not found. */
export function pickPhrase(lang: string, event: CoachingEvent): string {
  const phrases =
    COACHING_PHRASES[lang as VoiceLanguage]?.[event] ?? COACHING_PHRASES['en'][event]
  return phrases[Math.floor(Math.random() * phrases.length)]
}
