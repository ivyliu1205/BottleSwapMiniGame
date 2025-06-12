import { renderBackgroundShadow } from '../utils/componentUtil';
import BoxBase from '../base/boxBase';

export default class VictoryBox extends BoxBase {
  constructor() {
    super(300, 240);
    this.swapCount = 0;
    this.correctCount = 0;

    this.buttonWidth = 100;
    this.buttonHeight = 40;
    this.buttonSpacing = 10; // 按钮间距
    this.buttonsStartY = 0;

    // Callback functions
    this.onNewGameCallback = null;
    this.onShareToFriendCallback = null;
    this.onShareToMomentsCallback = null;
  }

  // 设置按钮回调
  setOnNewGameCallback(callback) {
    this.onNewGameCallback = callback;
  }

  setOnShareToFriendCallback(callback) {
    this.onShareToFriendCallback = callback;
  }

  setOnShareToMomentsCallback(callback) {
    this.onShareToMomentsCallback = callback;
  }

  show(swapCount, correctCount, screenWidth, screenHeight) {
    this.isVisible = true;
    this.swapCount = swapCount;
    this.correctCount = correctCount;
    
    // 计算居中位置
    this.x = (screenWidth - this.width) / 2;
    this.y = (screenHeight - this.height) / 2;
    this.buttonsStartY = this.y + this.height - 80;
  }

  render(ctx) {
    if (!this.isVisible) return;

    ctx.save();

    renderBackgroundShadow(ctx);
    this.drawBoxBackground(ctx, '#061A23', '#061A23');
    this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 12);

    // 绘制胜利标题
    ctx.fillStyle = '#49B265';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const titleX = this.x + this.width / 2;
    const titleY = this.y + 40;
    ctx.fillText('恭喜通关', titleX, titleY);

    // 绘制统计信息
    ctx.fillStyle = '#F3F2F3';
    ctx.font = '18px Arial';
    
    ctx.fillText(`正确次数: ${this.correctCount}`, titleX, this.y + this.height / 2 - 20);

    // 绘制三个按钮
    const buttonY1 = this.buttonsStartY;
    const buttonY2 = this.buttonsStartY + this.buttonHeight + this.buttonSpacing;
    
    // 第一行：新游戏按钮（居中）
    const newGameX = this.x + (this.width - this.buttonWidth) / 2;
    this.drawButton(ctx, '新游戏', newGameX, buttonY1, '#4CAF50');

    // 第二行：发送给朋友 和 发到朋友圈（左右并排）
    const button2X = this.x + (this.width - this.buttonWidth * 2 - this.buttonSpacing) / 2;
    const button3X = button2X + this.buttonWidth + this.buttonSpacing;
    
    this.drawButton(ctx, '发送给朋友', button2X, buttonY2, '#FF9800');
    this.drawButton(ctx, '发到朋友圈', button3X, buttonY2, '#2196F3');

    ctx.restore();
  }

  drawButton(ctx, text, x, y, color) {
    // 绘制按钮背景
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    this.drawRoundedRect(ctx, x, y, this.buttonWidth, this.buttonHeight, 6);
    ctx.fill();

    // 绘制按钮文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const textX = x + this.buttonWidth / 2;
    const textY = y + this.buttonHeight / 2;
    ctx.fillText(text, textX, textY);
  }

  // 检查是否点击了新游戏按钮
  isNewGameButtonClicked(x, y) {
    const buttonX = this.x + (this.width - this.buttonWidth) / 2;
    const buttonY = this.buttonsStartY;
    return x >= buttonX && 
           x <= buttonX + this.buttonWidth && 
           y >= buttonY && 
           y <= buttonY + this.buttonHeight;
  }

  // 检查是否点击了发送给朋友按钮
  isShareToFriendButtonClicked(x, y) {
    const buttonX = this.x + (this.width - this.buttonWidth * 2 - this.buttonSpacing) / 2;
    const buttonY = this.buttonsStartY + this.buttonHeight + this.buttonSpacing;
    return x >= buttonX && 
           x <= buttonX + this.buttonWidth && 
           y >= buttonY && 
           y <= buttonY + this.buttonHeight;
  }

  // 检查是否点击了发到朋友圈按钮
  isShareToMomentsButtonClicked(x, y) {
    const button2X = this.x + (this.width - this.buttonWidth * 2 - this.buttonSpacing) / 2;
    const buttonX = button2X + this.buttonWidth + this.buttonSpacing;
    const buttonY = this.buttonsStartY + this.buttonHeight + this.buttonSpacing;
    return x >= buttonX && 
           x <= buttonX + this.buttonWidth && 
           y >= buttonY && 
           y <= buttonY + this.buttonHeight;
  }

  handleClick(x, y) {
    super.handleClick(x, y);

    if (this.isNewGameButtonClicked(x, y)) {
      console.log("New game button clicked");
      this.hide();
      if (this.onNewGameCallback) {
        this.onNewGameCallback();
      }
      return true;
    }

    if (this.isShareToFriendButtonClicked(x, y)) {
      console.log("Share to friend button clicked");
      this.hide();
      if (this.onShareToFriendCallback) {
        this.onShareToFriendCallback();
      }
      return true;
    }

    if (this.isShareToMomentsButtonClicked(x, y)) {
      console.log("Share to moments button clicked");
      this.hide();
      if (this.onShareToMomentsCallback) {
        this.onShareToMomentsCallback();
      }
      return true;
    }

    // 如果点击在对话框内但不在按钮上，不做任何操作
    if (this.isPointInside(x, y)) {
      return true; // 阻止事件传播
    }
    return false;
  }
}
