GameGlobal.canvas = wx.createCanvas();

const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
export const PIXEL_RATIO = windowInfo.pixelRatio || 1;

canvas.width = windowInfo.screenWidth * PIXEL_RATIO;
canvas.height = windowInfo.screenHeight * PIXEL_RATIO;

canvas.style.width = windowInfo.windowWidth + 'px';
canvas.style.height = windowInfo.windowHeight + 'px';

export const SCREEN_WIDTH = windowInfo.screenWidth;
export const SCREEN_HEIGHT = windowInfo.screenHeight;
