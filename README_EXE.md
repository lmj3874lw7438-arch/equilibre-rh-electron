# Équilibre RH — Pack EXE (Electron)

Ce projet génère un **.exe Windows** pour utiliser Équilibre RH comme une application de bureau.

## Deux façons d’alimenter l’UI

### A) Utiliser le frontend déployé (le plus simple)
1. Déploie ton **backend** (Render) et **frontend** (Vercel) comme expliqué dans le pack de déploiement cloud.
2. Dans PowerShell (Windows) :
   ```powershell
   setx FRONTEND_URL "https://TON-FRONT-VERCEL-URL"
   npm install
   npm run dist
   ```
3. Récupère le fichier dans `dist/` → **Equilibre-RH-Setup-1.0.0.exe**

### B) Embarquer les fichiers du frontend (offline UI)
1. Build le frontend Vite de ton projet principal (répertoire `frontend/`) :
   ```bash
   cd frontend
   pnpm install
   pnpm build
   ```
   Cela crée un dossier `frontend/dist`.

2. Copie ce dossier dans ce pack (ce projet Electron) sous `frontend-dist/`, puis :
   ```bash
   npm install
   npm run embed:prepare   # copie dans app/dist
   npm run dist            # génère l'installateur .exe
   ```

## Développement (chargement du frontend en local)
- Lance le frontend Vite du projet principal : `pnpm dev` → http://localhost:5173
- Dans ce dossier Electron :
  ```bash
  npm install
  npm run dev
  ```
  L’app charge `http://localhost:5173` par défaut en dev.

## Variables
- `FRONTEND_URL` : (optionnel) URL du frontend déployé (Vercel). Si non défini, l’app tentera de charger l’UI embarquée sous `app/dist/index.html`.

## Remarques
- Cette app **n’embarque pas le backend** : tu peux utiliser un backend cloud (Render) ou ton backend local (`http://localhost:4000`).
- Sur le frontend, assure-toi que `VITE_API_URL` pointe vers ton backend (cloud ou local).

Bon build ! 🚀
