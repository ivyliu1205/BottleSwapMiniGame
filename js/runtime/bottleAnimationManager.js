import { ANIMATION_MODE } from '../constants';

export default class BottleAnimationManager {
  constructor() {
    this.isAnimating = false;
    this.animationFrameId = null;
    this.animationStartTime = 0;
    this.animationDuration = 500; // 默认动画持续时间（毫秒）
    this.animatingBottles = [];
    this.onAnimationComplete = null;
    this.onAnimationUpdate = null;
    this.animationType = 'linear'; // 'linear', 'arc', 'bounce'
  }

  /**
   * 设置动画完成回调
   * @param {Function} callback 
   */
  setOnAnimationComplete(callback) {
    this.onAnimationComplete = callback;
  }

  /**
   * 设置动画更新回调（用于触发重新渲染）
   * @param {Function} callback 
   */
  setOnAnimationUpdate(callback) {
    this.onAnimationUpdate = callback;
  }

  /**
   * 设置动画持续时间
   * @param {number} duration 毫秒
   */
  setAnimationDuration(duration) {
    this.animationDuration = duration;
  }

  /**
   * 设置动画类型
   * @param {string} type 'linear', 'arc', 'bounce'
   */
  setAnimationType(type) {
    this.animationType = type;
  }

  /**
   * 开始交换动画
   * @param {Object} bottle1 第一个瓶子对象
   * @param {Object} bottle2 第二个瓶子对象
   * @param {number} index1 第一个瓶子索引
   * @param {number} index2 第二个瓶子索引
   */
  startSwapAnimation(bottle1, bottle2, index1, index2) {
    if (this.isAnimating) {
      console.warn('Animation is already running');
      return false;
    }

    this.isAnimating = true;
    this.animationStartTime = Date.now();
    
    // 保存动画数据
    this.animatingBottles = [
      {
        bottle: bottle1,
        startX: bottle1.x,
        startY: bottle1.y,
        targetX: bottle2.x,
        targetY: bottle2.y,
        startRotation: bottle1.rotation || 0,
        targetRotation: (bottle1.rotation || 0) + Math.PI * 2,
        index: index1
      },
      {
        bottle: bottle2,
        startX: bottle2.x,
        startY: bottle2.y,
        targetX: bottle1.x,
        targetY: bottle1.y,
        startRotation: bottle2.rotation || 0,
        targetRotation: (bottle2.rotation || 0) + Math.PI * 2,
        index: index2
      }
    ];
    
    // 开始动画循环
    this.animate();
    return true;
  }

  /**
   * 动画循环
   */
  animate() {
    const currentTime = Date.now();
    const elapsed = currentTime - this.animationStartTime;
    const progress = Math.min(elapsed / this.animationDuration, 1);
    
    // 应用缓动函数
    const easeProgress = this.getEasingProgress(progress);
    
    // 根据动画类型更新位置
    this.updateBottlePositions(easeProgress);
    
    // 触发重新渲染
    if (this.onAnimationUpdate) {
      this.onAnimationUpdate();
    }
    
    if (progress < 1) {
      // 继续动画
      this.animationFrameId = setTimeout(() => {
        this.animate();
      }, 16); // 约60FPS
    } else {
      // 动画完成
      this.finishAnimation();
    }
  }

  /**
   * 根据动画类型更新瓶子位置
   * @param {number} progress 0-1之间的进度值
   */
  updateBottlePositions(progress) {
    this.animatingBottles.forEach(item => {
      const { bottle, startX, startY, targetX, targetY, startRotation, targetRotation } = item;
      
      let newX, newY;
      
      switch (this.animationType) {
        case 'arc':
          ({ x: newX, y: newY } = this.calculateArcPosition(startX, startY, targetX, targetY, progress));
          break;
        case 'bounce':
          ({ x: newX, y: newY } = this.calculateBouncePosition(startX, startY, targetX, targetY, progress));
          break;
        case 'linear':
        default:
          newX = startX + (targetX - startX) * progress;
          newY = startY + (targetY - startY) * progress;
          break;
      }
      
      bottle.x = newX;
      bottle.y = newY;
      
      // 更新旋转（如果瓶子支持）
      if (bottle.rotation !== undefined) {
        bottle.rotation = startRotation + (targetRotation - startRotation) * progress;
      }
    });
  }

  /**
   * 计算弧形轨迹位置
   */
  calculateArcPosition(startX, startY, targetX, targetY, progress) {
    const midX = (startX + targetX) / 2;
    const midY = (startY + targetY) / 2;
    const arcHeight = 60; // 弧形高度
    
    const controlX = midX;
    const controlY = midY - arcHeight;
    
    // 二次贝塞尔曲线
    const x = Math.pow(1 - progress, 2) * startX + 
              2 * (1 - progress) * progress * controlX + 
              Math.pow(progress, 2) * targetX;
              
    const y = Math.pow(1 - progress, 2) * startY + 
              2 * (1 - progress) * progress * controlY + 
              Math.pow(progress, 2) * targetY;
    
    return { x, y };
  }

  /**
   * 计算弹跳轨迹位置
   */
  calculateBouncePosition(startX, startY, targetX, targetY, progress) {
    const x = startX + (targetX - startX) * progress;
    
    // 添加弹跳效果
    const bounceHeight = 30;
    const bounceY = Math.sin(progress * Math.PI) * bounceHeight;
    const y = startY + (targetY - startY) * progress - bounceY;
    
    return { x, y };
  }

  /**
   * 获取缓动进度
   * @param {number} progress 原始进度 0-1
   * @returns {number} 缓动后的进度 0-1
   */
  getEasingProgress(progress) {
    // easeInOutQuad
    return progress < 0.5 
      ? 2 * progress * progress 
      : -1 + (4 - 2 * progress) * progress;
  }

  /**
   * 完成动画
   */
  finishAnimation() {
    this.isAnimating = false;
    
    if (this.animationFrameId) {
      clearTimeout(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    const animationData = {
      bottles: [...this.animatingBottles],
      indices: this.animatingBottles.map(item => item.index)
    };
    
    // 清空动画数据
    this.animatingBottles = [];
    
    // 执行完成回调
    if (this.onAnimationComplete) {
      this.onAnimationComplete(animationData);
    }
  }

  /**
   * 取消动画
   */
  cancelAnimation() {
    if (this.isAnimating) {
      this.isAnimating = false;
      if (this.animationFrameId) {
        clearTimeout(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.animatingBottles = [];
    }
  }

  /**
   * 检查是否正在动画
   * @returns {boolean}
   */
  getIsAnimating() {
    return this.isAnimating;
  }

  /**
   * 获取当前动画进度 0-1
   * @returns {number}
   */
  getAnimationProgress() {
    if (!this.isAnimating) return 0;
    
    const elapsed = Date.now() - this.animationStartTime;
    return Math.min(elapsed / this.animationDuration, 1);
  }

  /**
   * 设置多种预设动画配置
   */
  setPreset(preset) {
    const presets = {
      fast: { duration: 300, type: 'linear' },
      smooth: { duration: 500, type: 'arc' },
      bouncy: { duration: 600, type: 'bounce' },
      slow: { duration: 800, type: 'arc' }
    };
    
    if (presets[preset]) {
      this.setAnimationDuration(presets[preset].duration);
      this.setAnimationType(presets[preset].type);
    }
  }
}
