
v0-cognitive-calm-app
v0/marcopslopes-7de8a4fe
No message content
pasted-text.txt
18d ago

Read pasted-text.txt

Thought for 4s
I'll help you build this beautiful "Cognitive Calm" app with both screens - the calm dark-mode daily session screen and the category selection screen. Let me first generate design inspiration to ensure we create something visually compelling.


Generated design brief

Explore • 2 Files
Now I'll build both screens for your Cognitive Calm app. Let me update the globals.css with a custom theme, create the components, and wire everything together.


Updated theme colors

Created practice screen

Created practice page
v1
I've built both screens for your Cognitive Calm app:

Screen A (Home - Daily Session):

Dark charcoal gradient background with subtle noise/grain texture
5 animated cloud blobs drifting slowly at different speeds (40-90s loops)
Layered landscape curves at the bottom for depth
Large centered greeting with date
Breathing play button with subtle glow effect
Streak progress dots and session info
"Choose what to practice" link navigates to Screen B
Screen B (Choose Practice):

Light, warm background with clean spacing
6 large category cards: Logic, Memory, Focus, Words, Shapes, Creative
Each card has a soft colored icon container matching its theme
Selected state shows border highlight and subtle scale
"Start session" button enables only when a category is selected
"Surprise me" option for AI-picked exercises
Click the play button or "Choose what to practice" link on the home screen to navigate to the category selection screen. The design maintains a calm, premium feel without any gamification elements.

Diagnostics
No issues found

Worked for 2m 20s
18d ago
styles.css
18d ago

Read styles.css

Thought for 15s
I see the exact design specification. Let me update the app to match this precise styling with the correct colors, fonts, and animations.


Explore • 3 Files
Now I'll update the styles and components to match the exact design specification with the correct colors (sage, clay, primary cyan), Manrope/Varela Round fonts, and the precise layout.


Updated fonts and colors

Updated dark theme

Updated font vars

Updated layout fonts

Updated body classes
Now let me rewrite the daily session component to match the exact design:


Rewrote daily session

Read choose-practice

Rewrote choose-practice

Read globals.css
The styles are now in place. Let me update the practice page to remove dark mode since it should be light:


Read practice page

Updated practice page

Read layout
The practice page needs to explicitly handle light mode since the layout has dark class. Let me update the practice page and the choose-practice component properly:


Fixed practice page
v2
I've updated the Cognitive Calm app to match your exact design specification:

Changes made:

Updated the color palette with sage (
#7D9D9C), clay (
#C08B7E), slate (
#7C8B95), oat (
#E4DCCF), and the warm charcoal background (
#1F2023)
Added Manrope as the display font and Varela Round as the body font
Redesigned the daily session screen with the exact drifting cloud SVGs, rolling hills landscape, gradient blobs, and the pulsing play button with sage border
Updated the practice selection screen with light background and properly styled category cards using the custom color tokens
Added proper weekly progress dots with the "today" indicator style
The home screen is dark mode with atmospheric cloud animations and landscape layers, while the practice screen uses the light warm background. Click the play button or "Choose what to practice" link to navigate between screens.

Diagnostics
No issues found

Worked for 4m 25s
18d ago
styles.css
18d ago

Read styles.css

Thought for 6s
I see the exact HTML reference. Let me update the daily-session component to match this precise design with the correct header, button styling, progress dots, and background elements.


Read daily-session

Read globals.css
The component looks good but uses styled-jsx which may not work well with the current setup. Let me update it to use proper CSS-in-globals approach and fix the animations:


Added animations to CSS

Removed styled-jsx

Updated background class
v3
I've updated the daily session component to match the exact HTML reference. The changes include:

Added the pulse-soft and drift keyframe animations to globals.css so they work properly with Tailwind
Removed the styled-jsx block since the animations are now in globals.css
Added the dark class to the container to ensure dark mode colors apply correctly
The component now has the exact layout with the header navigation, centered greeting text, 160px play button with sage border, weekly progress dots (with the special "today" indicator style), and the atmospheric background with drifting clouds, rolling hills, and gradient blobs.

Diagnostics
No issues found

Worked for 1m 5s
18d ago


No file chosen
Drop files here to add as attachments
Upgrade to Team for more credits
Upgrade Plan



/




No changes

No file changes between these versions.

No Database Connected
Connect a database like Supabase or Upstash to view, search and manage your data, all in v0
What do you want to create?
pasted-text.txt
pasted-text.txt
Screen A — Home / Daily Session (inspired by Img 1)
Purpose: “Start today’s session” + set the calm vibe.
Components
Top-left: logo + product name
Top-right: settings icon
Center: “Good morning, [Name]” + date
Primary CTA: Begin session
Secondary: “Choose what to train” (goes to Screen B)
Small: streak indicator (calm, not gamified)
Motion
Slow floating clouds in background
Subtle parallax waves/landscape at bottom
Screen B — Choose Focus (inspired by Img 2)
Purpose: pick what the kid wants to practice today (or parent decides).
Components
Title: “What should we practice today?”
4–6 large cards (tap to select)
CTA: “Start session”
Optional: “Surprise me” (AI picks)
2) Visual direction + motion (clouds + landscape)
Background style (Screen A)
Dark, soft gradient (charcoal → slightly lighter center)
Very subtle noise / grain
Bottom: layered “landscape” curves (2–3 layers) for depth
Clouds motion
3–5 cloud blobs (very soft shapes)
Animate left-to-right slowly, different speeds
Opacity low (8–15%)
Blur slightly so it feels atmospheric
Motion spec
Speed: 40–90s loop
Easing: linear (so it doesn’t feel “gamey”)
Small vertical drift: 6–12px
Extra engagement (without overstimulation)
Pick 1–2:
Tiny “sparkle dust” particles near the CTA (very subtle)
Soft glow pulse behind the play button
Gentle “breathing” scale on the Begin button (1.00 → 1.02)
3) “What to learn today?” categories (good v1 set)
For your concept (cognitive training), avoid school-ish labels like “Numbers / Letters” unless you want edtech.
Option Set A (cognitive domains, simple language)
Logic — “Spot patterns & solve puzzles”
Memory — “Remember shapes & sequences”
Focus — “Stay sharp & react fast”
Words — “Stories, meanings & vocabulary”
Shapes — “Rotate, match & build”
Creative — “Invent, draw, imagine”
Option Set B (kid-friendly themes, mapped to domains)
Detective Mode (Logic)
Memory Quest (Memory)
Focus Ninja (Attention)
Story Studio (Language)
Shape Builder (Spatial)
Imagination Lab (Creative)
Option Set C (parent + child blend)
“Today I want to…”
Solve puzzles
Remember better
Pay attention
Tell stories
Build with shapes
Create something new
4) Copy that fits your “calm” brand
Screen A
H1: “Good morning, Leo.”
Sub: “Ready for a short thinking session?”
CTA: “Begin session”
Small: “3 exercises • ~6 minutes”
Streak: “Current streak: 3 days” (keep it tiny)
Screen B
H1: “What should we practice today?”
Sub: “Pick one — or we’ll choose for you.”
CTA: “Start session”
Secondary: “Surprise me”
5) Ready-to-paste v0 prompts
Prompt 1 — Screen A (Daily Session) with clouds + landscape
Paste this into v0:
Create a calm dark-mode “Daily Session” home screen for a kids cognitive training app called “Cognitive Calm”.
Layout:
- Top-left: small logo mark + text “Cognitive Calm”
- Top-right: settings icon
- Center: large greeting “Good morning, Leo.” and below it “Tuesday, October 24”
- Center: large circular play button (primary CTA). Under it: “BEGIN SESSION”
- Under the play circle: small dots indicator for streak progress (subtle)
- Small caption: “Current streak: 3 days” and “3 exercises • ~6 minutes”
Visual style:
- Dark charcoal gradient background with subtle grain/noise
- Bottom: layered abstract landscape curves/waves (2-3 layers) as silhouette shapes
- Add subtle animated cloud blobs in the background: 4 soft translucent shapes moving slowly horizontally at different speeds; very calm, low opacity, slightly blurred
- Minimal, modern typography, plenty of whitespace, no bright gamification
Interaction:
- Clicking “BEGIN SESSION” goes to the exercise screen (placeholder)
- Add secondary text link below: “Choose what to practice” that navigates to the category screen
Prompt 2 — Screen B (Choose what to practice) like Img 2, but your style
Create a clean “Choose what to practice today” screen for the same app.
Layout:
- Top: small avatar icon + greeting “Hello, Alex.”
- Subtitle: “What should we practice today?”
- Grid of 6 large rounded cards (2 rows x 3 columns on desktop, 2 columns on mobile):
  1) Logic — “Patterns & puzzles”
  2) Memory — “Recall shapes & sequences”
  3) Focus — “Stay sharp”
  4) Words — “Stories & meaning”
  5) Shapes — “Rotate & match”
  6) Creative — “Invent & imagine”
- Each card has a simple icon in a soft square container, title, and short description
- Bottom: Primary button “Start session” (disabled until one is selected)
- Secondary: “Surprise me” link/button
Style:
- Light mode option with warm white background (clean, airy) similar to modern education dashboards
- Large friendly typography, strong spacing, soft shadows, rounded corners
- Selected card state: subtle border + slight elevation
- Keep it calm and premium, not childish