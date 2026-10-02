/**
 * FastenerTool Link V2 - Industrial Desktop Standalone Runner
 * 工業級模具與螺絲工廠本地可執行檔模式啟動器
 *
 * 支援功能：
 * 1. 本地 Node 離線邊緣伺服器自動啟動 (Localhost Edge Server)
 * 2. 自動偵測本機 Chrome / Edge / Brave / Safari / Firefox
 * 3. 以 --app 獨立無邊框桌面應用程式視窗啟動 (Native Window App Mode)
 * 4. 斷網完全離線執行 (Local Offline First)
 */

const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';
const APP_URL = `http://${HOST}:${PORT}`;

console.log('====================================================');
console.log('  FastenerTool Link V2 - 工業獨立執行檔桌面系統');
console.log('  岡山螺絲廠 ⟷ 本洲模具園區 現場邊緣端部署啟動中');
console.log('====================================================');

// 檢查伺服器是否已在運行
function checkServer(callback) {
  const req = http.get(APP_URL, (res) => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
  req.setTimeout(800, () => {
    req.destroy();
    callback(false);
  });
}

// 啟動內建伺服器程序
function startServer(onReady) {
  console.log('[1/2] 啟動本地獨立伺服器端程序...');
  
  const serverPath = path.resolve(__dirname, '../dist/server.cjs');
  const tsxServer = path.resolve(__dirname, '../server.ts');
  
  let srv;
  if (fs.existsSync(serverPath)) {
    srv = spawn('node', [serverPath], { stdio: 'inherit', env: { ...process.env, PORT } });
  } else {
    srv = spawn('npx', ['tsx', tsxServer], { stdio: 'inherit', env: { ...process.env, PORT } });
  }

  srv.on('error', (err) => {
    console.error('伺服器啟動失敗:', err.message);
  });

  // 輪詢等待伺服器準備完畢
  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    checkServer((ready) => {
      if (ready) {
        clearInterval(timer);
        console.log(`[OK] 本地伺服器已就緒: ${APP_URL}`);
        onReady();
      } else if (attempts > 30) {
        clearInterval(timer);
        console.log('[Warn] 伺服器啟動耗時較久，直接嘗試喚醒桌面視窗...');
        onReady();
      }
    });
  }, 500);
}

// 以獨立桌面視窗模式開啟（無網址列、工業全功能視窗）
function launchDesktopWindow() {
  console.log('[2/2] 喚醒電腦獨立桌面視窗 (Standalone App Window)...');

  const platform = process.platform;
  let command = '';

  if (platform === 'win32') {
    // Windows: 優先使用 Edge 或 Chrome 的 --app 模式
    command = `start msedge --app="${APP_URL}" || start chrome --app="${APP_URL}" || start ${APP_URL}`;
  } else if (platform === 'darwin') {
    // macOS: 優先使用 Chrome --app 模式
    command = `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --app="${APP_URL}" || open "${APP_URL}"`;
  } else {
    // Linux
    command = `google-chrome --app="${APP_URL}" || chromium --app="${APP_URL}" || xdg-open "${APP_URL}"`;
  }

  exec(command, (err) => {
    if (err) {
      console.log('無法以原生獨立模式喚醒，改由預設系統瀏覽器開啟:', err.message);
      if (platform === 'win32') exec(`start ${APP_URL}`);
      else if (platform === 'darwin') exec(`open ${APP_URL}`);
      else exec(`xdg-open ${APP_URL}`);
    } else {
      console.log('★ 電腦可執行檔獨立視窗已順利建立！');
    }
  });
}

// 主程序執行
checkServer((alreadyRunning) => {
  if (alreadyRunning) {
    console.log(`本地已檢測到運作中之 FastenerTool Link 執行個體 (${APP_URL})`);
    launchDesktopWindow();
  } else {
    startServer(() => {
      launchDesktopWindow();
    });
  }
});
