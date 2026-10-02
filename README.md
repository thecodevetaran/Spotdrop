# Spotdrop — Waitlist Website

> **Find somewhere worth going.**

A Hyderabad-first place-discovery platform waitlist landing page. Built with the aesthetic of a **premium city guide × Hyderabad culture magazine × internet scrapbook × emerging app**.

---

## 🎨 Visual Identity & Brand Philosophy

* **Primary Background:** `#F5F1E8` (warm tactile paper)
* **Primary Text:** `#111111` (deep ink)
* **Secondary Text:** `#77736C` (warm stone)
* **Accent:** `#D8FF45` (electric lime used sparingly for DROP tags, buttons, badges)
* **Brand Seal:** `#E25732` (warm terracotta pin mark)
* **Typography:**
  * **Headings:** Modern bold editorial sans (`Space Grotesk`, `Inter`)
  * **Annotations & Scribbles:** Handcrafted cursive (`Caveat`) for playful notes, arrows, and personal marginalia

---

## 📁 Project Structure

```
spotdrop/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   │   └── hero_main.jpg        # Authentic Jubilee Hills courtyard cafe (Portra 400 film)
│   │   ├── drops/
│   │   │   ├── drop_001.jpg         # Café / Jubilee Hills (Specialty concrete roastery)
│   │   │   ├── drop_002.jpg         # Sunset / Khajaguda Hills overlooking Hyderabad twilight
│   │   │   ├── drop_003.jpg         # Dinner / Banjara Hills (Intimate candlelit dining)
│   │   │   ├── drop_004.jpg         # Hidden / Begumpet (Secret bougainvillea courtyard)
│   │   │   └── city_chai.jpg        # Old City Irani Chai & Osmania biscuits
│   │   └── logo.png                 # Spotdrop official brand mark
│   └── logo.svg                     # Vector scalable brand logo
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Minimal sticky navigation with scroll blur & mobile drawer
│   │   ├── Hero.jsx                 # Editorial headline, coordinates, washi tape, authentic photo
│   │   ├── WaitlistForm.jsx         # Tactile input, instant feedback, canvas confetti
│   │   ├── DropCard.jsx             # Signature collectible scrapbook card format
│   │   ├── DropsSection.jsx         # Asymmetrical editorial drops grid
│   │   ├── ProductTease.jsx         # App preview with interactive tabs & phone hardware mockup
│   │   ├── DropOrSkip.jsx           # Interactive tastemaker card with DROP / SKIP responses
│   │   └── Footer.jsx               # Spacious, minimal footer with coordinates and dispatches
│   │
│   ├── sections/
│   │   ├── CityIntro.jsx            # "The city is bigger than your saved posts"
│   │   ├── PersonalitySection.jsx   # "you've got enough saved posts. go somewhere."
│   │   └── FinalWaitlist.jsx        # "BE IN THE FIRST DROP."
│   │
│   ├── services/
│   │   └── waitlist.js              # Decoupled waitlist submission service with API fallback
│   │
│   ├── utils/
│   │   └── confetti.js              # Zero-dependency canvas confetti engine
│   │
│   ├── styles/
│   │   ├── globals.css              # Reset, paper noise texture, stickers, washi tape, shadows
│   │   ├── typography.css           # Clamp typography scales, editorial styles, handwriting
│   │   └── animations.css           # Micro-interactions, tactile hover, swipe animations
│   │
│   ├── App.jsx                      # Narrative page assembly
│   └── main.jsx                     # React root mount
│
├── .env                             # Backend webhook / API configuration
├── .gitignore
├── package.json
└── vite.config.js
```

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```

---

## 🔌 Connecting a Real Waitlist Backend

The waitlist logic is decoupled inside [`src/services/waitlist.js`](src/services/waitlist.js).

To connect an external API (such as Supabase, Resend, Airtable, or a custom webhook):
1. Open `.env`
2. Set your API URL:
   ```env
   VITE_WAITLIST_API_URL=https://api.yourdomain.com/v1/waitlist
   ```
3. The client sends a `POST` request with JSON:
   ```json
   {
     "email": "user@example.com",
     "city": "Hyderabad",
     "timestamp": "2026-10-02T04:00:00.000Z",
     "source": "https://spotdrop.app"
   }
   ```
If no backend URL is set, the waitlist safely stores submissions in the browser's `localStorage` for testing.
