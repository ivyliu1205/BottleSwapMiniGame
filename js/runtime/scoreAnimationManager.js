export default class ScoreAnimationManager {
  constructor() {
    this.previousCorrectCnt = 0;
    this.animation = {
      isActive: false,
      color: '#333333',
      isBold: false,
      fontSizeMultiplier: 1,
      startTime: 0,
      duration: 2000
    };
    this.animationTimer = null;
  }

  initialize(correctCnt) {
    this.previousCorrectCnt = correctCnt;
    this.animation.isActive = false;
    this.animation.color = '#333333';
    this.animation.isBold = false;
    this.animation.fontSizeMultiplier = 1;
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
  }

  checkAndTriggerAnimation(currentCorrectCnt) {
    if (currentCorrectCnt !== this.previousCorrectCnt) {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
        this.animationTimer = null;
      }

      this.animation.isActive = true;
      this.animation.isBold = true;

      if (currentCorrectCnt > this.previousCorrectCnt) {
        this.animation.color = '#159947';
      } else {
        this.animation.color = '#E63946';
      }
      this.animation.fontSizeMultiplier = 1.2;
      this.animation.startTime = Date.now();

      this.animationTimer = setTimeout(() => {
        this.animation.isActive = false;
        this.animation.color = '#333333';
        this.animation.isBold = false;
        this.animation.fontSizeMultiplier = 1;
        if (this.onAnimationUpdateCallback) {
          this.onAnimationUpdateCallback();
        }
      }, this.animation.duration);

      this.previousCorrectCnt = currentCorrectCnt;
      return true;
    }
    return false;
  }

  getAnimationState() {
    return {
      color: this.animation.color,
      isBold: this.animation.isBold,
      fontSizeMultiplier: this.animation.fontSizeMultiplier
    };
  }

  isAnimating() {
    return this.animation.isActive;
  }

  setOnAnimationUpdate(callback) {
    this.onAnimationUpdateCallback = callback;
  }

  stopAnimation() {
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
    this.animation.isActive = false;
    this.animation.color = '#333333';
    this.animation.isBold = false;
    this.animation.fontSizeMultiplier = 1;
  }
}
