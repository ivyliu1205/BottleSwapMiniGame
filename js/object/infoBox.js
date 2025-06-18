import BoxBase from '../base/boxBase';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import { renderBackgroundShadow, renderRoundedRect, setFont } from '../utils/componentUtil';
import { GAME_INSTRUCTION } from '../constants';

export default class InfoBox extends BoxBase {
  constructor() {
    super(270, 330, true);

    this.padding = 30;
    this.lineHeight = 35;
    this.headerHeight = 60;
    
    this.title = "游戏说明";
    this.content = GAME_INSTRUCTION;
  }

  show() {
    super.show();
    const x = (SCREEN_WIDTH - this.width) / 2;
    const y = (SCREEN_HEIGHT - this.height) / 2;
    this.setPosition(x, y);
  }

  render(ctx) {
    if (!this.isVisible) return;

    ctx.save();
    renderBackgroundShadow(ctx);
    this.drawBoxBackground(ctx, '#ffffff', '#cccccc');
    renderRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);
    this.drawCloseButton(ctx);

    this.drawContent(ctx);
    ctx.restore();
  }

  /**
   * Handler
   */
  handleClick(x, y) {
    if (!this.isVisible) return false;
    if (this.handleCloseButton(x, y)) return true;
    return false;
  }

  /**
   * Draw
   */
  drawContent(ctx) {
    setFont(ctx, 24, '#333333', true);
    ctx.textAlign = 'center';
    ctx.fillText(this.title, this.x + this.width / 2, this.y + this.headerHeight);
    
    setFont(ctx, 20, '#6c757d');
    ctx.textAlign = 'left';
    this.content.forEach((line, index) => {
      const contentY = this.y + this.headerHeight + 50 + (index * this.lineHeight);
      ctx.fillText(line, this.x + this.padding, contentY);
    });
  }
}
