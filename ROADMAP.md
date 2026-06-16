# МедиаПортал — Project Roadmap

---

## Overview

A video streaming platform for Tajikistan users. Amazon Prime Video-style UI.
Supports Кино, Сериалы, Комедия, Боевик, Подкасты, Шоу, Клипы, Новое, Популярное.

---

## Full Tech Stack

| Layer            | Technology                  | Why                                           |
|------------------|-----------------------------|-----------------------------------------------|
| Web Frontend     | Next.js 16 + Tailwind CSS   | SSR, routing, fast, TypeScript                |
| Mobile App       | React Native (Expo)         | Same language as web, shares API              |
| Backend API      | Django REST Framework       | You know Django, fast to build, battle-tested |
| Database         | PostgreSQL                  | Relational, reliable, free                    |
| Cache            | Redis                       | Fast session/cache layer                      |
| Video Hosting    | Bunny.net Stream            | Cheap, auto-transcodes to HLS, global CDN     |
| Auth             | JWT (SimpleJWT)             | Stateless, works for web + mobile             |
| Server           | Hetzner VPS (CPX21)         | ~€8/month, fast, reliable                     |
| Reverse Proxy    | Nginx                       | Routes traffic, SSL termination               |
| SSL              | Let's Encrypt (Certbot)     | Free HTTPS                                    |
| CI/CD            | GitHub Actions              | Auto-deploy on push                           |
| Containers       | Docker + Docker Compose     | Same environment everywhere                   |

---

## Phase 1 — Frontend (IN PROGRESS)

**Goal:** Full UI with all pages, no real backend yet. Mock data.

### Technologies
- Next.js 16, TypeScript, Tailwind CSS
- Inter font (Cyrillic support)

### Steps
- [x] Initialize Next.js project
- [x] Create mock data (`lib/data.ts`) — 40 video items across all categories
- [x] Build `Navbar` — Prime Video style, 66px, transparent → solid on scroll
- [x] Build `HeroBanner` — hero with title, description, outlined buttons, auto-slide
- [x] Build `VideoCard` — thumbnail, IMDb-style yellow star rating, Новинка badge
- [x] Build `CategoryRow` — 72px margins, 24px gaps, "Смотреть всё ›" link, scroll arrows
- [x] Build `CategoryPage` — grid page for each of the 9 categories
- [x] Build `/watch/[id]` — video player page with related content sidebar
- [x] Home page with all 9 category rows
- [ ] Search page (`/search?q=...`)
- [ ] Login / Register pages (UI only for now)
- [ ] User profile page (UI only)

---

## Phase 2 — Backend API

**Goal:** Django REST API that serves video metadata. No video files stored on server.

### Technologies
- Python 3.11+
- Django 5.x
- Django REST Framework
- SimpleJWT (for JWT auth)
- django-cors-headers (allow Next.js to call API)
- PostgreSQL (via psycopg2)
- Pillow (thumbnail image handling)

### Project Structure
```
backend/
├── mediaportal/          ← Django project
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── videos/               ← Main app
│   ├── models.py         ← Video, Category models
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── users/                ← Auth app
│   ├── models.py         ← Custom User model
│   ├── serializers.py
│   └── views.py
└── manage.py
```

### Database Models

**Category**
```
id, name, slug, description, created_at
```

**Video**
```
id, title, slug, description
category (FK → Category)
year, duration_seconds
rating (decimal)
hls_url          ← from Bunny.net, e.g. https://iframe.mediadelivery.net/...
thumbnail_url    ← from Bunny.net
backdrop_url
tags (JSONField)
is_new (bool)
is_popular (bool)
views_count
created_at, updated_at
```

**User** (extends AbstractUser)
```
id, email, username, password
avatar_url
watchlist (M2M → Video)
created_at
```

**WatchHistory**
```
user (FK), video (FK), progress_seconds, watched_at
```

### API Endpoints
```
GET  /api/videos/                  → list all (filters: category, is_new, is_popular)
GET  /api/videos/<id>/             → single video detail
GET  /api/categories/              → list all categories
GET  /api/categories/<slug>/videos/ → videos by category

POST /api/auth/register/           → create account
POST /api/auth/login/              → returns access + refresh JWT tokens
POST /api/auth/refresh/            → refresh access token

GET  /api/users/me/                → current user profile
POST /api/users/watchlist/add/     → add video to watchlist
POST /api/users/watchlist/remove/  → remove from watchlist
GET  /api/users/watchlist/         → user's saved list

POST /api/videos/<id>/view/        → increment view count
```

### Steps
- [ ] Create Django project, install DRF, SimpleJWT, cors-headers
- [ ] Create PostgreSQL database, configure settings.py
- [ ] Build Category and Video models
- [ ] Build serializers + viewsets
- [ ] Add JWT auth (register, login, refresh)
- [ ] Add CORS settings (allow localhost:3000 and production domain)
- [ ] Test all endpoints with Postman
- [ ] Replace mock data in Next.js with real API calls

---

## Phase 3 — Video Infrastructure

**Goal:** Upload videos to Bunny.net, get HLS playback URLs, store them in the database.

### Technologies
- Bunny.net Stream (video hosting + transcoding + CDN)
- tus protocol (resumable uploads for large files)
- Python upload script (bulk CSV import)
- FFmpeg (optional, for local pre-processing)

### How It Works
```
1. Admin uploads .mp4 file
2. File goes DIRECTLY to Bunny.net (not through our server)
3. Bunny.net transcodes → creates HLS chunks at 1080p / 720p / 480p
4. Bunny.net sends webhook to Django: "video XYZ ready"
5. Django saves hls_url + thumbnail_url to database
6. Video is live on the platform
```

### Bulk Upload Script (for 1000+ videos)
```
1. Prepare spreadsheet: filename | title | category | year | description
2. Run: python upload_videos.py --csv videos.csv --folder /path/to/mp4s
3. Script uploads each file to Bunny.net API
4. Script saves metadata to Django API
5. Come back in a few hours — done
```

### Steps
- [ ] Create Bunny.net account, set up Stream library
- [ ] Get Bunny.net API key
- [ ] Write Django webhook endpoint (`/api/videos/bunny-webhook/`)
- [ ] Write `upload_videos.py` script (reads CSV, uploads to Bunny, saves to DB)
- [ ] Test with 5-10 real video files
- [ ] Test HLS playback in the browser
- [ ] Replace Shaka/Video.js player in watch page with real HLS stream

### Video Player in Next.js
```
npm install hls.js
```
```tsx
// In /watch/[id]/page.tsx
<video ref={videoRef} controls />
// + useEffect to init Hls.js with item.hls_url
```

---

## Phase 4 — Admin Panel

**Goal:** Interface for adding/editing/deleting content.

### Technologies
- Django Admin (built-in, customize it)
- Later: custom React dashboard (optional)

### Steps
- [ ] Customize Django Admin for Video model (show thumbnails, filter by category)
- [ ] Add search, filters, bulk actions to admin
- [ ] Create admin user
- [ ] Set up admin at `yourdomain.com/admin`
- [ ] Restrict admin to IP whitelist (security)

---

## Phase 5 — Connect Frontend to Backend

**Goal:** Replace all mock data with real API calls.

### Technologies
- `fetch` (built into Next.js) or `axios`
- Server Components for initial data load (no loading spinner)
- Client Components for interactive parts

### Steps
- [ ] Create `lib/api.ts` — wrapper functions for all API calls
- [ ] Replace `lib/data.ts` mock data with real API calls
- [ ] Add loading skeletons while data loads
- [ ] Add error handling (404 pages, empty states)
- [ ] Implement search (`/search?q=...` → calls `/api/videos/?search=...`)
- [ ] Implement watchlist (add/remove, show in profile)

---

## Phase 6 — Authentication

**Goal:** Users can register, log in, and have a personal watchlist.

### Steps
- [ ] Build login page UI (`/login`)
- [ ] Build register page UI (`/register`)
- [ ] Connect to Django JWT endpoints
- [ ] Store JWT token in httpOnly cookie (secure)
- [ ] Protect routes: `/profile`, `/watchlist` require login
- [ ] Show/hide "В список" button based on auth state
- [ ] Profile page: show watchlist, watch history

---

## Phase 7 — Deployment

**Goal:** Live website accessible at your domain.

### Server
- **Hetzner CPX21**: 3 vCPU, 4GB RAM, 80GB SSD — €7.90/month
- Located in Finland (good latency for Central Asia)

### Architecture on Server
```
Internet → Nginx (port 80/443)
              ├── /api/*  → Django (Gunicorn, port 8000)
              └── /*      → Next.js (port 3000)

Docker Compose services:
  - nginx
  - nextjs
  - django
  - postgres
  - redis
```

### Steps
- [ ] Buy domain name (e.g. mediaportal.tj)
- [ ] Rent Hetzner CPX21 server
- [ ] Install Docker + Docker Compose on server
- [ ] Write `docker-compose.yml` for all services
- [ ] Write `Dockerfile` for Django and Next.js
- [ ] Configure Nginx: proxy rules + SSL
- [ ] Run Certbot → get Let's Encrypt SSL certificate
- [ ] Set up GitHub Actions: push to main → auto-deploy to server
- [ ] Configure environment variables (`.env` file on server)
- [ ] Run database migrations
- [ ] Test everything end-to-end

---

## Phase 8 — Mobile App

**Goal:** iOS and Android app using the same backend API.

### Technologies
- React Native (Expo SDK 52)
- Expo Router (file-based routing, same concept as Next.js)
- react-native-video (HLS video playback)
- Expo SecureStore (store JWT token safely)

### Why Expo?
- No need for Xcode/Android Studio to start
- Build APK/IPA in the cloud (Expo EAS Build)
- Same JavaScript knowledge as Next.js

### Screens
```
/ (Home)         → same rows as web homepage
/category/[slug] → category grid
/watch/[id]      → video player
/search          → search
/profile         → user profile + watchlist
/login           → login/register
```

### Steps
- [ ] `npx create-expo-app mediaportal-mobile --template`
- [ ] Set up Expo Router
- [ ] Build shared API client (same `lib/api.ts` logic)
- [ ] Build Home screen with horizontal FlatList rows
- [ ] Build video player screen with `react-native-video`
- [ ] Build login/register screens
- [ ] Test on iOS simulator + Android emulator
- [ ] Submit to App Store + Google Play

---

## Phase 9 — Growth Features (Future)

These are not needed at launch. Build when you have real users.

- [ ] Subtitle/caption support (`.vtt` files on Bunny.net)
- [ ] Comments and ratings
- [ ] Subscription/paywall (if monetizing)
- [ ] Push notifications (mobile)
- [ ] Recommendation engine (based on watch history)
- [ ] Analytics dashboard (views, popular content, retention)
- [ ] Redis caching for hot API responses

---

## Current Status

| Phase | Status |
|-------|--------|
| 1. Frontend | 🟡 In progress |
| 2. Backend API | ⬜ Not started |
| 3. Video Infrastructure | ⬜ Not started |
| 4. Admin Panel | ⬜ Not started |
| 5. Connect Frontend ↔ Backend | ⬜ Not started |
| 6. Authentication | ⬜ Not started |
| 7. Deployment | ⬜ Not started |
| 8. Mobile App | ⬜ Not started |
| 9. Growth Features | ⬜ Future |

---

## Estimated Timeline

| Phase | Effort |
|-------|--------|
| Finish Frontend (Phase 1) | 1–2 weeks |
| Backend API (Phase 2) | 2–3 weeks |
| Video Infrastructure (Phase 3) | 1 week |
| Admin + Upload script (Phase 4) | 3–5 days |
| Connect Frontend ↔ Backend (Phase 5) | 1 week |
| Auth (Phase 6) | 3–5 days |
| Deployment (Phase 7) | 3–5 days |
| Mobile App (Phase 8) | 4–6 weeks |
| **Total to launch (web)** | **~2.5 months** |
| **Total with mobile** | **~4 months** |
