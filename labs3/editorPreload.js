const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('editorApi', {
  onSetShape: (callback) => {
    ipcRenderer.on('set-shape', (_event, type) => callback(String(type)));
  },
  selectShape: (type) => {
    ipcRenderer.send('toolbar:select', String(type));
  }
});