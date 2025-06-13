import BoxBase from '../base/boxBase';
import { renderBackgroundShadow } from '../utils/componentUtil';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

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
    this.drawBoxBackground(ctx, '#E8464E', '#E8464E');
    this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);

    // 绘制错误文本
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const textX = this.x + this.width / 2;
    const textY = this.y + this.height / 2;
    
    ctx.fillText(this.message, textX, textY);

    // 恢复绘图状态
    ctx.restore();
  }

}