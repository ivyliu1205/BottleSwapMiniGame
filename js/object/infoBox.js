import BoxBase from '../base/boxBase';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import { renderBackgroundShadow } from '../utils/componentUtil';

export default class InfoBox extends BoxBase {
  constructor() {
    super(270, 330, true);

    this.padding = 30;
    this.lineHeight = 35;
    this.headerHeight = 60;
    
    this.title = "游戏说明";
    this.content = [
      "• 点击两个瓶子进行交换",
      "• 直到找到瓶子正确位置",
      "• 正确个数展示在左上角",
      "• 使用重置按钮重新开始",
      "• 使用返回按钮撤销操作",
      "• 使用更多按钮修改难度"
    ];
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
    this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);
    this.drawCloseButton(ctx);

    this.drawContent(ctx);
    ctx.restore();
  }

  /**
   * Handler
   */
  handleClick(x, y) {
    console.log("Handle info click");
    if (!this.isVisible) return false;
    if (this.handleCloseButton(x, y)) {
      console.log("Handle info click handleCloseButton");
      return true;
    }
    return false;
  }

  /**
   * Draw
   */
  drawContent(ctx) {
    console.log("Render drawContent");
    
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.title, this.x + this.width / 2, this.y + this.headerHeight);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#6c757d';
    ctx.textAlign = 'left';
    
    this.content.forEach((line, index) => {
      const contentY = this.y + this.headerHeight + 50 + (index * this.lineHeight);
      ctx.fillText(line, this.x + this.padding, contentY);
    });
  }
}
