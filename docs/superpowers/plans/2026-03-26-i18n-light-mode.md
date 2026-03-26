# i18n + Light Mode Default Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4-language i18n (EN, PT, ES, CA) with a custom `useTranslation` hook and set light mode as the default theme.

**Architecture:** A `useTranslation()` hook reads the active language from `SettingsContext` and returns a `t(key)` function that resolves dot-notation keys against locale JSON files. All UI strings are extracted to `src/locales/*.json`. Components call `t('key')` instead of hardcoded strings.

**Tech Stack:** React, TypeScript, custom hook (no new dependencies)

---

### Task 1: Create locale JSON files

**Files:**
- Create: `src/locales/en.json`
- Create: `src/locales/pt.json`
- Create: `src/locales/es.json`
- Create: `src/locales/ca.json`

- [ ] **Step 1: Create `src/locales/en.json`**

```json
{
  "onboarding": {
    "tapToStart": "TAP TO START",
    "startingUp": "Starting up...",
    "tapAColor": "TAP A COLOR! 🎨",
    "colors": {
      "red": "RED",
      "blue": "BLUE",
      "green": "GREEN",
      "yellow": "YELLOW"
    },
    "findLetterTitle": "FIND THE LETTER M! ⌨️",
    "findLetterHint": "Look at your keyboard and press the M key",
    "foundIt": "YOU FOUND IT! ✨",
    "findNumberTitle": "FIND THE NUMBER 5! 🔢",
    "findNumberHint": "Look at your keyboard and press the 5 key",
    "awesome": "AWESOME! ⭐",
    "didIt": "✨ YOU DID IT! ✨",
    "knowKeyboard": "You know your keyboard!",
    "startLearning": "START LEARNING! 🚀"
  },
  "companion": {
    "chooseTitle": "Choose Your Friend",
    "chooseSubtitle": "Who will learn with you today?",
    "selectButton": "Choose This Friend!",
    "companions": {
      "owl": { "name": "WISE OWL", "personality": "Calm & Thoughtful" },
      "bunny": { "name": "HAPPY BUNNY", "personality": "Gentle & Playful" },
      "fox": { "name": "CLEVER FOX", "personality": "Smart & Friendly" },
      "bear": { "name": "KIND BEAR", "personality": "Warm & Caring" },
      "cat": { "name": "SWEET CAT", "personality": "Curious & Cozy" },
      "dog": { "name": "LOYAL DOG", "personality": "Happy & Brave" }
    },
    "messages": [
      "You're doing great!",
      "Let's learn together!",
      "I'm so proud of you!",
      "Ready for fun?"
    ]
  },
  "daily": {
    "greetingMorning": "Good Morning",
    "greetingAfternoon": "Good Afternoon",
    "greetingEvening": "Good Evening",
    "readyForPractice": "Ready for today's practice?",
    "startPractice": "Start Practice",
    "starsEarned": "Stars Earned",
    "dayStreak": "Day Streak",
    "completed": "Completed"
  },
  "categories": {
    "title": "Choose Your Practice",
    "subtitle": "What would you like to work on today?",
    "startPractice": "Start Practice",
    "comingSoon": "Coming Soon",
    "items": {
      "logic": { "title": "Logic", "description": "Patterns & puzzles" },
      "memory": { "title": "Memory", "description": "Remember & match" },
      "focus": { "title": "Focus", "description": "Stay sharp!" },
      "words": { "title": "Words", "description": "Letters & stories" },
      "math": { "title": "Math", "description": "Numbers & counting" },
      "colors": { "title": "Colors", "description": "Mix & match hues" },
      "shapes": { "title": "Shapes", "description": "Rotate & match" },
      "creative": { "title": "Creative", "description": "Draw & imagine" },
      "music": { "title": "Music", "description": "Sounds & rhythms" },
      "languages": { "title": "Languages", "description": "Learn new words" }
    }
  },
  "nav": {
    "back": "Back",
    "home": "Home",
    "garden": "Garden",
    "dashboard": "Dashboard",
    "settings": "Settings",
    "restart": "Restart"
  },
  "settings": {
    "title": "Settings ⚙️",
    "theme": "Theme",
    "light": "☀️ Light",
    "dark": "🌙 Dark",
    "language": "Language",
    "childAge": "Child's Age",
    "ageLabel": "Age: {age} years old",
    "autoSave": "Settings are saved automatically and apply to the entire app experience.",
    "languages": {
      "en": "🇬🇧 English",
      "pt": "🇵🇹 Português",
      "es": "🇪🇸 Español",
      "ca": "🏴 Català"
    }
  },
  "achievements": {
    "unlocked": "Achievement Unlocked!",
    "tapToContinue": "Tap to continue"
  },
  "garden": {
    "title": "Your Garden",
    "subtitle": "Each flower blooms as you learn",
    "back": "Back"
  },
  "dashboard": {
    "title": "Parent Dashboard",
    "progress": "Progress",
    "achievements": "Achievements",
    "totalSessions": "Total Sessions",
    "totalStars": "Total Stars",
    "currentStreak": "Current Streak",
    "back": "Back"
  },
  "games": {
    "back": "Back",
    "correct": "Correct! 🎉",
    "tryAgain": "Try Again!",
    "wellDone": "Well Done! ⭐",
    "amazing": "Amazing! 🌟",
    "score": "Score",
    "level": "Level",
    "comingSoon": "Coming Soon!",
    "comingSoonMsg": "This game is being created with love. Check back soon!",
    "backToCategories": "Back to Categories"
  }
}
```

- [ ] **Step 2: Create `src/locales/pt.json`**

```json
{
  "onboarding": {
    "tapToStart": "TOCA PARA COMEÇAR",
    "startingUp": "A iniciar...",
    "tapAColor": "TOCA NUMA COR! 🎨",
    "colors": {
      "red": "VERMELHO",
      "blue": "AZUL",
      "green": "VERDE",
      "yellow": "AMARELO"
    },
    "findLetterTitle": "ENCONTRA A LETRA M! ⌨️",
    "findLetterHint": "Olha para o teclado e carrega na tecla M",
    "foundIt": "ENCONTRASTE! ✨",
    "findNumberTitle": "ENCONTRA O NÚMERO 5! 🔢",
    "findNumberHint": "Olha para o teclado e carrega na tecla 5",
    "awesome": "FANTÁSTICO! ⭐",
    "didIt": "✨ CONSEGUISTE! ✨",
    "knowKeyboard": "Já conheces o teclado!",
    "startLearning": "COMEÇAR A APRENDER! 🚀"
  },
  "companion": {
    "chooseTitle": "Escolhe o Teu Amigo",
    "chooseSubtitle": "Quem vai aprender contigo hoje?",
    "selectButton": "Escolher Este Amigo!",
    "companions": {
      "owl": { "name": "CORUJA SÁBIA", "personality": "Calma e Pensativa" },
      "bunny": { "name": "COELHO FELIZ", "personality": "Gentil e Brincalhão" },
      "fox": { "name": "RAPOSA ESPERTA", "personality": "Inteligente e Amigável" },
      "bear": { "name": "URSO SIMPÁTICO", "personality": "Caloroso e Carinhoso" },
      "cat": { "name": "GATO DOCE", "personality": "Curioso e Acolhedor" },
      "dog": { "name": "CÃO LEAL", "personality": "Alegre e Corajoso" }
    },
    "messages": [
      "Estás a fazer muito bem!",
      "Vamos aprender juntos!",
      "Tenho muito orgulho em ti!",
      "Pronto para a diversão?"
    ]
  },
  "daily": {
    "greetingMorning": "Bom Dia",
    "greetingAfternoon": "Boa Tarde",
    "greetingEvening": "Boa Noite",
    "readyForPractice": "Pronto para a prática de hoje?",
    "startPractice": "Começar Prática",
    "starsEarned": "Estrelas Ganhas",
    "dayStreak": "Dias Seguidos",
    "completed": "Concluídos"
  },
  "categories": {
    "title": "Escolhe a Tua Prática",
    "subtitle": "O que queres trabalhar hoje?",
    "startPractice": "Começar Prática",
    "comingSoon": "Em Breve",
    "items": {
      "logic": { "title": "Lógica", "description": "Padrões e puzzles" },
      "memory": { "title": "Memória", "description": "Lembra e combina" },
      "focus": { "title": "Foco", "description": "Mantém-te atento!" },
      "words": { "title": "Palavras", "description": "Letras e histórias" },
      "math": { "title": "Matemática", "description": "Números e contagem" },
      "colors": { "title": "Cores", "description": "Mistura e combina" },
      "shapes": { "title": "Formas", "description": "Roda e combina" },
      "creative": { "title": "Criativo", "description": "Desenha e imagina" },
      "music": { "title": "Música", "description": "Sons e ritmos" },
      "languages": { "title": "Línguas", "description": "Aprende novas palavras" }
    }
  },
  "nav": {
    "back": "Voltar",
    "home": "Início",
    "garden": "Jardim",
    "dashboard": "Painel",
    "settings": "Definições",
    "restart": "Reiniciar"
  },
  "settings": {
    "title": "Definições ⚙️",
    "theme": "Tema",
    "light": "☀️ Claro",
    "dark": "🌙 Escuro",
    "language": "Idioma",
    "childAge": "Idade da Criança",
    "ageLabel": "Idade: {age} anos",
    "autoSave": "As definições são guardadas automaticamente e aplicam-se a toda a experiência.",
    "languages": {
      "en": "🇬🇧 English",
      "pt": "🇵🇹 Português",
      "es": "🇪🇸 Español",
      "ca": "🏴 Català"
    }
  },
  "achievements": {
    "unlocked": "Conquista Desbloqueada!",
    "tapToContinue": "Toca para continuar"
  },
  "garden": {
    "title": "O Teu Jardim",
    "subtitle": "Cada flor desabrocha enquanto aprendes",
    "back": "Voltar"
  },
  "dashboard": {
    "title": "Painel dos Pais",
    "progress": "Progresso",
    "achievements": "Conquistas",
    "totalSessions": "Total de Sessões",
    "totalStars": "Total de Estrelas",
    "currentStreak": "Sequência Atual",
    "back": "Voltar"
  },
  "games": {
    "back": "Voltar",
    "correct": "Correto! 🎉",
    "tryAgain": "Tenta Outra Vez!",
    "wellDone": "Muito Bem! ⭐",
    "amazing": "Incrível! 🌟",
    "score": "Pontuação",
    "level": "Nível",
    "comingSoon": "Em Breve!",
    "comingSoonMsg": "Este jogo está a ser criado com carinho. Volta em breve!",
    "backToCategories": "Voltar às Categorias"
  }
}
```

- [ ] **Step 3: Create `src/locales/es.json`**

```json
{
  "onboarding": {
    "tapToStart": "TOCA PARA EMPEZAR",
    "startingUp": "Iniciando...",
    "tapAColor": "¡TOCA UN COLOR! 🎨",
    "colors": {
      "red": "ROJO",
      "blue": "AZUL",
      "green": "VERDE",
      "yellow": "AMARILLO"
    },
    "findLetterTitle": "¡ENCUENTRA LA LETRA M! ⌨️",
    "findLetterHint": "Mira tu teclado y pulsa la tecla M",
    "foundIt": "¡LA ENCONTRASTE! ✨",
    "findNumberTitle": "¡ENCUENTRA EL NÚMERO 5! 🔢",
    "findNumberHint": "Mira tu teclado y pulsa la tecla 5",
    "awesome": "¡GENIAL! ⭐",
    "didIt": "✨ ¡LO LOGRASTE! ✨",
    "knowKeyboard": "¡Ya conoces el teclado!",
    "startLearning": "¡EMPEZAR A APRENDER! 🚀"
  },
  "companion": {
    "chooseTitle": "Elige Tu Amigo",
    "chooseSubtitle": "¿Quién aprenderá contigo hoy?",
    "selectButton": "¡Elegir Este Amigo!",
    "companions": {
      "owl": { "name": "BÚHO SABIO", "personality": "Tranquilo y Reflexivo" },
      "bunny": { "name": "CONEJO FELIZ", "personality": "Gentil y Juguetón" },
      "fox": { "name": "ZORRO LISTO", "personality": "Inteligente y Amigable" },
      "bear": { "name": "OSO AMABLE", "personality": "Cálido y Cariñoso" },
      "cat": { "name": "GATO DULCE", "personality": "Curioso y Acogedor" },
      "dog": { "name": "PERRO LEAL", "personality": "Alegre y Valiente" }
    },
    "messages": [
      "¡Lo estás haciendo muy bien!",
      "¡Aprendamos juntos!",
      "¡Estoy muy orgulloso de ti!",
      "¿Listo para divertirse?"
    ]
  },
  "daily": {
    "greetingMorning": "Buenos Días",
    "greetingAfternoon": "Buenas Tardes",
    "greetingEvening": "Buenas Noches",
    "readyForPractice": "¿Listo para la práctica de hoy?",
    "startPractice": "Empezar Práctica",
    "starsEarned": "Estrellas Ganadas",
    "dayStreak": "Días Seguidos",
    "completed": "Completados"
  },
  "categories": {
    "title": "Elige Tu Práctica",
    "subtitle": "¿Qué quieres trabajar hoy?",
    "startPractice": "Empezar Práctica",
    "comingSoon": "Próximamente",
    "items": {
      "logic": { "title": "Lógica", "description": "Patrones y puzzles" },
      "memory": { "title": "Memoria", "description": "Recuerda y combina" },
      "focus": { "title": "Enfoque", "description": "¡Mantente atento!" },
      "words": { "title": "Palabras", "description": "Letras e historias" },
      "math": { "title": "Matemáticas", "description": "Números y conteo" },
      "colors": { "title": "Colores", "description": "Mezcla y combina" },
      "shapes": { "title": "Formas", "description": "Gira y combina" },
      "creative": { "title": "Creativo", "description": "Dibuja e imagina" },
      "music": { "title": "Música", "description": "Sonidos y ritmos" },
      "languages": { "title": "Idiomas", "description": "Aprende nuevas palabras" }
    }
  },
  "nav": {
    "back": "Volver",
    "home": "Inicio",
    "garden": "Jardín",
    "dashboard": "Panel",
    "settings": "Ajustes",
    "restart": "Reiniciar"
  },
  "settings": {
    "title": "Ajustes ⚙️",
    "theme": "Tema",
    "light": "☀️ Claro",
    "dark": "🌙 Oscuro",
    "language": "Idioma",
    "childAge": "Edad del Niño",
    "ageLabel": "Edad: {age} años",
    "autoSave": "Los ajustes se guardan automáticamente y se aplican a toda la experiencia.",
    "languages": {
      "en": "🇬🇧 English",
      "pt": "🇵🇹 Português",
      "es": "🇪🇸 Español",
      "ca": "🏴 Català"
    }
  },
  "achievements": {
    "unlocked": "¡Logro Desbloqueado!",
    "tapToContinue": "Toca para continuar"
  },
  "garden": {
    "title": "Tu Jardín",
    "subtitle": "Cada flor florece mientras aprendes",
    "back": "Volver"
  },
  "dashboard": {
    "title": "Panel de Padres",
    "progress": "Progreso",
    "achievements": "Logros",
    "totalSessions": "Total de Sesiones",
    "totalStars": "Total de Estrellas",
    "currentStreak": "Racha Actual",
    "back": "Volver"
  },
  "games": {
    "back": "Volver",
    "correct": "¡Correcto! 🎉",
    "tryAgain": "¡Inténtalo de nuevo!",
    "wellDone": "¡Muy bien! ⭐",
    "amazing": "¡Increíble! 🌟",
    "score": "Puntuación",
    "level": "Nivel",
    "comingSoon": "¡Próximamente!",
    "comingSoonMsg": "Este juego está siendo creado con cariño. ¡Vuelve pronto!",
    "backToCategories": "Volver a Categorías"
  }
}
```

- [ ] **Step 4: Create `src/locales/ca.json`**

```json
{
  "onboarding": {
    "tapToStart": "TOCA PER COMENÇAR",
    "startingUp": "Iniciant...",
    "tapAColor": "TOCA UN COLOR! 🎨",
    "colors": {
      "red": "VERMELL",
      "blue": "BLAU",
      "green": "VERD",
      "yellow": "GROC"
    },
    "findLetterTitle": "TROBA LA LLETRA M! ⌨️",
    "findLetterHint": "Mira el teu teclat i prem la tecla M",
    "foundIt": "L'HAS TROBAT! ✨",
    "findNumberTitle": "TROBA EL NÚMERO 5! 🔢",
    "findNumberHint": "Mira el teu teclat i prem la tecla 5",
    "awesome": "FANTÀSTIC! ⭐",
    "didIt": "✨ HO HAS ACONSEGUIT! ✨",
    "knowKeyboard": "Ja coneixes el teclat!",
    "startLearning": "COMENCEM A APRENDRE! 🚀"
  },
  "companion": {
    "chooseTitle": "Tria el Teu Amic",
    "chooseSubtitle": "Qui aprendrà amb tu avui?",
    "selectButton": "Triar Aquest Amic!",
    "companions": {
      "owl": { "name": "MUSSOL SAVI", "personality": "Tranquil i Reflexiu" },
      "bunny": { "name": "CONILL FELIÇ", "personality": "Gentil i Juganer" },
      "fox": { "name": "GUINEU LLESTA", "personality": "Intel·ligent i Amigable" },
      "bear": { "name": "ÓS AMABLE", "personality": "Càlid i Afectuós" },
      "cat": { "name": "GAT DOLÇ", "personality": "Curiós i Acollidor" },
      "dog": { "name": "GOS LLEIAL", "personality": "Alegre i Valent" }
    },
    "messages": [
      "Ho estàs fent molt bé!",
      "Aprenem junts!",
      "Estic molt orgullós de tu!",
      "Preparat per divertir-te?"
    ]
  },
  "daily": {
    "greetingMorning": "Bon Dia",
    "greetingAfternoon": "Bona Tarda",
    "greetingEvening": "Bona Nit",
    "readyForPractice": "Preparat per a la pràctica d'avui?",
    "startPractice": "Començar Pràctica",
    "starsEarned": "Estrelles Guanyades",
    "dayStreak": "Dies Seguits",
    "completed": "Completats"
  },
  "categories": {
    "title": "Tria la Teva Pràctica",
    "subtitle": "Què vols treballar avui?",
    "startPractice": "Començar Pràctica",
    "comingSoon": "Pròximament",
    "items": {
      "logic": { "title": "Lògica", "description": "Patrons i puzzles" },
      "memory": { "title": "Memòria", "description": "Recorda i combina" },
      "focus": { "title": "Atenció", "description": "Mantén-te atent!" },
      "words": { "title": "Paraules", "description": "Lletres i històries" },
      "math": { "title": "Matemàtiques", "description": "Números i comptar" },
      "colors": { "title": "Colors", "description": "Barreja i combina" },
      "shapes": { "title": "Formes", "description": "Gira i combina" },
      "creative": { "title": "Creatiu", "description": "Dibuixa i imagina" },
      "music": { "title": "Música", "description": "Sons i ritmes" },
      "languages": { "title": "Idiomes", "description": "Aprèn noves paraules" }
    }
  },
  "nav": {
    "back": "Tornar",
    "home": "Inici",
    "garden": "Jardí",
    "dashboard": "Tauler",
    "settings": "Configuració",
    "restart": "Reiniciar"
  },
  "settings": {
    "title": "Configuració ⚙️",
    "theme": "Tema",
    "light": "☀️ Clar",
    "dark": "🌙 Fosc",
    "language": "Idioma",
    "childAge": "Edat del Nen",
    "ageLabel": "Edat: {age} anys",
    "autoSave": "La configuració es desa automàticament i s'aplica a tota l'experiència.",
    "languages": {
      "en": "🇬🇧 English",
      "pt": "🇵🇹 Português",
      "es": "🇪🇸 Español",
      "ca": "🏴 Català"
    }
  },
  "achievements": {
    "unlocked": "Assoliment Desbloquejat!",
    "tapToContinue": "Toca per continuar"
  },
  "garden": {
    "title": "El Teu Jardí",
    "subtitle": "Cada flor floreix mentre aprens",
    "back": "Tornar"
  },
  "dashboard": {
    "title": "Tauler dels Pares",
    "progress": "Progrés",
    "achievements": "Assoliments",
    "totalSessions": "Total de Sessions",
    "totalStars": "Total d'Estrelles",
    "currentStreak": "Ratxa Actual",
    "back": "Tornar"
  },
  "games": {
    "back": "Tornar",
    "correct": "Correcte! 🎉",
    "tryAgain": "Torna-ho a intentar!",
    "wellDone": "Molt bé! ⭐",
    "amazing": "Increïble! 🌟",
    "score": "Puntuació",
    "level": "Nivell",
    "comingSoon": "Pròximament!",
    "comingSoonMsg": "Aquest joc s'està creant amb estima. Torna aviat!",
    "backToCategories": "Tornar a Categories"
  }
}
```

- [ ] **Step 5: Commit locale files**
```bash
git add src/locales/
git commit -m "feat: add locale JSON files for EN, PT, ES, CA"
```

---

### Task 2: Create `useTranslation` hook

**Files:**
- Create: `src/app/hooks/use-translation.ts`

- [ ] **Step 1: Write the hook**

```ts
import en from '../../../locales/en.json';
import pt from '../../../locales/pt.json';
import es from '../../../locales/es.json';
import ca from '../../../locales/ca.json';
import { useSettings } from '../contexts/settings-context';

type Language = 'en' | 'pt' | 'es' | 'ca';

const locales: Record<Language, Record<string, unknown>> = { en, pt, es, ca };

function resolve(obj: Record<string, unknown>, key: string): string {
  const value = key.split('.').reduce<unknown>((o, k) => {
    if (o && typeof o === 'object') return (o as Record<string, unknown>)[k];
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : key;
}

export function useTranslation() {
  const { language } = useSettings();
  const translations = locales[language] ?? locales.en;

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let str = resolve(translations as Record<string, unknown>, key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  return { t };
}
```

- [ ] **Step 2: Commit**
```bash
git add src/app/hooks/use-translation.ts
git commit -m "feat: add useTranslation hook"
```

---

### Task 3: Update `SettingsContext` — default theme + new languages

**Files:**
- Modify: `src/app/contexts/settings-context.tsx`

- [ ] **Step 1: Update the context**

Change:
- `type Language = 'en' | 'pt'` → `'en' | 'pt' | 'es' | 'ca'`
- Default state `'dark'` → `'light'`
- localStorage fallback validation to accept all 4 language codes

- [ ] **Step 2: Commit**
```bash
git add src/app/contexts/settings-context.tsx
git commit -m "feat: default theme light, add es/ca language options"
```

---

### Task 4: Update Settings screen — 4 language buttons

**Files:**
- Modify: `src/app/components/settings.tsx`

- [ ] **Step 1: Add `useTranslation`, replace strings, add ES + CA buttons**

Replace all hardcoded strings with `t()` calls. Change language button row from 2 buttons to a 2×2 grid with EN, PT, ES, CA.

- [ ] **Step 2: Commit**
```bash
git add src/app/components/settings.tsx
git commit -m "feat: settings screen i18n + 4 language buttons"
```

---

### Task 5: Update Onboarding, CompanionSelection, DailySession

**Files:**
- Modify: `src/app/components/onboarding.tsx`
- Modify: `src/app/components/companion-selection.tsx`
- Modify: `src/app/components/daily-session.tsx`

- [ ] **Step 1: Update onboarding.tsx** — replace all hardcoded strings
- [ ] **Step 2: Update companion-selection.tsx** — replace title, subtitle, button, companion names/personalities
- [ ] **Step 3: Update daily-session.tsx** — replace greeting, subtitle, stats labels, companion messages
- [ ] **Step 4: Commit**
```bash
git add src/app/components/onboarding.tsx src/app/components/companion-selection.tsx src/app/components/daily-session.tsx
git commit -m "feat: i18n onboarding, companion selection, daily session"
```

---

### Task 6: Update ChoosePractice, AchievementCelebration, Garden, Dashboard

**Files:**
- Modify: `src/app/components/choose-practice.tsx`
- Modify: `src/app/components/achievement-celebration.tsx`
- Modify: `src/app/components/garden.tsx`
- Modify: `src/app/components/parent-dashboard.tsx`

- [ ] **Step 1: Update choose-practice.tsx** — title, subtitle, nav labels, category titles/descriptions, start button
- [ ] **Step 2: Update achievement-celebration.tsx** — "Achievement Unlocked!", "Tap to continue"
- [ ] **Step 3: Update garden.tsx** — title, subtitle, back
- [ ] **Step 4: Update parent-dashboard.tsx** — title, stats labels, back
- [ ] **Step 5: Commit**
```bash
git add src/app/components/choose-practice.tsx src/app/components/achievement-celebration.tsx src/app/components/garden.tsx src/app/components/parent-dashboard.tsx
git commit -m "feat: i18n choose-practice, achievements, garden, dashboard"
```

---

### Task 7: Update game components

**Files:**
- Modify: `src/app/components/games/coming-soon.tsx`
- Modify: All other game components (back buttons, feedback strings)

- [ ] **Step 1: Update coming-soon.tsx** — title, message, back button
- [ ] **Step 2: Update game components** — back button, correct/wrong feedback, score/level labels
- [ ] **Step 3: Commit**
```bash
git add src/app/components/games/
git commit -m "feat: i18n game components"
```
