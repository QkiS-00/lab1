import { ShapeEditor } from './editor.js';
import { Toolbar } from './toolbar.js';

class EditorPage {
  constructor() {
    this.editor = new ShapeEditor(document.getElementById('canvas'));
    this.toolbar = new Toolbar(
      document.getElementById('toolbar'),
      (type) => window.editorApi.selectShape(type)
    );
    window.editorApi.onSetShape((type) => this.onNotify(type));
    this.onNotify('point');
  }

  onNotify(type) {
    this.editor.onNotify(type);
    this.toolbar.onNotify(type);
  }
}

new EditorPage();