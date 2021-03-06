'use strict';

import { app, protocol, BrowserWindow, ipcMain, session } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { autoUpdater } from 'electron-updater';
import path from 'path';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: false,
      webviewTag: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}
console.log('App starting...');

autoUpdater.on('update-available', (e) => {
  console.log('update-available');
  console.log('event:', e);
});
autoUpdater.on('download-progress', (e) => {
  console.log('download-progress');
  console.log('event', e);
});
autoUpdater.on('update-not-available', (e) => {
  console.log('update-not-available', e);
});
autoUpdater.on('update-downloaded', (e) => {
  console.log('update-downloaded');
  console.log('event:', e);
});
autoUpdater.checkForUpdatesAndNotify();

// disable CORS
// https://github.com/electron/electron/issues/23664
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipcMain.handle('get-dir', () => {
  console.log('fire get-dir');
  return __dirname;
});
ipcMain.handle(
  'get-cookies',
  async (ev, partition: string, url: string, name: string) => {
    console.log(`get-cookies: ${partition}, ${url}, ${name}`);
    return await session.fromPartition(partition).cookies.get({ url, name });
  }
);
ipcMain.handle(
  'set-cookie',
  async (ev, partition: string, url: string, name: string, value: string) => {
    console.log(`set-cookie: ${partition}, ${url}, ${name}, ${value}`);
    await session.fromPartition(partition).cookies.remove(url, name);
    await session.fromPartition(partition).cookies.set({ url, name, value });
  }
);
