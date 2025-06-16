
export function isFirstOpenWithVersion() {
  try {
    const hasOpened = wx.getStorageSync('hasOpened');
    if (!hasOpened) {
      wx.setStorageSync('hasOpened', true);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return true;
  }
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
