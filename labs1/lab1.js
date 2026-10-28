const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const module1 = require('./module1');
const module2 = require('./module2');

let win = null;

function setOutput(text) {
  win.webContents.send('set-output', String(text));
}

function createMainWindow() {
  const preload = path.join(__dirname, 'mainPreload.js');
  if (!fs.existsSync(preload)) {
    throw new Error('Не знайдено файл mainPreload.js поруч з lab1.js: ' + preload);
  }

  win = new BrowserWindow({
    width: 500,
    height: 300,
    title: 'Lab1',
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  const menu = Menu.buildFromTemplate([
    {
      label: 'Робота1',
      click: () => module1.show(win, (group) => setOutput('Робота1: обрана група ' + group))
    },
    {
      label: 'Робота2',
      click: () => module2.show(win, (text) => setOutput('Робота2: ' + text))
    }
  ]);
  Menu.setApplicationMenu(menu);

  win.loadFile('index.html');
}

app.whenReady().then(createMainWindow);
app.on('window-all-closed', () => app.quit());