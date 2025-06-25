import { GAME_DIFFICULTY_INFO, GAME_DIFFICULTIES, LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, LARGE_BOX_HEADER_HEIGHT, BOX_TYPE } from '../../constants';
import { drawBoxHeader, renderRoundedRect, setFont } from '../../utils/componentUtil';
import BoxBase from '../../base/boxBase';

export default class DifficultySelectorBox extends BoxBase {
  constructor() {
    super(BOX_TYPE.LARGE, LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, true);
    this.itemHeight = 80;
    this.itemPadding = 20;
    this.headerHeight = LARGE_BOX_HEADER_HEIGHT;

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


  /**
   * Handler
   */
  handleClick(x, y) {
    if (!this.isVisible) return false;
    if (this.handleCloseButton(x, y)) return true;

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
    return false;
  }

  /**
   * Draw
   */
  render(ctx) {
    if (!this.isVisible) return;
    super.render(ctx);
    ctx.save();
    drawBoxHeader(ctx, '选择难度', this.x, this.y, this.width);

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
    this.drawCloseButton(ctx);
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
