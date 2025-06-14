
import { GAME_VERSION } from './constants';

export function isFirstOpenWithVersion() {
  const storedVersion = wx.getStorageSync('gameVersion');
  if (storedVersion !== GAME_VERSION) {
    wx.setStorageSync('gameVersion', GAME_VERSION);
    wx.setStorageSync('hasOpened', true);
    return true;
  }
  return false;
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
