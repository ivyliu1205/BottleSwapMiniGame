import BoxBase from '../../base/boxBase';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../render';
import { drawBoxHeader, renderBackgroundShadow, renderRoundedRect, setFont } from '../../utils/componentUtil';
import { BOX_TYPE, GAME_INSTRUCTION, LARGE_BOX_HEADER_HEIGHT, LARGE_BOX_HEIGHT, LARGE_BOX_WIDTH } from '../../constants';

export default class InfoBox extends BoxBase {
  constructor() {
    super(BOX_TYPE.LARGE, LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, true);

    this.padding = 30;
    this.lineHeight = 35;
    this.headerHeight = LARGE_BOX_HEADER_HEIGHT;
    
    this.title = "游戏说明";
    this.content = GAME_INSTRUCTION;
  }

  render(ctx) {
    if (!this.isVisible) return;
    super.render(ctx);
    drawBoxHeader(ctx, this.title, this.x, this.y, this.width);
    this.drawContent(ctx);
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
    setFont(ctx, 20, '#6c757d');
    ctx.textAlign = 'left';
    this.content.forEach((line, index) => {
      const contentY = this.y + this.headerHeight + 50 + (index * this.lineHeight);
      ctx.fillText(line, this.x + this.padding, contentY);
    });
  }
}
