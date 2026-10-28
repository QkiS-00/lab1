const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('editorApi', {
  onSetShape: (callback) => {
    ipcRenderer.on('set-shape', (_event, type) => callback(String(type)));
  }
});