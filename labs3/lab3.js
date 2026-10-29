const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_NAME = 'Lab3';

const SHAPES = [
  { id: 'point', label: 'Крапка' },
  { id: 'line', label: 'Лінія' },
  { id: 'rect', label: 'Прямокутник' },
  { id: 'ellipse', label: 'Еліпс' }
];

class EditorApp {
  constructor() {
    this.win = null;
    this.current = SHAPES[0].id; 
    this.shapeItems = [];      
  }

  start() {
    app.whenReady().then(() => this.createWindow());
    app.on('window-all-closed', () => app.quit());
  }

  createWindow() {
    const preload = path.join(__dirname, 'editorPreload.js');
    if (!fs.existsSync(preload)) {
      throw new Error('Не знайдено файл editorPreload.js поруч з lab3.js: ' + preload);
    }

    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      title: APP_NAME,
      webPreferences: {
        preload,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });
    this.win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    this.win.webContents.on('will-navigate', (event) => event.preventDefault());

    ipcMain.on('toolbar:select', (event, id) => this.onToolbarSelect(event, id));
    this.win.webContents.once('did-finish-load', () => this.notifyPage());

    this.createMenu();
    this.win.loadFile('index.html');
  }

  createMenu() {
    const template = [
      {
        label: 'Файл',
        submenu: [{ label: 'Вийти', role: 'quit' }]
      },
      {
        label: 'Об’єкти',
        submenu: SHAPES.map((shape) => ({
          id: shape.id,
          label: shape.label,
          type: 'radio',
          checked: shape.id === this.current,
          click: () => this.onMenuSelect(shape.id)
        }))
      },
      {
        label: 'Довідка',
        submenu: [{ label: 'Про програму', click: () => this.onAbout() }]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    const objectsMenu = menu.items[1].submenu;
    this.shapeItems = objectsMenu.items;
    objectsMenu.on('menu-will-show', () => this.onInitMenuPopup());
    Menu.setApplicationMenu(menu);
  }

  onMenuSelect(id) {
    this.selectShape(id);
  }

  onToolbarSelect(event, id) {
    if (!this.win || event.sender !== this.win.webContents) return;
    this.selectShape(id);
  }

  onAbout() {
    dialog.showMessageBox(this.win, {
      type: 'info',
      title: 'Про програму',
      message: 'Lab3 — графічний редактор об’єктів',
      detail: 'Оберіть тип об’єкта в меню «Об’єкти» або на панелі інструментів і малюйте мишею.'
    });
  }

  onInitMenuPopup() {
    const item = this.shapeItems.find((i) => i.id === this.current);
    if (item) item.checked = true;
  }

  selectShape(id) {
    if (!SHAPES.some((shape) => shape.id === id)) return;
    this.current = id;
    this.onInitMenuPopup();
    this.notifyPage();
  }

  notifyPage() {
    if (this.win && !this.win.isDestroyed()) {
      this.win.webContents.send('set-shape', this.current);
    }
  }
}

new EditorApp().start();