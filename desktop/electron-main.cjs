/**
 * FastenerTool Link V2 - Native Electron Main Process
 * 用於封裝打包為 Windows .exe / macOS .dmg / Linux .AppImage 的原生桌面程序
 */

const { app, BrowserWindow, Menu, Tray, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow = null;
let tray = null;
let serverProcess = null;

const PORT = process.env.PORT || 3000;
const URL = `http://127.0.0.1:${PORT}`;

function startLocalServer() {
  const serverPath = path.join(__dirname, '../dist/server.cjs');
  try {
    serverProcess = spawn('node', [serverPath], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: 'ignore'
    });
  } catch (err) {
    console.error('啟動本地伺服器失敗:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#020617',
    icon: path.join(__dirname, '../public/pwa-512x512.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    title: 'FastenerTool Link V2 - 工業桌面獨立模式',
    autoHideMenuBar: true
  });

  mainWindow.loadURL(URL).catch(() => {
    // 若伺服器還在冷啟動，1 秒後重試載入
    setTimeout(() => {
      mainWindow.loadURL(URL);
    }, 1500);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startLocalServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill();
});
