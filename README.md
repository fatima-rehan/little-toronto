# Little Toronto.

An interactive guide to Toronto’s cultural neighbourhoods — built with **React**, **OpenStreetMap** and **Leaflet**, and an **AI guide** powered by **Google Gemini Flash** (free tier, no cost for normal use).

## What’s in the repo

- **React** (Vite) app with separate components and a single entry point
- **Leaflet** + **OpenStreetMap** for the map and neighbourhood markers
- **Gemini Flash** (free tier) for the in-app “AI Guide” — works for anyone visiting your site (with a local keyword fallback if no API key is set)

## Quick start

### 1. Install and run the app

```bash
npm install
npm run dev
```

Open the URL Vite prints (e.g. `http://localhost:5173`).

### 2. AI Guide with Gemini Flash (free tier)

The **AI Guide** uses [Google Gemini 1.5 Flash](https://ai.google.dev/) on the free tier so anyone can use it in the browser — no local installs.

1. Get a free API key: [Google AI Studio](https://aistudio.google.com/apikey)
2. Copy `.env.example` to `.env` and set your key:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
3. Restart `npm run dev`. Click **AI Guide** and ask for neighbourhood suggestions (e.g. “I want spicy food” or “Where’s good for a walk?”).

If no API key is set, the app still works and uses a simple local keyword-based fallback for recommendations.

## Project structure

```
Little-Toronto/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx             # App shell and phase (splash → loading → map)
│   ├── App.css              # Global styles
│   ├── data/
│   │   └── neighbourhoods.js   # Neighbourhood list (name, coords, flag, video, description)
│   └── components/
│       ├── CNTower.jsx     # Logo SVG
│       ├── Splash.jsx      # Landing screen
│       ├── LoadingScreen.jsx
│       ├── Map.jsx         # Leaflet + OpenStreetMap
│       ├── Drawer.jsx      # Neighbourhood list sidebar
│       ├── VideoPage.jsx   # Full-screen neighbourhood video
│       ├── AboutModal.jsx
│       └── AIChat.jsx      # Gemini Flash AI guide (+ local fallback)
```

## Build for production

```bash
npm run build
```

Output is in `dist/`. Preview with:

```bash
npm run preview
```

## Push to GitHub

Repo: [fatima-rehan/little-toronto](https://github.com/fatima-rehan/little-toronto)

```bash
git init
git add .
git commit -m "Initial commit: Little Toronto React + Leaflet + Ollama"
git branch -M main
git remote add origin https://github.com/fatima-rehan/little-toronto.git
git push -u origin main
```

## Tech

- **React 18** + **Vite**
- **Leaflet** + **react-leaflet** + **OpenStreetMap** tiles
- **Google Gemini 1.5 Flash** (free tier) for the AI guide; local keyword fallback if no API key
