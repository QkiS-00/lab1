export class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new TypeError('Shape — абстрактний клас, створіть його нащадка');
    }
    this.x1 = 0; this.y1 = 0;
    this.x2 = 0; this.y2 = 0;
  }

  set(x1, y1, x2, y2) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
  }

  path(ctx) {
    throw new Error('Метод path() не реалізовано');
  }
  show(ctx) {
    throw new Error('Метод show() не реалізовано');
  }

  showRubber(ctx) {
    ctx.save();
    ctx.setLineDash([]);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.path(ctx);
    ctx.stroke();
    ctx.restore();
  }
}

export class PointShape extends Shape {
  path(ctx) {
    ctx.arc(this.x1, this.y1, 2, 0, Math.PI * 2);
  }
  show(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    this.path(ctx);
    ctx.fill();
    ctx.restore();
  }
  showRubber(ctx) {}
}

export class LineShape extends Shape {
  path(ctx) {
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
  }
  show(ctx) {
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.path(ctx);
    ctx.stroke();
    ctx.restore();
  }
}

export class RectShape extends Shape {
  set(x1, y1, x2, y2) {
    super.set(x1, y1, x2, y2);
    this.left = Math.min(x1, x2);
    this.top = Math.min(y1, y2);
    this.width = Math.abs(x2 - x1);
    this.height = Math.abs(y2 - y1);
  }
  path(ctx) {
    ctx.rect(this.left, this.top, this.width, this.height);
  }
  show(ctx) {
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.path(ctx);
    ctx.stroke();
    ctx.restore();
  }
}

export class EllipseShape extends Shape {
  set(x1, y1, x2, y2) {
    super.set(x1, y1, x2, y2);
    this.cx = x1;
    this.cy = y1;
    this.rx = Math.abs(x2 - x1);
    this.ry = Math.abs(y2 - y1);
  }
  path(ctx) {
    ctx.ellipse(this.cx, this.cy, this.rx, this.ry, 0, 0, Math.PI * 2);
  }
  show(ctx) {
    ctx.save();
    ctx.fillStyle = 'gray';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.path(ctx);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}