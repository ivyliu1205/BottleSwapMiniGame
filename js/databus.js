import Pool from './base/pool';
import { GAME_DIFFICULTY, GAME_DIFFICULTY_INFO } from './constants';
import { shuffleArray } from './utils';

let instance;

const DEFAULT_PREV_SWAP = [-1, -1];

/**
 * 全局状态管理器
 */
export default class DataBus {
  pool = new Pool();

  gameDifficulty = GAME_DIFFICULTY.MEDIUM;
  bottleIndexes = [];
  expectedBottleIndexes = [];
  correctCnt = 0;
  swapCnt = 0;
  prevSwap = DEFAULT_PREV_SWAP

  constructor() {
    if (instance) return instance;
    instance = this;
  }

  // 重置游戏状态
  reset() {
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

    console.log(`>>> ${GAME_DIFFICULTY_INFO} ${this.gameDifficulty}`);
    const bottleCnt = this.getBottleNumber();
    this.expectedBottleIndexes = [...Array(bottleCnt).keys()];
    shuffleArray(this.expectedBottleIndexes);

    this.bottleIndexes = [...this.expectedBottleIndexes];
    shuffleArray(this.bottleIndexes);

    if (this.getCorrectBottleCount() == bottleCnt) {
      console.log("Reshuffle the bottles");
      shuffleArray(this.bottleIndexes);
    }

    this.correctCnt = this.getCorrectBottleCount();
  }

  updateDifficulty(newDifficulty) {
    this.gameDifficulty = newDifficulty;
    this.initNewGame();
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

  checkVictory() {
    return true;
    // return this.correctCnt == this.bottleIndexes.length;
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
      return false;
    }
    const i = this.prevSwap[0];
    const j = this.prevSwap[1];
    console.log(`Back to prev step: ${i} and ${j}`);
    [this.bottleIndexes[i], this.bottleIndexes[j]] = [this.bottleIndexes[j], this.bottleIndexes[i]];
    this.correctCnt = this.getCorrectBottleCount();
    this.swapCnt -= 1;
    this.prevSwap = DEFAULT_PREV_SWAP;
    return true;
  }

  getGameDifficulty() {
    return this.gameDifficulty;
  }

  getBottleNumber() {
    return GAME_DIFFICULTY_INFO.get(this.gameDifficulty).bottleCount;
  }
}
