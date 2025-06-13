import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../render";

export function renderBackgroundShadow(ctx) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

export function setFont(ctx, fontSize, fillStype='#000000', isBold=false) {
  ctx.fillStyle = fillStype;
  if (!isBold) {
    ctx.font = `${fontSize}px Arial`;
  } else {
    ctx.font = `bold ${fontSize}px Arial`;
  }
}
