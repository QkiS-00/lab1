const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_NAME = 'Lab2';
let win = null;

const SHAPES = [
  { id: 'point', label: 'Крапка' },
  { id: 'line', label: 'Лінія' },
  { id: 'rect', label: 'Прямокутник' },
  { id: 'ellipse', label: 'Еліпс' }
];

function selectShape(shape) {
  win.setTitle(APP_NAME + ' — ' + shape.label);
  win.webContents.send('set-shape', shape.id);
}

function createMenu() {
  const template = [
    {
      label: 'Файл',
      submenu: [{ label: 'Вийти', role: 'quit' }]
    },
    {
      label: 'Об’єкти',
      submenu: SHAPES.map((shape, i) => ({
        label: shape.label,
        type: 'radio',
        checked: i === 0,
        click: () => selectShape(shape)
      }))
    },
    {
      label: 'Довідка',
      submenu: [{
        label: 'Про програму',
        click: () => dialog.showMessageBox(win, {
          type: 'info',
          title: 'Про програму',
          message: 'Lab2 — графічний редактор об’єктів',
          detail: 'Оберіть тип об’єкта в меню «Об’єкти» та малюйте мишею.'
        })
      }]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  const preload = path.join(__dirname, 'editorPreload.js');
  if (!fs.existsSync(preload)) {
    throw new Error('Не знайдено файл editorPreload.js поруч з lab2.js: ' + preload);
  }

  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: APP_NAME + ' — ' + SHAPES[0].label,
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event) => event.preventDefault());
  win.on('page-title-updated', (event) => event.preventDefault());

  createMenu();
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());