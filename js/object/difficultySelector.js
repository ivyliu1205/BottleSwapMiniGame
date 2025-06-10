import { GAME_DIFFICULTY_INFO, GAME_DIFFICULTIES } from '../constants';
import { renderBackgroundShadow } from '../utils/componentUtil';

export default class DifficultySelector {
  constructor() {
    this.isVisible = false;
    this.x = 0;
    this.y = 0;
    this.width = 300;
    this.height = 400;
    this.scrollY = 0;
    this.maxScrollY = 0;
    this.itemHeight = 80;
    this.itemPadding = 20;
    this.headerHeight = 60;
    
    this.onDifficultySelect = null;
    this.onClose = null;
    
    // 触摸相关
    this.isDragging = false;
    this.lastTouchY = 0;
    this.velocity = 0;
    this.lastTouchTime = 0;
  }

  show(screenWidth, screenHeight) {
    this.isVisible = true;
    this.x = (screenWidth - this.width) / 2;
    this.y = (screenHeight - this.height) / 2;
    this.scrollY = 0;
    
    // 计算最大滚动距离
    const contentHeight = GAME_DIFFICULTY_INFO.length * (this.itemHeight + this.itemPadding) - this.itemPadding;
    const viewHeight = this.height - this.headerHeight - 40; // 40为底部padding
    this.maxScrollY = Math.max(0, contentHeight - viewHeight);
  }

  hide() {
    this.isVisible = false;
    this.scrollY = 0;
    this.isDragging = false;
  }

  setOnDifficultySelect(callback) {
    this.onDifficultySelect = callback;
  }

  setOnClose(callback) {
    this.onClose = callback;
  }

  render(ctx) {
    if (!this.isVisible) return;
    renderBackgroundShadow(ctx);

    // 绘制弹窗背景
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    this.roundRect(ctx, this.x, this.y, this.width, this.height, 10);
    ctx.fill();
    ctx.stroke();

    // 绘制标题
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('选择难度', this.x + this.width / 2, this.y + 35);

    // 绘制关闭按钮
    const closeButtonX = this.x + this.width - 35;
    const closeButtonY = this.y + 15;
    const closeButtonSize = 20;
    
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('×', closeButtonX + closeButtonSize / 2, closeButtonY + closeButtonSize / 2 + 5);

    // 设置裁剪区域用于滚动
    const contentX = this.x + 20;
    const contentY = this.y + this.headerHeight;
    const contentWidth = this.width - 40;
    const contentHeight = this.height - this.headerHeight - 20;

    ctx.save();
    ctx.beginPath();
    ctx.rect(contentX, contentY, contentWidth, contentHeight);
    ctx.clip();

    // 绘制难度选项
    GAME_DIFFICULTIES.forEach((difficulty, index) => {
      const itemY = contentY - this.scrollY + index * (this.itemHeight + this.itemPadding);
      
      // 只绘制可见的项目
      if (itemY + this.itemHeight > contentY && itemY < contentY + contentHeight) {
        this.renderDifficultyItem(ctx, difficulty, contentX, itemY, contentWidth);
      }
    });

    ctx.restore();

    // 绘制滚动条
    if (this.maxScrollY > 0) {
      this.renderScrollbar(ctx, contentX + contentWidth - 10, contentY, contentHeight);
    }
  }

  renderDifficultyItem(ctx, difficulty, x, y, width) {
    const difficulty_info = GAME_DIFFICULTY_INFO.get(difficulty);

    // 绘制项目背景
    ctx.fillStyle = '#f8f9fa';
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    this.roundRect(ctx, x, y, width, this.itemHeight, 8);
    ctx.fill();
    ctx.stroke();

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

  renderScrollbar(ctx, x, y, height) {
    // 滚动条背景
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(x, y, 6, height);

    // 滚动条滑块
    const scrollbarHeight = Math.max(20, (height * height) / (height + this.maxScrollY));
    const scrollbarY = y + (this.scrollY / this.maxScrollY) * (height - scrollbarHeight);
    
    ctx.fillStyle = '#adb5bd';
    this.roundRect(ctx, x, scrollbarY, 6, scrollbarHeight, 3);
    ctx.fill();
  }

  roundRect(ctx, x, y, width, height, radius) {
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

  handleClick(x, y) {
    console.log("Handle click");
    if (!this.isVisible) return false;

    // 检查是否点击了关闭按钮
    const closeButtonX = this.x + this.width - 35;
    const closeButtonY = this.y + 15;
    const closeButtonSize = 20;
    
    if (x >= closeButtonX && x <= closeButtonX + closeButtonSize &&
        y >= closeButtonY && y <= closeButtonY + closeButtonSize) {
      console.log("Close button clicked");
      this.hide();
      if (this.onClose) this.onClose();
      return true;
    }

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
      
      const relativeY = y - contentY + this.scrollY;
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

  handleTouchStart(x, y) {
    if (!this.isVisible) return false;

    const contentX = this.x + 20;
    const contentY = this.y + this.headerHeight;
    const contentWidth = this.width - 40;
    const contentHeight = this.height - this.headerHeight - 20;

    if (x >= contentX && x <= contentX + contentWidth && 
        y >= contentY && y <= contentY + contentHeight) {
      this.isDragging = true;
      this.lastTouchY = y;
      this.lastTouchTime = Date.now();
      this.velocity = 0;
      return true;
    }

    return false;
  }

  handleTouchMove(x, y) {
    if (!this.isDragging) return false;

    const deltaY = y - this.lastTouchY;
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTouchTime;

    if (deltaTime > 0) {
      this.velocity = deltaY / deltaTime;
    }

    this.scrollY = Math.max(0, Math.min(this.maxScrollY, this.scrollY - deltaY));
    this.lastTouchY = y;
    this.lastTouchTime = currentTime;

    return true;
  }

  handleTouchEnd() {
    if (!this.isDragging) return false;

    this.isDragging = false;

    // 实现惯性滚动
    if (Math.abs(this.velocity) > 0.1) {
      this.inertialScroll();
    }

    return true;
  }

  inertialScroll() {
    const friction = 0.95;
    const minVelocity = 0.1;

    const animate = () => {
      this.velocity *= friction;
      this.scrollY = Math.max(0, Math.min(this.maxScrollY, this.scrollY - this.velocity * 16));

      if (Math.abs(this.velocity) > minVelocity) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  isPointInside(x, y) {
    if (!this.isVisible) return false;
    return x >= this.x && x <= this.x + this.width && 
           y >= this.y && y <= this.y + this.height;
  }
}