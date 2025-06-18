import { GAME_DIFFICULTY_INFO, GAME_DIFFICULTIES } from '../constants';
import { renderBackgroundShadow, renderRoundedRect, setFont } from '../utils/componentUtil';
import BoxBase from '../base/boxBase';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../render';

export default class DifficultySelectorBox extends BoxBase {
  constructor() {
    super(300, 370, true);
    this.itemHeight = 80;
    this.itemPadding = 20;
    this.headerHeight = 60;

    // Callback functions
    this.onDifficultySelect = null;
  }

  /**
   * Callback functions
   */
  setOnDifficultySelect(callback) {
    this.onDifficultySelect = callback;
  }

  /**
   * Events
   */
  show() {
    super.show();
    var x = (SCREEN_WIDTH - this.width) / 2;
    var y = (SCREEN_HEIGHT - this.height) / 2;
    this.setPosition(x, y);
  }

  /**
   * Handler
   */
  handleClick(x, y) {
    if (!this.isVisible) return false;
    if (this.handleCloseButton(x, y)) return true;

    if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) {
      this.hide();
      if (this.onClose) this.onClose();
      return true;
    }

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
    return true;
  }

  /**
   * Draw
   */
  render(ctx) {
    if (!this.isVisible) return;
    renderBackgroundShadow(ctx);
    this.drawBoxBackground(ctx, '#ffffff', '#cccccc');
    renderRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);

    setFont(ctx, 24, '#333333', true);
    ctx.textAlign = 'center';
    ctx.fillText('选择难度', this.x + this.width / 2, this.y + 35);

    this.drawCloseButton(ctx);

    const contentX = this.x + 20;
    const contentY = this.y + this.headerHeight;
    const contentWidth = this.width - 40;
    const contentHeight = this.height - this.headerHeight - 20;
    GAME_DIFFICULTIES.forEach((difficulty, index) => {
      const itemY = contentY + index * (this.itemHeight + this.itemPadding);
      if (itemY + this.itemHeight > contentY && itemY < contentY + contentHeight) {
        this.renderDifficultyItem(ctx, difficulty, contentX, itemY, contentWidth);
      }
    });
    ctx.restore();
  }

  renderDifficultyItem(ctx, difficulty, x, y, width) {
    const difficulty_info = GAME_DIFFICULTY_INFO.get(difficulty);

    this.drawBoxBackground(ctx, '#f8f9fa', '#e9ecef');
    renderRoundedRect(ctx, x, y, width, this.itemHeight, 8);

    setFont(ctx, 20, '#212529', true);
    ctx.textAlign = 'left';
    ctx.fillText(difficulty_info.name, x + 20, y + 30);

    setFont(ctx, 16, '#6c757d');
    ctx.fillText(difficulty_info.description, x + 20, y + 60);
  }
}
