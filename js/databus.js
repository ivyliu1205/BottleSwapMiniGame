import Pool from './base/pool';
import ShareManager from './runtime/shareManager';
import { GAME_DIFFICULTY, GAME_DIFFICULTY_INFO, GAME_STATUS } from './constants';
import { isFirstOpenWithVersion, shuffleArray, swapArrayItems } from './utils/commonUtil';

let instance;

const DEFAULT_PREV_SWAP = [-1, -1];

/**
 * 全局状态管理器
 */
export default class DataBus {
  pool = new Pool();
  shareManager = new ShareManager();

  gameStatus = GAME_STATUS.PLAYING;
  gameDifficulty = GAME_DIFFICULTY.EASY;
  bottleIndexes = [];
  expectedBottleIndexes = [];
  correctCnt = 0;
  swapCnt = 0;
  prevSwap = DEFAULT_PREV_SWAP;

  constructor() {
    if (instance) return instance;
    instance = this;

    if (isFirstOpenWithVersion()) {
      this.gameStatus = GAME_STATUS.INFO;
    }
  }

  // 重置游戏状态
  reset() {
    this.bottleIndexes = [];
    this.expectedBottleIndexes = [];
    this.correctCnt = 0;
    this.swapCnt = 0;
    this.prevSwap = DEFAULT_PREV_SWAP;
    this.gameStatus = GAME_STATUS.PLAYING;
  }

  /**
   * Initialize new game
   */
  initNewGame() {
    this.reset();

    const bottleCnt = this.getBottleNumber();
    this.expectedBottleIndexes = [...Array(bottleCnt).keys()];
    shuffleArray(this.expectedBottleIndexes);

    this.bottleIndexes = [...this.expectedBottleIndexes];
    shuffleArray(this.bottleIndexes);

    this.correctCnt = this.getCorrectBottleCount();
    while (this.correctCnt > 0) {
      shuffleArray(this.bottleIndexes);
      this.correctCnt = this.getCorrectBottleCount();
    }
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
    // return true;
    return this.correctCnt == this.bottleIndexes.length;
  }

  /**
   * Bottles
   */
  swapBottles(i, j) {
    swapArrayItems(this.bottleIndexes, i, j);
    this.correctCnt = this.getCorrectBottleCount();
    this.incrementSwapCnt(1);
    this.prevSwap = [i, j];
  }

  /**
   * Back to prev step
   */
  backToPrevStep() {
    const errorMsg = GameGlobal.databus.getBackErrorMsg();
    if (errorMsg) return;

    swapArrayItems(this.bottleIndexes, ...this.prevSwap);
    this.correctCnt = this.getCorrectBottleCount();
    this.incrementSwapCnt(1);
    this.prevSwap = DEFAULT_PREV_SWAP;
    return [true, null];
  }

  getBackErrorMsg() {
    if (GameGlobal.databus.prevSwap != DEFAULT_PREV_SWAP)  return '';
    var errorMsg = '不能再后退了';
    if (GameGlobal.databus.swapCnt == 0) {
      errorMsg = '请先移动瓶子';
    }
    return errorMsg;
  }

  /**
   * Share results
   */
  shareResultToFriend() {
    this.shareManager.shareToFriend(this.swapCnt, this.getGameDifficultyName());
  }

  shareResultToMoment() {
    this.shareManager.shareToMoments(this.swapCnt, this.getGameDifficultyName());
  }

  /**
   * Utils
   */
  incrementSwapCnt(plus=1) {
    this.swapCnt += plus;
  }

  /**
   * Getters & Setters
   */
  getGameDifficulty() {
    return this.gameDifficulty;
  }

  getGameDifficultyName() {
    return GAME_DIFFICULTY_INFO.get(this.gameDifficulty)
.name;
  }

  getBottleNumber() {
    return GAME_DIFFICULTY_INFO.get(this.gameDifficulty).bottleCount;
  }

  getGameStatus() {
    return this.gameStatus;
  }

  setGameStatus(status) {
    this.gameStatus = status;
  }

  getExpectedBottleIndexes() {
    return this.expectedBottleIndexes;
  }
}
