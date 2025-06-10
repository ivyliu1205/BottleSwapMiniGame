import { renderBackgroundShadow } from '../utils/componentUtil';

export default class VictoryBox {
  constructor() {
    this.isVisible = false;
    this.swapCount = 0;
    this.correctCount = 0;
    this.width = 300;
    this.height = 200;
    this.posX = 0;
    this.posY = 0;
    this.buttonWidth = 100;
    this.buttonHeight = 40;
    this.buttonY = 0;
    this.onRestartCallback = null;
    this.onContinueCallback = null;
    this.onHideCallback = null; // 新增：隐藏后的回调
  }

  // 设置按钮回调
  setOnRestartCallback(callback) {
    this.onRestartCallback = callback;
  }

  setOnContinueCallback(callback) {
    this.onContinueCallback = callback;
  }

  // 新增：设置隐藏后的回调
  setOnHideCallback(callback) {
    this.onHideCallback = callback;
  }

  show(swapCount, correctCount, screenWidth, screenHeight) {
    this.isVisible = true;
    this.swapCount = swapCount;
    this.correctCount = correctCount;
    
    // 计算居中位置
    this.posX = (screenWidth - this.width) / 2;
    this.posY = (screenHeight - this.height) / 2;
    this.buttonY = this.posY + this.height - 60;
  }

  hide() {
    this.isVisible = false;
    if (this.onHideCallback) {
      this.onHideCallback();
    }
  }

  render(ctx) {
    if (!this.isVisible) return;

    ctx.save();

    renderBackgroundShadow(ctx);
    ctx.fillStyle = '#061A23';
    
    // 绘制圆角矩形背景
    this.drawRoundedRect(ctx, this.posX, this.posY, this.width, this.height, 12);
    ctx.fill();
    ctx.stroke();

    // 绘制胜利标题
    ctx.fillStyle = '#49B265';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const titleX = this.posX + this.width / 2;
    const titleY = this.posY + 40;
    ctx.fillText('恭喜通关', titleX, titleY);

    // 绘制统计信息
    ctx.fillStyle = '#F3F2F3';
    ctx.font = '18px Arial';
    
    ctx.fillText(`正确次数: ${this.correctCount}`, titleX, this.posY + this.height / 2);

    // 绘制按钮
    this.drawButton(ctx, '重新开始', this.posX + 50, this.buttonY, '#FF5722');
    this.drawButton(ctx, '继续游戏', this.posX + 150, this.buttonY, '#4CAF50');

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

  isPointInside(x, y) {
    return x >= this.posX && 
           x <= this.posX + this.width && 
           y >= this.posY && 
           y <= this.posY + this.height;
  }

  // 检查是否点击了重新开始按钮
  isRestartButtonClicked(x, y) {
    const buttonX = this.posX + 50;
    return x >= buttonX && 
           x <= buttonX + this.buttonWidth && 
           y >= this.buttonY && 
           y <= this.buttonY + this.buttonHeight;
  }

  // 检查是否点击了继续按钮
  isContinueButtonClicked(x, y) {
    const buttonX = this.posX + 150;
    return x >= buttonX && 
           x <= buttonX + this.buttonWidth && 
           y >= this.buttonY && 
           y <= this.buttonY + this.buttonHeight;
  }

  handleClick(x, y) {
    if (!this.isVisible) return false;

    if (this.isRestartButtonClicked(x, y)) {
      console.log("Restart button clicked");
      this.hide(); // 先隐藏
      if (this.onRestartCallback) {
        this.onRestartCallback();
      }
      return true;
    }

    if (this.isContinueButtonClicked(x, y)) {
      console.log("Continue button clicked");
      this.hide(); // 先隐藏
      if (this.onContinueCallback) {
        this.onContinueCallback();
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