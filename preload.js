const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld('electronAPI', {
  generateQR: (text) => ipcRenderer.invoke('generate-qr', text),
  getQRCodes: () => ipcRenderer.invoke('get-qr-codes'),
  clearBackend: () => ipcRenderer.invoke('clear-backend')
});
