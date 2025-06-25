import BoxBase from '../../base/boxBase';
import { drawBoxHeader, setFont } from '../../utils/componentUtil';
import { BOX_TYPE, BUTTON_NAME, CONTENT_COLOR, CONTENT_FONT_SIZE, GAME_INSTRUCTION, LABEL_COLOR, LARGE_BOX_HEADER_HEIGHT, LARGE_BOX_HEIGHT, LARGE_BOX_WIDTH } from '../../constants';
import OpButton from '../buttons/opButton';

export default class InfoBox extends BoxBase {
  constructor() {
    super(BOX_TYPE.LARGE, LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, true);

    this.padding = 35;
    this.lineHeight = 35;
    this.headerHeight = LARGE_BOX_HEADER_HEIGHT;
    
    this.title = "游戏说明";
    this.content = GAME_INSTRUCTION;

    this.feedbackButton = null;
    this.initFeedbackButton();
  }

  initFeedbackButton() {
    const buttonSize = 40;
    const margin = 15;
    const labelSpace = 20;
    const buttonX = this.x + this.width - buttonSize - margin;
    const buttonY = this.y + this.height - buttonSize - margin - labelSpace;
    
    this.feedbackButton = new OpButton(
      BUTTON_NAME.FEEDBACK,
      buttonX, 
      buttonY, 
      buttonSize
    );
    
    this.feedbackButton.setOnImageLoaded(() => {
      if (this.onImageLoaded) {
        this.onImageLoaded();
      }
    });
    
    this.feedbackButton.setOnClickCallback((buttonName) => {
      if (this.onFeedbackClick) {
        this.onFeedbackClick(buttonName);
      }
    });
  }

  setOnFeedbackClick(callback) {
    this.onFeedbackClick = callback;
  }

  setOnImageLoaded(callback) {
    this.onImageLoaded = callback;
  }

  render(ctx) {
    if (!this.isVisible) return;
    super.render(ctx);
    drawBoxHeader(ctx, this.title, this.x, this.y, this.width);
    this.drawContent(ctx);

    if (this.feedbackButton) {
      this.feedbackButton.render(ctx);
      this.drawFeedbackLabel(ctx);
    }
  }

  /**
   * Handler
   */
  handleClick(x, y) {
    if (!this.isVisible) return false;
    
    if (this.feedbackButton && this.feedbackButton.handleClick(x, y)) {
      return true;
    }

    if (this.handleCloseButton(x, y)) return true;
    return false;
  }

  /**
   * Draw
   */
  drawContent(ctx) {
    setFont(ctx, CONTENT_FONT_SIZE, CONTENT_COLOR);
    ctx.textAlign = 'left';
    this.content.forEach((line, index) => {
      const contentY = this.y + this.headerHeight + 40 + (index * this.lineHeight);
      ctx.fillText(line, this.x + this.padding, contentY);
    });
  }

  drawFeedbackLabel(ctx) {
    if (!this.feedbackButton) return;
    
    setFont(ctx, 12, LABEL_COLOR);
    ctx.textAlign = 'center';
    
    const labelX = this.feedbackButton.x + this.feedbackButton.width / 2;
    const labelY = this.feedbackButton.y + this.feedbackButton.height + 15;
    
    ctx.fillText('意见反馈', labelX, labelY);
  }
}
