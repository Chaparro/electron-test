const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { generateQRCode, readQRCode, clearQRCodes } = require('./qr');
const { insertQRCode, getQRCodes, clearQRCodes: clearDBQRCodes } = require('./db');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('generate-qr', async (event, text) => {
  const filename = `qr_${Date.now()}.png`;
  await generateQRCode(text, filename);
  const base64 = await readQRCode(filename);
  const id = await insertQRCode(base64);
  //console.log(base64);
  //console.log(id);
  return { id, base64 };
});

ipcMain.handle('get-qr-codes', async () => {
  return await getQRCodes();
});

ipcMain.handle('clear-backend', async () => {
  await clearQRCodes();
  await clearDBQRCodes();
});
