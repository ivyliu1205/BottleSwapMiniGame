import { BOTTLE_COLORS, BOTTLE_WIDTH, BOTTLE_HEIGHT } from '../constants';

export default class Bottle {
  isSelected = false;

  constructor(colorIndex) {
    this.colorIndex = colorIndex;
  }

  init(x, y) {
    this.x = x;
    this.y = y;
    this.clearState();
  }

  render(ctx) {
    if (this.isSelected) {
      ctx.save();
      this.renderBottleShadow(ctx);
      this.renderBottleImage(ctx)
      ctx.restore();
    } else {
      this.renderBottleImage(ctx)
    }
  }

  renderClick(ctx) {
    this.isSelected = true;
    this.render(ctx);
  }

  clearState() {
    this.isSelected = false;
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