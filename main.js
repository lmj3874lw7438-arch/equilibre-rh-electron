const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;

// Config: choose source of UI
// 1) Use a deployed frontend URL (recommended for prod): set FRONTEND_URL env var.
// 2) Or embed built frontend assets under app/dist/index.html (run npm run embed:prepare before build).
const FRONTEND_URL = process.env.FRONTEND_URL || (isDev ? 'http://localhost:5173' : '');
const EMBED_PATH = path.join(process.resourcesPath, 'app', 'dist', 'index.html'); // after packaging
const EMBED_DEV_PATH = path.join(__dirname, 'app', 'dist', 'index.html'); // before packaging

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false
    },
    show: false
  });

  win.once('ready-to-show', () => win.show());

  if (FRONTEND_URL) {
    win.loadURL(FRONTEND_URL);
  } else if (fs.existsSync(EMBED_PATH)) {
    win.loadFile(EMBED_PATH);
  } else if (fs.existsSync(EMBED_DEV_PATH)) {
    win.loadFile(EMBED_DEV_PATH);
  } else {
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <h1>Équilibre RH</h1>
      <p>Pas de FRONTEND_URL défini et aucun build embarqué trouvé.</p>
      <p>En dev: lancez le frontend Vite sur http://localhost:5173</p>
    `));
  }

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Simple menu
  const template = [
    { role: 'appMenu' },
    { role: 'fileMenu' },
    { role: 'viewMenu' }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
