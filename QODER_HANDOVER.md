# 🎵 LJ MUSIC OS — QODER CONTINUATION & HANDOVER GUIDE
**Project Repository:** [https://github.com/LJENTERTAINMENTMUSIC/lj-music-os](https://github.com/LJENTERTAINMENTMUSIC/lj-music-os)  
**Branch:** `main` (Latest commit: `e92666f`)  
**Production Live URL:** [https://lj-music-os.vercel.app](https://lj-music-os.vercel.app)  
**Local Dev Server:** `http://localhost:3456`  
**Local Workspace Path:** `C:\Users\USER\.gemini\antigravity\scratch\lj-music-os`  
**Supabase Database:** `https://raneitkthnzfilpifqck.supabase.co` (Project: `raneitkthnzfilpifqck`)  

---

## 1. Quick Start Commands for Qoder

```bash
# 1. Open the project root directory
cd C:\Users\USER\.gemini\antigravity\scratch\lj-music-os

# 2. Install dependencies (if needed)
npm install

# 3. Start the LJ Music OS development server (Port 3456)
node server.js
# Access locally at http://localhost:3456

# 4. Run the comprehensive QA Deep Audit (57/57 tests + 269 UI buttons)
node scripts/qa-deep-audit.js
```

---

## 2. Platform Summary & PRD

LJ Music OS is an autonomous, AI-driven music intelligence and rights management platform for **LJ Entertainment Ltd** and its recording artists, centered around flagship artist **Drey Star** (track: *"KIRA"*).

### Core Features & Divisions (10,600 Agents):
1. **Master AI CEO Briefing:** Top-10 automated strategic action matrix, revenue velocity, 8-persona AI board council debate.
2. **Spotify for Artists Focus Bar:** Pinned focus on Drey Star (1.42M monthly listeners), 1-click multi-platform artist resolver & Supabase ingest.
3. **Mogul Royalty & Discrepancy Recovery Ledger:** Master, mechanical, performance, neighboring rights splits; 1-click auto-claim all discrepancies; The MLC and SoundExchange bulk CSV claim generator; printable certified PDF statement.
4. **Real-Time Telemetry & Live Pulse:** Server-Sent Events (SSE) `/api/telemetry/stream`, live pulse simulator, Lagos/London/New York/Tokyo station clocks, geo heatmap.
5. **Division 14 Autonomous Playlist Swarm:** Guaranteed Slots #1–#3 for LJ releases in TikTok Viral Afrobeats and custom trending playlists, automatic rebalancing engine.
6. **Division 16 Online Radio Broadcast Swarm:** 4 online web stations (Lagos Nights Radio 106.8 FM, Pan-African Heritage, Afro-House, Commercial Sync), live spin overrides, auto-play background broadcaster.
7. **Division 17 Lyrics Intelligence & 11 DSP Matrix:** Dialect-aware transcription (Nigerian Pidgin, Yoruba oriki, Igbo), syllable synchronization, French/Spanish/Swahili translations, 11-platform distribution, self-healing auto-recovery, Google Search Schema.org JSON-LD.
8. **Dual-Mailbox Curator Dispatcher:** 1-click pitch dispatcher with verified curator CRM supporting:
   - Zoho Mail: `lj@ljentertainment.live` via `smtp.zoho.com:465` (SSL)
   - Gmail: `ljentertainmentmusic@gmail.com` via `smtp.gmail.com:465` (SSL)
9. **Universal Streaming Player Contract:** Studio preview player with explicit `currentTime = 0` playback reset so songs always play from the beginning; adapters for Spotify Web Playback SDK, Apple MusicKit JS, and YouTube IFrame.
10. **Mogul User Authentication & Workspace Lock:** Clean slate cache reset, persistent logout state, workspace locked banner, dedicated isolated Artist Portals to prevent cross-artist errors.

---

## 3. Directory Structure

```text
lj-music-os/
├── api/
│   └── index.js                      # Vercel Serverless Function entry point
├── data/
│   ├── artistRoster.json             # Roster data (Drey Star, Dr. Orlando Owoh, Kayla B, etc.)
│   ├── autonomousGeneratedPlaylists.json # Trending playlists with guaranteed slots
│   ├── catalogueData.json            # Authentic catalogue (KIRA, audio previews, ISRCs)
│   ├── listeningTelemetry.json       # Live streaming metrics, completion rates, momentum
│   ├── lyricsData.json               # Canonical lyrics, Yoruba oriki, line/word timestamps
│   ├── onlineRadioState.json         # 4 active web stations & heavy rotation schedules
│   └── sentEmails.json               # Curator pitches dispatch log (Zoho & Gmail)
├── engine/
│   ├── continuousLearningEngine.js   # Real-time SSE telemetry & live pulse generator
│   ├── lyricsIntelligenceEngine.js   # Division 17 lyrics transcription, sync & 11 DSPs
│   ├── mogulRoyaltyEngine.js         # Mogul royalty ledger, audit discrepancy engine & CSVs
│   ├── musicIntelligenceEngine.js    # Track scoring & acoustic analysis
│   ├── onlineRadioAgent.js           # Division 16 radio broadcast scheduler
│   ├── playlistTrendAgent.js         # Division 14 playlist placement & rebalance agent
│   └── councilDebateAgent.js         # 8-persona AI executive boardroom debate
├── public/
│   ├── app.js                        # Master frontend logic (Mogul auth, SSE, CRM, player)
│   ├── index.html                    # Single-page application UI (269 audited buttons)
│   ├── universal-player.js           # Universal streaming player router & reset contract
│   ├── spotify-player.js             # Spotify Web Playback SDK adapter
│   ├── apple-music-player.js         # Apple MusicKit JS adapter
│   └── youtube-player.js             # YouTube IFrame API adapter
├── scripts/
│   ├── qa-deep-audit.js              # Comprehensive 57-test automated audit suite
│   ├── test-client-auth-flow.js      # Auth & logout unit test suite
│   └── test-auth-lifecycle.js        # Server auth endpoint verification script
├── services/
│   └── emailService.js               # Dual-mailbox SMTP dispatcher (Zoho / Gmail)
├── .env                              # Live environment variables & API credentials
├── package.json                      # Dependencies & NPM scripts
├── server.js                         # Express backend API server
└── vercel.json                       # Vercel deployment & routing configuration
```

---

## 4. Key Environment Variables (`.env`)

```ini
PORT=3456
NODE_ENV=production

# Spotify Developer API Credentials (OAuth Verified)
SPOTIFY_CLIENT_ID=1bcfb326f0774491984ef6e0872ebbb1
SPOTIFY_CLIENT_SECRET=c586422f088d4b6a8039f5422ea062f8

# Supabase Cloud Database
SUPABASE_URL=https://raneitkthnzfilpifqck.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Dual-Mailbox Email Dispatcher
ZOHO_MAIL_USER=lj@ljentertainment.live
ZOHO_MAIL_PASS=...
GMAIL_USER=ljentertainmentmusic@gmail.com
GMAIL_PASS=...
```

---

## 5. Recent Fixes & Completed Work (Last Session)
- **Mogul Account Dropdown Actions:** Resolved all 5 actions in `#mogulUserDropdown` ("Switch Workspace", "Switch Role", "Postgres Settings", "Clear Cache", "Sign Out").
- **Persistent Logout State:** `activeMogulSession` defaults to `null` on server start, and `mogul_logged_out` flag prevents silent auto-relogins across browser refreshes.
- **Workspace Locked Indicator:** Added persistent `#workspaceLockedNoticeBar` with 1-click unlock button.
- **Clean Slate Cache Purge:** `clearWorkspaceCacheAndRestart()` wipes all local storage and re-initializes pristine locked login screen.
- **QA Verification:** Passed all **57/57 tests** in `scripts/qa-deep-audit.js` with **269 interactive buttons and 0 broken handlers**.
- **Git Push:** Pushed to GitHub `origin/main` (commit `e92666f`).

---

## 6. Recommended Next Steps for Qoder
1. Connect live production credentials for Zoho Mail and Gmail in `.env` if sending real external curator pitches beyond sandbox/simulated mode.
2. Ingest additional catalogue tracks or artist profiles via `/api/artist/resolve-link`.
3. Monitor live deployment status on Vercel at `https://lj-music-os.vercel.app`.
