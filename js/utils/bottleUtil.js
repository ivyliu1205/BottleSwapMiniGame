import { BOTTLE_WIDTH, BOTTLE_HEIGHT, BOTTLE_SPACING, MAX_BOTTLE_PER_ROW } from '../constants';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

/**
 * Calculate the positions of bottles 
 * Place all bottles in the center of the screen
 * 
 * @param {*} bottleIndexes The indexes of the bottles
 * @returns List of objects in format of [color_index, posX, posY]
 */
export function calculateBottlePositions(bottleIndexes) {
  const n = bottleIndexes.length;

  var positions = [];
  if (n <= 5) {
    const totalWidth = n * BOTTLE_WIDTH + (n - 1) * BOTTLE_SPACING;
    const startX = (SCREEN_WIDTH - totalWidth) / 2;
    const y = SCREEN_HEIGHT / 2 - BOTTLE_HEIGHT / 2;
    
    bottleIndexes.forEach((colorIdx, idx) => {
        const x = startX + idx * (BOTTLE_WIDTH + BOTTLE_SPACING);
        positions.push([colorIdx, x, y]);
    });
    return positions;
  }

  const rows = Math.ceil(n / MAX_BOTTLE_PER_ROW);
  const bottlesPerRow = Math.floor(n / rows);
  const extraBottles = n % rows;

  const rowCounts = [];
  for (let i = 0; i < rows; i++) {
      rowCounts[i] = bottlesPerRow + (i < extraBottles ? 1 : 0);
  }
  const totalHeight = rows * BOTTLE_HEIGHT + (rows - 1) * BOTTLE_SPACING;
  const startY = (SCREEN_HEIGHT - totalHeight) / 2;

  let bottleIndex = 0;
  for (let row = 0; row < rows; row++) {
      const currentRowCount = rowCounts[row];
      const currentRowWidth = currentRowCount * BOTTLE_WIDTH + (currentRowCount - 1) * BOTTLE_SPACING;
      const currentRowStartX = (SCREEN_WIDTH - currentRowWidth) / 2;
      
      for (let col = 0; col < currentRowCount; col++) {
          const x = currentRowStartX + col * (BOTTLE_WIDTH + BOTTLE_SPACING);
          const y = startY + row * (BOTTLE_HEIGHT + BOTTLE_SPACING);
          
          const colorIdx = bottleIndexes[bottleIndex];
          positions.push([colorIdx, x, y]);
          bottleIndex++;
      }
  }
  return positions;
}
