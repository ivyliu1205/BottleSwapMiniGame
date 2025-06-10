import { BOTTLE_COLORS, BOTTLE_WIDTH, BOTTLE_HEIGHT } from '../constants';

export default class Bottle {
  isSelected = false;
  colorIndex = -1;

  constructor() {
    console.log("Bottle construct");
  }

  init(colorIndex, x, y) {
    this.colorIndex = colorIndex;
    this.x = x;
    this.y = y;
    this.clearState();
  }

  render(ctx) {
    ctx.save();
    if (this.isSelected) {
      this.renderBottleShadow(ctx);
    }
    this.renderBottleImage(ctx)
    ctx.restore();
  }

  renderClick(ctx) {
    this.isSelected = true;
    this.render(ctx);
  }

  clearState() {
    this.isSelected = false;
  }

  getColorIndex() {
    return this.colorIndex;
  }

  isPointInside(x, y) {
    return x >= this.x && 
            x <= this.x + BOTTLE_WIDTH &&
            y >= this.y && 
            y <= this.y + BOTTLE_HEIGHT
  }

  /**
   * Utils
   */
  renderBottleImage(ctx) {
    ctx.fillStyle = BOTTLE_COLORS[this.colorIndex].code;
    ctx.fillRect(this.x, this.y, BOTTLE_WIDTH, BOTTLE_HEIGHT);
  }

  renderBottleShadow(ctx) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }
}