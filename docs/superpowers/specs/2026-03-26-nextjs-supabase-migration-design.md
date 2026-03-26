# Playdate — Next.js + Supabase Full Rewrite Design

## Goal
Rebuild the Playdate children's educational app as a Next.js 15 App Router project with Supabase auth, multi-child profiles, cross-device progress sync, and a full parent control dashboard. All existing child-facing UI/UX is preserved exactly.

## Architecture

**Stack:**
- Next.js 15 (App Router, TypeScript)
- Supabase (Auth + PostgreSQL + Row Level Security)
- Tailwind CSS v4
- OpenAI SDK v6 (TTS + GPT-4o-mini for personalized greetings)
- motion (animations), canvas-confetti (achievements), lucide-react (icons)

**Two worlds in one app:**
- **Child world** — all existing screens and games, unchanged UI/UX, scoped to the active child
- **Parent world** — new screens for account management, child profiles, progress, controls — built in the same design system (teal #7D9D9C, warm #C08B7E, slate #7C8B95, rounded-3xl, font-display/font-body)

---

## Project Locations

- **Local:** `/Users/marcodasilva/Desktop/Portfolio/Apps/playdate-next`
- **GitHub:** `https://github.com/marcopslopes/playdate`
- **Source to copy from:** `/Users/marcodasilva/Desktop/Portfolio/Apps/playdate`
- **Supabase URL:** `https://qalphniqyqlstosudcib.supabase.co`

---

## App Flow

```
Visit app
  → Not logged in → /login
  → Logged in, no children → /parent/children/new
  → Logged in, has children → child selector overlay
      → select child → child world (/daily)
      → tap lock icon → parent dashboard (/parent)
```

---

## Route Structure

### Auth routes
```
app/(auth)/
  login/page.tsx          — email/password + Google OAuth
  signup/page.tsx         — create parent account
  forgot-password/page.tsx
```

### Parent routes (require auth)
```
app/(parent)/
  parent/
    page.tsx                          — all children overview
    children/
      new/page.tsx                    — create first/new child
      [childId]/
        page.tsx                      — child overview (stars, streak, last played)
        progress/page.tsx             — game-by-game breakdown + weekly chart
        achievements/page.tsx         — achievement history timeline
        controls/page.tsx             — time limits, category toggles, reset progress
        settings/page.tsx             — name, companion, age, language, theme
```

### Child routes (require active child selection)
```
app/(child)/
  page.tsx                            — Onboarding
  daily/page.tsx
  choose-companion/page.tsx
  categories/page.tsx
  settings/page.tsx
  dashboard/page.tsx
  garden/page.tsx
  game/
    [category]/page.tsx               — curriculum screen (logic, math, etc.)
    [category]/[gameId]/page.tsx      — individual game
  api/
    tts/route.ts                      — OpenAI TTS (Edge Runtime)
    speak/route.ts                    — GPT-4o-mini → TTS (Edge Runtime)
```

---

## Database Schema

```sql
-- Children profiles
create table children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references auth.users not null,
  name text not null,
  age int not null default 6,
  companion_id text,
  companion_emoji text,
  companion_name text,
  companion_personality text,
  language text not null default 'en',
  theme text not null default 'light',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

-- Parental controls
create table child_controls (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children on delete cascade not null unique,
  daily_time_limit_minutes int,           -- null = unlimited
  enabled_categories text[]              -- null = all enabled
);

-- Voice settings
create table voice_settings (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children on delete cascade not null unique,
  muted boolean not null default false,
  volume float not null default 0.7,
  speed float not null default 0.9
);

-- Game progress
create table game_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children on delete cascade not null,
  game_id text not null,
  category_id text not null,
  stars int not null default 0,
  completed boolean not null default false,
  attempts int not null default 0,
  best_time float,
  last_played timestamptz,
  unique(child_id, game_id)
);

-- Achievements
create table achievements (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children on delete cascade not null,
  achievement_id text not null,
  name text not null,
  description text not null,
  emoji text not null,
  unlocked_at timestamptz not null default now(),
  unique(child_id, achievement_id)
);

-- Play sessions (time tracking + weekly reports)
create table play_sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children on delete cascade not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  games_played int not null default 0,
  stars_earned int not null default 0
);
```

**Row Level Security:** All tables have RLS enabled. Parents can only access rows where `child_id` belongs to a child with `parent_id = auth.uid()`.

---

## Context Layer (Client)

The three existing contexts are preserved with the same interface — game components need zero changes:

| Context | Change |
|---|---|
| `SettingsContext` | Reads/writes Supabase `children` + `voice_settings` instead of localStorage |
| `ProgressContext` | Reads/writes Supabase `game_progress` + `achievements` instead of localStorage |
| `VoiceContext` | Unchanged — browser audio, reads settings from SettingsContext |
| `ActiveChildContext` | NEW — holds the selected child's ID, switches between siblings |

All contexts are wrapped in `app/providers.tsx` (client component), mounted in root layout.

---

## New Parent Dashboard Screens

All built in the existing design system:
- Same `rounded-3xl` cards, teal/warm/slate palette
- Same `font-display` / `font-body` typography
- Light/dark theme support
- Responsive (mobile-first)

**Parent home (`/parent`):** Grid of child cards — avatar emoji, name, stars, streak, last played. "Add child" button.

**Child overview (`/parent/children/[id]`):** Stats summary + quick links to progress, achievements, controls.

**Progress (`/parent/children/[id]/progress`):** Weekly bar chart (recharts, already a dependency), game-by-game star ratings grouped by category.

**Achievements (`/parent/children/[id]/achievements`):** Timeline of unlocked achievements with emoji, name, date.

**Controls (`/parent/children/[id]/controls`):** Daily time limit slider, category enable/disable toggles, "Reset all progress" danger button.

---

## API Routes

Both existing API routes migrate to Next.js Route Handlers with identical logic:

| Route | Runtime | Purpose |
|---|---|---|
| `POST /api/tts` | Edge | OpenAI TTS → MP3 |
| `POST /api/speak` | Edge | GPT-4o-mini → TTS → MP3 |

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://qalphniqyqlstosudcib.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_T5HBRadCugj6fpo5uh0fnA_kbSZV1Th
SUPABASE_SERVICE_ROLE_KEY=<service role key>
OPENAI_API_KEY=<openai key>
```

---

## Migration Strategy

Components copy from the Vite project with two mechanical changes only:
1. Add `'use client'` directive at top
2. Replace `useNavigate()` → `useRouter()` and `<Link>` from `react-router` → `next/link`

All 26 game components, all curriculum screens, all shared components — same code.
