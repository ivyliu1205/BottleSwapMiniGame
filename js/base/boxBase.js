
export default class BoxBase {
  constructor(width, height) {
    this.isVisible = false;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
  }

  hide() {
    this.isVisible = false;
  }

  renderBoxBackground(ctx, fillColor, strokeColor) {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
  }

  isPointInside(x, y) {
    return this.isVisible && 
           x >= this.x && 
           x <= this.x + this.width && 
           y >= this.y && 
           y <= this.y + this.height;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }
} 
