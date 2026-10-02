# Spotdrop — Hyderabad Waitlist System

> **Find somewhere worth going.**

A production-ready, full-stack waitlist system for **Spotdrop**, a Hyderabad-first place-discovery platform. Built with a digital scrapbook aesthetic (**premium city guide × Hyderabad culture magazine × internet scrapbook × emerging app**), backed by a lightweight, zero-cloud-lockin persistent storage engine.

---

## 🎨 System Overview

* **Landing Experience:** Tactile scrapbook with authentic Hyderabad 35mm film photography, custom canvas confetti, and seamless inline waitlist forms.
* **Backend Architecture:** Native SQLite persistent storage engine (`node:sqlite`) with prepared statements, unique constraints, and indexes. Zero Supabase / Firebase / external cloud database dependencies required.
* **Referral Tracking:** Automatic attribution for traffic sources (`?ref=instagram`, `?ref=story`, `?ref=creator`) and viral user invite codes (`?ref=SPOT-XXXXX`).
* **Protected Admin Dashboard:** Real-time metrics (**TOTAL**, **TODAY**, **THIS WEEK**, **REFERRALS**), paginated data table, search, source filters, status management, and one-click RFC 4180 CSV export.
* **Security & Abuse Protection:** Cryptographically signed session cookies, constant-time password verification (`crypto.timingSafeEqual`), sliding-window rate limiting, and honeypot bot traps.

---

## 📁 File Structure

```
spotdrop/
├── data/
│   └── spotdrop.db                  # Persistent SQLite database (git-ignored)
│
├── server/
│   ├── db.js                        # Database layer (schema, queries, referral code generator)
│   ├── auth.js                      # Admin session tokens & timing-safe password validation
│   ├── rateLimit.js                 # Sliding-window IP rate limiter
│   ├── api.js                       # Express API endpoints (/api/waitlist, /api/admin/*)
│   └── vitePlugin.js                # Vite dev server middleware integration
│
├── server.js                        # Production Node/Express server
│
├── public/
│   ├── images/
│   │   ├── hero/hero_main.jpg       # Jubilee Hills courtyard cafe (Portra 400 film)
│   │   ├── drops/                   # 4 Curated Hyderabad discovery photos + Irani Chai
│   │   └── logo.png                 # Spotdrop official mark
│   └── logo.svg                     # Scalable vector logo
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Sticky header with scroll blur
│   │   ├── Hero.jsx                 # Editorial headline & scrapbook polaroid
│   │   ├── WaitlistForm.jsx         # Connected form, instant feedback, referral copy
│   │   ├── DropCard.jsx             # Collectible scrapbook card
│   │   ├── DropsSection.jsx         # Asymmetrical editorial drops grid
│   │   ├── ProductTease.jsx         # Mobile hardware preview with interactive tabs
│   │   ├── DropOrSkip.jsx           # Interactive tastemaker card with playful responses
│   │   └── Footer.jsx               # Spacious footer with discreet admin link
│   │
│   ├── sections/
│   │   ├── CityIntro.jsx            # "The city is bigger than your saved places"
│   │   ├── PersonalitySection.jsx   # "you've got enough saved posts. go somewhere."
│   │   └── FinalWaitlist.jsx        # "BE IN THE FIRST DROP."
│   │
│   ├── pages/
│   │   ├── AdminLogin.jsx           # Secure password authentication page
│   │   └── AdminDashboard.jsx       # Real-time metrics, search, filters, CSV export
│   │
│   ├── services/
│   │   └── waitlist.js              # Client API service for /api/waitlist
│   ├── utils/
│   │   ├── referral.js              # Session-preserved ?ref= attribution tracking
│   │   └── confetti.js              # Canvas confetti physics engine
│   └── styles/
│       ├── globals.css              # Washi tape, stickers, polaroid styles
│       ├── typography.css           # Clamp typography & Caveat handwriting
│       └── animations.css           # Micro-interactions & card animations
│
├── .env.example                     # Environment template
├── .env                             # Local environment secrets (git-ignored)
├── package.json
└── vite.config.js
```

---

## ⚡ Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default local variables:
```env
PORT=3000
ADMIN_PASSWORD=spotdrop_admin_2026
SESSION_SECRET=spotdrop_dev_secret_key_hyd_2026
DATABASE_PATH=./data/spotdrop.db
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)**. The Vite dev server mounts the backend API directly via `spotdropApiPlugin` on port `5173`.

### 4. Open the Admin Dashboard
Visit **[http://localhost:5173/admin](http://localhost:5173/admin)**.
* **Default Password:** `spotdrop_admin_2026` (change this in `.env` for production).

---

## 📦 Production Build & Deployment

### 1. Build the Frontend
```bash
npm run build
```
This compiles the client app into the optimized `dist/` directory.

### 2. Run the Production Server
```bash
npm start
```
Starts the Node.js production server on `PORT` (default `3000`), serving both the API endpoints and the static SPA frontend with SPA routing fallback.

### Deploying to Cloud Platforms (Render, Railway, Docker, VPS)
* **Start Command:** `npm run build && npm start`
* **Node Version:** Node.js v22.5.0+ or v24+
* **Persistent Disk (Optional):** Mount a volume to `./data/` if your host uses ephemeral disks, ensuring `spotdrop.db` persists across redeployments.

---

## 🗄️ Database & Schema

Spotdrop uses SQLite (`node:sqlite`) with zero external drivers. Tables and indexes are created automatically on server boot:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  created_at TEXT NOT NULL,
  source TEXT DEFAULT 'direct',
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  status TEXT DEFAULT 'waitlisted',
  notes TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
```

---

## 🔗 Referral & Attribution Tracking

1. **Campaign Attribution:** Users visiting `https://spotdrop.app/?ref=instagram` or `?ref=creator` have their initial source stored in `sessionStorage` and attached to their signup.
2. **User Referrals:** Every signup receives a unique code (e.g. `SPOT-A8K4X`).
3. **Friend Signups:** When someone visits `https://spotdrop.app/?ref=SPOT-A8K4X` and joins:
   * `referred_by` is set to `SPOT-A8K4X`
   * `source` is categorized as `referral`
   * The admin dashboard automatically tracks referral conversions.

---

## 💾 CSV Export & Backup

Authenticated admins can download the entire signup database at any time:
1. Navigate to `/admin`.
2. Click **EXPORT CSV ↓** in the toolbar.
3. Or fetch via API with authentication:
   ```bash
   curl -b "spotdrop_admin_session=<YOUR_TOKEN>" http://localhost:3000/api/admin/export -o waitlist.csv
   ```
4. Back up the raw database file: simply copy `./data/spotdrop.db`.
