import BoxBase from '../../base/boxBase';
import { renderBackgroundShadow, renderRoundedRect, setFont } from '../../utils/componentUtil';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../render';

export default class ErrorBox extends BoxBase {
  constructor() {
    super(270, 80);
    this.message = '';
  }

  show(message) {
    super.show();
    const x = (SCREEN_WIDTH - this.width) / 2;
    const y = (SCREEN_HEIGHT - this.height) / 2;
    this.setPosition(x, y);
    this.message = message;
  }

  handleClick(x, y) {
    if (!this.isVisible) return false;
    this.hide();
    return true;
  }

  render(ctx) {
    if (!this.isVisible) return;
    ctx.save();
    renderBackgroundShadow(ctx);
    this.drawBoxBackground(ctx, '#D0637C', '#D0637C');
    renderRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);
    this.drawContents(ctx);
    ctx.restore();
  }

  /**
   * Draw
   */
  drawContents(ctx) {
    setFont(ctx, 20, '#ffffff', true);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const textX = this.x + this.width / 2;
    const textY = this.y + this.height / 2;
    ctx.fillText(this.message, textX, textY);
  }
}
