# KeyRush — The Competitive Typing Arena for College Students

An interactive, gamified typing tutor website engineered specifically for college students and developers. Combines the distraction-free typing ergonomics of Monkeytype, the adrenaline of TypeRacer, and modern collegiate progression systems.

## ✨ Features

- **Core Typing Engine (Monkeytype-grade):**
  - Smooth caret tracking (Line, Block, Underline)
  - Real-time keystroke precision with character-by-character highlights
  - Accurate Net WPM, Raw WPM, Accuracy %, Consistency index, and live velocity charts
  - Durations: 15s, 30s, 60s, 120s, and Unlimited (∞) mode
  - Keyboard shortcuts (`Tab` to restart, `Space` to advance word)
- **Zero-Latency Mechanical Keyboard Sound Synthesizer:**
  - Synthesized via Web Audio API (Holy Panda Thock, Cherry MX Blue click, Cherry MX Brown tactile, Cyber beep)
  - 100% offline ready with zero audio asset loading lag
- **Academic Mode:**
  - Authentic college-level passages across Computer Science, Linear Algebra, Thermodynamics, CRISPR Genetics, Macroeconomics, and Philosophy
  - Difficulty filters (Easy, Medium, Hard)
- **Code Mode:**
  - Real programming challenges with syntax, indentation, brackets `{}`, and operators in Python, TypeScript, JavaScript, Java, C++, and SQL
- **College Race:**
  - Real-time animated racetrack against collegiate AI opponents from MIT, Stanford, UC Berkeley, and Oxford
  - Live position ranking, live WPM, and podium finishes with confetti celebrations
- **Survival Mode:**
  - Fast-paced endless typing where mistakes damage integrity and correct keystrokes build combo multipliers
- **Assignment-to-Typing Feature:**
  - Upload PDF/TXT assignments, lecture slides, or paste notes to automatically chunk and convert your real college coursework into interactive typing passages
- **AI-Powered Adaptive Practice:**
  - Interactive 3-row keyboard error heatmap identifying mistyped bigrams and generating targeted finger workouts
- **Collegiate Gamification:**
  - 6 Level progression tiers from Level 1 (Freshman) to Level 50 (Typing Legend)
  - Anti-farming XP calculations
  - 16 unlockable achievements with toast notifications
  - Daily practice streak counter & multiplier
- **Student Dashboard:**
  - Interactive Recharts progression charts, mode engagement breakdown, weak keys, and granular session logs
- **Global & Campus Leaderboards:**
  - Global, Weekly, Daily, and University filters (MIT, Stanford, Berkeley, Oxford, IIT, etc.)
- **Themes & Cloud Integration:**
  - Dark/Charcoal, Cyberpunk Neon, Midnight Navy, Dracula Violet, and Minimal Monokai
  - Built-in offline-first storage with optional Supabase cloud synchronization

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev

# Open in browser:
# http://127.0.0.1:5173/
```

### Production Build

```bash
npm run build
npm run preview
```
