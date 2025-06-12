import { GAME_DIFFICULTY_INFO, GAME_DIFFICULTIES } from '../constants';
import { renderBackgroundShadow } from '../utils/componentUtil';
import BoxBase from '../base/boxBase';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../render';

export default class DifficultySelectorBox extends BoxBase {
  constructor() {
    super(300, 400);
    this.itemHeight = 80;
    this.itemPadding = 20;
    this.headerHeight = 60;
    
    this.onDifficultySelect = null;
  }

  show() {
    super.show();
    var x = (SCREEN_WIDTH - this.width) / 2;
    var y = (SCREEN_HEIGHT - this.height) / 2;
    this.setPosition(x, y);
  }

  setOnDifficultySelect(callback) {
    this.onDifficultySelect = callback;
  }

  render(ctx) {
    if (!this.isVisible) return;
    renderBackgroundShadow(ctx);
    this.drawBoxBackground(ctx, '#ffffff', '#cccccc');
    this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);

    // 绘制标题
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('选择难度', this.x + this.width / 2, this.y + 35);

    this.drawCloseButton(ctx);

    // 设置裁剪区域用于滚动
    const contentX = this.x + 20;
    const contentY = this.y + this.headerHeight;
    const contentWidth = this.width - 40;
    const contentHeight = this.height - this.headerHeight - 20;

    // 绘制难度选项
    GAME_DIFFICULTIES.forEach((difficulty, index) => {
      const itemY = contentY + index * (this.itemHeight + this.itemPadding);
      
      // 只绘制可见的项目
      if (itemY + this.itemHeight > contentY && itemY < contentY + contentHeight) {
        this.renderDifficultyItem(ctx, difficulty, contentX, itemY, contentWidth);
      }
    });

    ctx.restore();
  }

  renderDifficultyItem(ctx, difficulty, x, y, width) {
    const difficulty_info = GAME_DIFFICULTY_INFO.get(difficulty);

    this.drawBoxBackground(ctx, '#f8f9fa', '#e9ecef');
    this.drawRoundedRect(ctx, x, y, width, this.itemHeight, 8);

    // 绘制难度名称
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(difficulty_info.name, x + 20, y + 25);

    // 绘制描述
    ctx.fillStyle = '#6c757d';
    ctx.font = '16px Arial';
    ctx.fillText(difficulty_info.description, x + 20, y + 50);
  }

  handleClick(x, y) {
    console.log("Handle click");
    if (!this.isVisible) return false;
    if (this.handleCloseButton(x, y)) return true;

    // 检查是否点击在弹窗外部
    if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) {
      console.log("Clicked outside dialog");
      this.hide();
      if (this.onClose) this.onClose();
      return true;
    }

    // 检查是否点击了难度选项
    const contentX = this.x + 20;
    const contentY = this.y + this.headerHeight;
    const contentWidth = this.width - 40;
    const contentHeight = this.height - this.headerHeight - 20;

    if (x >= contentX && x <= contentX + contentWidth && 
        y >= contentY && y <= contentY + contentHeight) {
      
      const relativeY = y - contentY;
      const itemIndex = Math.floor(relativeY / (this.itemHeight + this.itemPadding));
      
      if (itemIndex >= 0 && itemIndex < GAME_DIFFICULTIES.length) {
        const difficulty = GAME_DIFFICULTIES[itemIndex];
        if (this.onDifficultySelect) {
          this.onDifficultySelect(difficulty);
        }
        this.hide();
        return true;
      }
    }

    return true; // 消费事件，防止穿透
  }
}