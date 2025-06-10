import BoxBase from '../base/boxBase';
import { renderBackgroundShadow } from '../utils/componentUtil';

export default class ErrorBox extends BoxBase {
  constructor() {
    super(200, 80);
    this.message = '';
  }

  show(message, x, y, width = 200) {
    this.isVisible = true;
    this.message = message;
    this.x = x;
    this.y = y;
    this.width = width;
  }

  render(ctx) {
    if (!this.isVisible) return;

    // 保存当前绘图状态
    ctx.save();

    renderBackgroundShadow(ctx);
    this.renderBoxBackground(ctx, '#E8464E', '#E8464E');
    
    // 绘制圆角矩形背景
    this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);
    ctx.fill();
    ctx.stroke();

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

  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}