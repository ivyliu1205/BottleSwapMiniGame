import ComponentBase from '../base/componentBase';
import { BOTTLE_COLORS, BOTTLE_WIDTH, BOTTLE_HEIGHT } from '../constants';

export default class Bottle extends ComponentBase {

  constructor() {
    super(true, BOTTLE_WIDTH, BOTTLE_HEIGHT);
    this.isSelected = false;
    this.colorIndex = -1;
  }

  init(colorIndex, x, y) {
    this.colorIndex = colorIndex;
    this.setPosition(x, y);
    this.clearState();
  }

  render(ctx) {
    ctx.save();
    if (this.isSelected) {
      this.drawBottleShadow(ctx);
    }
    this.drawBottleShape(ctx);
    ctx.restore();
  }

  renderClick(ctx) {
    this.isSelected = true;
    this.render(ctx);
  }

  clearState() {
    this.isSelected = false;
  }


  /**
   * Draw
   */
  drawBottleShape(ctx) {
    const bottleColor = BOTTLE_COLORS[this.colorIndex].code;
    const x = this.x;
    const y = this.y;
    const width = this.width;
    const height = this.height;
    
    const neckWidth = width * 0.35;
    const neckHeight = height * 0.3;
    const bodyWidth = width * 0.8;
    const bodyHeight = height * 0.7;
    const capHeight = height * 0.1;
    
    const neckX = x + (width - neckWidth) / 2;
    const bodyX = x + (width - bodyWidth) / 2;
    const capX = neckX - 2;
    
    ctx.fillStyle = bottleColor;
    ctx.fillRect(bodyX, y + neckHeight, bodyWidth, bodyHeight);
    ctx.fillRect(neckX, y + capHeight, neckWidth, neckHeight - capHeight);

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(capX, y, neckWidth + 4, capHeight);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(bodyX, y + neckHeight, bodyWidth * 0.2, bodyHeight);
    ctx.fillRect(neckX, y + capHeight, neckWidth * 0.3, neckHeight - capHeight);
  }

  drawBottleShadow(ctx) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }

  /**
   * Utils
   */

   /**
    * Getters & Setters
    */
   getColorIndex() {
    return this.colorIndex;
  }
}