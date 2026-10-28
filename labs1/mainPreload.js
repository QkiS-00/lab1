const { ipcRenderer } = require('electron');

ipcRenderer.on('set-output', (_event, text) => {
  const output = document.getElementById('output');
  if (output) {
    output.textContent = String(text);
  }
});