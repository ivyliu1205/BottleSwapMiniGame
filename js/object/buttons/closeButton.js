import ButtonBase from "../../base/buttonBase";
import { BUTTON_TYPE } from "../../constants";

const CLOSE_BUTTON_NAME = 'closeButton';

export default class CloseButton extends ButtonBase {
  constructor(size = 30) {
    super(CLOSE_BUTTON_NAME, BUTTON_TYPE.CLOSE_BUTTON, 0, 0, size, size);
    this.size = size;
    this.padding = 8;
  }

  handleClick(x, y) {
    if (!this.isVisible) return false;
    if (this.isPointInside(x, y)) {
      if (this.onClickCallback) {
        this.onClickCallback();
      }
      return true;
    }
    return false;
  }

  render(ctx) {
    if (!this.isVisible)  return;
    ctx.save();
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2, 
      this.y + this.height / 2, 
      this.width / 2, 
      0, 
      2 * Math.PI
    );
    ctx.fill();

    // 绘制关闭图标 (×)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const iconSize = this.width / 2 - this.padding;
    
    // 绘制 × 形状
    ctx.beginPath();
    ctx.moveTo(centerX - iconSize / 2, centerY - iconSize / 2);
    ctx.lineTo(centerX + iconSize / 2, centerY + iconSize / 2);
    ctx.moveTo(centerX + iconSize / 2, centerY - iconSize / 2);
    ctx.lineTo(centerX - iconSize / 2, centerY + iconSize / 2);
    ctx.stroke();
    
    ctx.restore();
  }

  setRelativePosition(parentX, parentY, parentWidth, parentHeight) {
    this.x = parentX + parentWidth - this.width - 10; // 距离右边10px
    this.y = parentY + 10; // 距离顶部10px
  }
}
