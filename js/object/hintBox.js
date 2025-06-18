import BoxBase from '../base/boxBase';
import Bottle from '../object/bottle';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import { renderRoundedRect, setFont } from '../utils/componentUtil';
import { calculateBottlePositions } from '../utils/bottleUtil';

export default class HintBox extends BoxBase {
  constructor() {
    const width = SCREEN_WIDTH * 0.9;
    const height = SCREEN_HEIGHT * 0.7;
    super(width, height, true);
    
    this.setPosition(
      (SCREEN_WIDTH - width) / 2,
      (SCREEN_HEIGHT - height) / 2
    );
    
    this.solutionBottles = [];
    this.bottleScale = 0.6; // 缩小瓶子尺寸
    this.titleHeight = 60;
    this.bottleAreaY = this.y + this.titleHeight;
    this.bottleAreaHeight = this.height - this.titleHeight - 20;
  }

  /**
   * 设置解决方案数据
   */
  setSolutionData(solutionIndexes) {
    this.clearSolutionBottles();
    this.createSolutionBottles(solutionIndexes);
  }

  /**
   * 创建解决方案瓶子
   */
  createSolutionBottles(solutionIndexes) {
    // 计算缩小后的瓶子位置
    const positions = this.calculateScaledBottlePositions(solutionIndexes);
    
    positions.forEach((item, index) => {
      const bottle = this.createBottle(item[0]);
      bottle.init(item[0], item[1], item[2]);
      // 缩放瓶子
      bottle.width *= this.bottleScale;
      bottle.height *= this.bottleScale;
      this.solutionBottles.push(bottle);
    });
  }

  /**
   * 计算缩放后的瓶子位置
   */
  calculateScaledBottlePositions(bottleIndexes) {
    // 获取原始位置
    const originalPositions = calculateBottlePositions(bottleIndexes);
    
    // 计算缩放参数
    const scaledPositions = originalPositions.map((pos) => {
      const [colorIndex, originalX, originalY] = pos;
      
      // 将坐标转换到弹窗内的相对位置
      const relativeX = (originalX - 50) * this.bottleScale; // 50是原始的左边距
      const relativeY = (originalY - 200) * this.bottleScale; // 200是原始的上边距
      
      // 计算在弹窗内的最终位置
      const finalX = this.x + 50 + relativeX;
      const finalY = this.bottleAreaY + 50 + relativeY;
      
      return [colorIndex, finalX, finalY];
    });
    
    return scaledPositions;
  }

  /**
   * 创建瓶子实例
   */
  createBottle(colorIdx) {
    const poolId = `HintBottle-${colorIdx}`;
    let bottle = GameGlobal.databus.pool.getItemByClass(poolId, Bottle);
    if (!bottle) {
      bottle = new Bottle();
    }
    return bottle;
  }

  /**
   * 清理解决方案瓶子
   */
  clearSolutionBottles() {
    this.solutionBottles.forEach(bottle => {
      const poolId = `HintBottle-${bottle.getColorIndex()}`;
      GameGlobal.databus.pool.recover(poolId, bottle);
    });
    this.solutionBottles = [];
  }

  /**
   * 渲染
   */
  render(ctx) {
    if (!this.isVisible) return;

    ctx.save();
    
    // 绘制半透明背景遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // 绘制弹窗背景
    this.drawBoxBackground(ctx, '#f8f8f8', '#cccccc');
    renderRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);
    
    // 绘制标题
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    setFont(ctx, 24, undefined, true);
    ctx.fillText('目标排列', this.x + this.width / 2, this.y + 35);
    
    // 绘制分割线
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x + 20, this.y + this.titleHeight - 10);
    ctx.lineTo(this.x + this.width - 20, this.y + this.titleHeight - 10);
    ctx.stroke();
    
    // 绘制瓶子区域背景
    ctx.fillStyle = '#ffffff';
    renderRoundedRect(ctx, this.x + 10, this.bottleAreaY, this.width - 20, this.bottleAreaHeight, 5);
    
    // 绘制解决方案瓶子
    this.solutionBottles.forEach(bottle => {
      bottle.render(ctx);
    });
    
    // 绘制提示文字
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'center';
    setFont(ctx, 16);
    ctx.fillText('按照上述排列完成游戏', this.x + this.width / 2, this.y + this.height - 30);
    
    // 绘制关闭按钮
    this.drawCloseButton(ctx);
    
    ctx.restore();
  }

  /**
   * 点击处理
   */
  handleClick(x, y) {
    if (!this.isVisible) return false;
    
    // 检查关闭按钮点击
    if (this.handleCloseButton(x, y)) {
      return true;
    }
    
    // 点击弹窗外部关闭
    if (!this.isPointInside(x, y)) {
      this.hide();
      return true;
    }
    
    return false;
  }

  /**
   * 显示弹窗
   */
  show(solutionIndexes) {
    this.setSolutionData(solutionIndexes);
    super.show();
  }

  /**
   * 隐藏弹窗
   */
  hide() {
    super.hide();
    this.clearSolutionBottles();
  }

  /**
   * 重写关闭按钮点击处理
   */
  handleCloseButtonClick() {
    super.handleCloseButtonClick();
    this.clearSolutionBottles();
  }
}