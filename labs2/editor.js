import { PointShape, LineShape, RectShape, EllipseShape } from './shapes.js';

const N = 123;

const FACTORY = {
  point: () => new PointShape(),
  line: () => new LineShape(),
  rect: () => new RectShape(),
  ellipse: () => new EllipseShape()
};

class ShapeEditor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.pcshape = new Array(N).fill(null);  
    this.count = 0;                       

    this.currentType = 'point';            
    this.rubber = null;                   

    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('resize', () => this.resize());
    window.editorApi.onSetShape((type) => {
      if (Object.hasOwn(FACTORY, type)) this.currentType = type;
    });

    this.resize();
  }

  pos(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  onMouseDown(e) {
    if (e.button !== 0) return;
    const p = this.pos(e);
    this.rubber = FACTORY[this.currentType](); 
    this.rubber.set(p.x, p.y, p.x, p.y);
    this.repaint();
  }

  onMouseMove(e) {
    if (!this.rubber) return;
    const p = this.pos(e);
    this.rubber.set(this.rubber.x1, this.rubber.y1, p.x, p.y);
    this.repaint();
  }

  onMouseUp(e) {
    if (!this.rubber) return;
    const p = this.pos(e);
    this.rubber.set(this.rubber.x1, this.rubber.y1, p.x, p.y);
    if (this.count < N) {
      this.pcshape[this.count++] = this.rubber; 
    }
    this.rubber = null;
    this.repaint();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.repaint();
  }

  repaint() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.count; i++) {
      this.pcshape[i].show(this.ctx);       
    }
    if (this.rubber) {
      this.rubber.showRubber(this.ctx);
    }
  }
}

new ShapeEditor(document.getElementById('canvas'));