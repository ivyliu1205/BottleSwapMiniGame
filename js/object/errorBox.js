import BoxBase from '../base/boxBase';
import { renderBackgroundShadow } from '../utils/componentUtil';

export default class ErrorBox extends BoxBase {
  constructor() {
    super(200, 80);
    this.message = '';
  }

  show(message, x, y) {
    super.show();
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

    // 保存当前绘图状态
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