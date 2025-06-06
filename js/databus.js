import Pool from './base/pool';
import { shuffleArray } from './utils';

let instance;

const DEFAULT_PREV_SWAP = [-1, -1];

/**
 * 全局状态管理器
 * 负责管理游戏的状态，包括帧数、分数、子弹、敌人和动画等
 */
export default class DataBus {
  // 直接在类中定义实例属性
  enemys = []; // 存储敌人
  bullets = []; // 存储子弹
  animations = []; // 存储动画
  frame = 0; // 当前帧数
  score = 0; // 当前分数
  isGameOver = false; // 游戏是否结束
  pool = new Pool(); // 初始化对象池

  bottleCnt = 5;
  bottleIndexes = [];
  expectedBottleIndexes = [];

  correctCnt = 0;
  swapCnt = 0;

  // Tmp state
  prevSwap = DEFAULT_PREV_SWAP

  constructor() {
    // 确保单例模式
    if (instance) return instance;

    instance = this;
  }

  // 重置游戏状态
  reset() {
    this.frame = 0; // 当前帧数
    this.score = 0; // 当前分数
    this.bullets = []; // 存储子弹
    this.enemys = []; // 存储敌人
    this.animations = []; // 存储动画
    this.isGameOver = false; // 游戏是否结束

    this.bottleCnt = 5;
    this.bottleIndexes = [];
    this.expectedBottleIndexes = [];
    this.correctCnt = 0;
    this.swapCnt = 0;

    this.prevSwap = DEFAULT_PREV_SWAP;
  }

  /**
   * Initialize new game
   */
  initNewGame() {
    console.log(">>>> New Game");
    this.reset();

    this.expectedBottleIndexes = [...Array(this.bottleCnt).keys()];
    shuffleArray(this.expectedBottleIndexes);

    this.bottleIndexes = [...this.expectedBottleIndexes];
    shuffleArray(this.bottleIndexes);

    if (this.getCorrectBottleCount() == this.bottleCnt) {
      console.log("Reshuffle the bottles");
      shuffleArray(this.bottleIndexes);
    }

    this.correctCnt = this.getCorrectBottleCount();
  }

  /**
   * Get number of bottles at correct positions
   */
  getCorrectBottleCount() {
    var correctCnt = 0;
    for (var idx in this.bottleIndexes) {
      if (this.bottleIndexes[idx] == this.expectedBottleIndexes[idx]) {
        correctCnt += 1;
      }
    }
    return correctCnt;
  }

  // 游戏结束
  gameOver() {
    this.isGameOver = true;
  }

  /**
   * Bottle swap
   */
  swapBottles(i, j) {
    [this.bottleIndexes[i], this.bottleIndexes[j]] = [this.bottleIndexes[j], this.bottleIndexes[i]];
    this.correctCnt = this.getCorrectBottleCount();
    this.swapCnt += 1;
    this.prevSwap = [i, j];
  }

  backToPrevStep() {
    if (this.prevSwap == DEFAULT_PREV_SWAP) {
      console.log("No prev step");
      return;
    }
    const i = this.prevSwap[0];
    const j = this.prevSwap[1];
    console.log(`Back to prev step: ${i} and ${j}`);
    [this.bottleIndexes[i], this.bottleIndexes[j]] = [this.bottleIndexes[j], this.bottleIndexes[i]];
    this.correctCnt = this.getCorrectBottleCount();
    this.swapCnt -= 1;
    this.prevSwap == DEFAULT_PREV_SWAP;
  }

  /**
   * TODO: Remove
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   * @param {Object} enemy - 要回收的敌人对象
   */
  // removeEnemy(enemy) {
  //   const temp = this.enemys.splice(this.enemys.indexOf(enemy), 1);
  //   if (temp) {
  //     this.pool.recover('enemy', enemy); // 回收敌人到对象池
  //   }
  // }

  /**
   * TODO: Remove
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   * @param {Object} bullet - 要回收的子弹对象
   */
  // removeBullets(bullet) {
  //   const temp = this.bullets.splice(this.bullets.indexOf(bullet), 1);
  //   if (temp) {
  //     this.pool.recover('bullet', bullet); // 回收子弹到对象池
  //   }
  // }
}
