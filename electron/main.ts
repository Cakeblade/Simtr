// Built-in Node Modules
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Built-in Electron Modules
import { app, BrowserWindow, ipcMain } from 'electron'

// Local Modules
import { createServer } from './server'
import { getAppConfig } from './config'
import logger from './logger'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const appConfig = getAppConfig()
process.env.VITE_PUBLIC = appConfig.paths.publicDir

let mainWindow: BrowserWindow | null = null

// Handle logging settings from renderer
ipcMain.handle('update-logging-settings', (event, enableLogging: boolean) => {
  logger.enableFileLogging(enableLogging);
  logger.info('Logging settings updated', { enableLogging });
  return true;
});

// Handle request for log file path
ipcMain.handle('get-log-file-path', () => {
  return logger.getLogFilePath();
});

function createWindow(): void {
  createServer();
  
  mainWindow = new BrowserWindow({
    icon: path.join(appConfig.paths.publicDir, 'electron-vite.svg'),
    width: appConfig.window.width,
    height: appConfig.window.height,
    minWidth: appConfig.window.minWidth,
    minHeight: appConfig.window.minHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Test active push message to Renderer-process.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    mainWindow.loadFile(path.join(appConfig.paths.rendererDist, 'index.html'))
  }
  
  logger.info('Application window created');
}

// Function to handle app shutdown and save logs
function handleAppShutdown(): void {
  logger.info('Application shutting down');
  logger.saveLogsToFile();
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    handleAppShutdown();
    app.quit()
    mainWindow = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Handle app before quit to save logs
app.on('before-quit', (event) => {
  handleAppShutdown();
});

// Handle various exit scenarios
process.on('exit', () => {
  handleAppShutdown();
});

process.on('SIGINT', () => {
  handleAppShutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  handleAppShutdown();
  process.exit(0);
});

app.whenReady().then(() => {
  createWindow();
  logger.info('Application started');
});
