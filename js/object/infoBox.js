import BoxBase from '../base/boxBase';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

export default class InfoBox extends BoxBase {
  constructor() {
    super(180, 150);

    this.cornerRadius = 8;
    this.padding = 12;
    this.lineHeight = 20;
    
    this.title = "游戏说明";
    this.content = [
      "• 点击两个瓶子进行交换",
      "• 直到找到瓶子正确位置",
      "• 正确个数展示在左上角",
      "• 使用重置按钮重新开始",
      "• 使用返回按钮撤销操作"
    ];
  }

  show(buttonX, buttonY, buttonSize) {
    console.log("Show info box");
    this.isVisible = true;
    
    this.x = buttonX - this.width / 2 + buttonSize / 2;
    this.y = buttonY + buttonSize + 15;
    
    if (this.x < 10) {
      this.x = 10;
    } else if (this.x + this.width > SCREEN_WIDTH - 10) {
      this.x = SCREEN_WIDTH - this.width - 10;
    }
  }

  render(ctx) {
    if (!this.isVisible) return;

    ctx.save();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // 绘制提示框阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    // 绘制主体框
    this.drawTooltipBox(ctx);
    
    ctx.restore();
    
    // 绘制文本内容
    this.drawContent(ctx);
  }

  drawTooltipBox(ctx) {
    this.renderBoxBackground(ctx, '#ffffff', '#e0e0e0');
    
    ctx.beginPath();
    ctx.moveTo(this.x + this.cornerRadius, this.y);
    ctx.lineTo(this.x + this.width - this.cornerRadius, this.y);
    ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.cornerRadius);
    ctx.lineTo(this.x + this.width, this.y + this.height - this.cornerRadius);
    ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.cornerRadius, this.y + this.height);
    ctx.lineTo(this.x + this.cornerRadius, this.y + this.height);
    ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.cornerRadius);
    ctx.lineTo(this.x, this.y + this.cornerRadius);
    ctx.quadraticCurveTo(this.x, this.y, this.x + this.cornerRadius, this.y);
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
  }

  drawContent(ctx) {
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    
    const titleY = this.y + this.padding + 16;
    ctx.fillText(this.title, this.x + this.padding, titleY);
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666666';
    
    this.content.forEach((line, index) => {
      const contentY = titleY + 24 + (index * this.lineHeight);
      ctx.fillText(line, this.x + this.padding, contentY);
    });
  }
}