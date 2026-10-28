const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const PRELOAD = path.join(__dirname, 'dialogPreload.js');

let currentDialog = null;  
const dialogs = new Map();   

ipcMain.on('dialog:action', (event, action, values) => {
  const dialog = dialogs.get(event.sender.id);
  if (!dialog || typeof action !== 'string') return;

  const handler = Object.hasOwn(dialog.actions, action) ? dialog.actions[action] : null;
  if (typeof handler !== 'function') return;

  const clean = {};
  if (values && typeof values === 'object') {
    for (const [key, value] of Object.entries(values)) {
      if (typeof value === 'string') clean[key] = value;
    }
  }
  handler(clean, dialog.control);
});

function closeCurrentDialog() {
  if (currentDialog && !currentDialog.isDestroyed()) {
    currentDialog.close();
  }
  currentDialog = null;
}

function openDialog({ parent, title, width, height, markup, fill, actions }) {
  if (!fs.existsSync(PRELOAD)) {
    throw new Error('Не знайдено файл dialogPreload.js поруч з utils.js: ' + PRELOAD);
  }
  closeCurrentDialog();

  const win = new BrowserWindow({
    parent,
    modal: true,
    width,
    height,
    title,
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.setMenu(null);
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event) => event.preventDefault());

  const id = win.webContents.id;
  dialogs.set(id, {
    actions,
    control: { close: () => { if (!win.isDestroyed()) win.close(); } }
  });

  win.on('closed', () => {
    dialogs.delete(id);
    if (currentDialog === win) currentDialog = null;
  });

  win.webContents.once('did-finish-load', () => {
    if (!win.isDestroyed()) win.webContents.send('dialog:init', fill || {});
  });
  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(markup));

  currentDialog = win;
  return win;
}

module.exports = { openDialog, closeCurrentDialog };