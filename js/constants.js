
export const GAME_VERSION = '1.0.0';

// GAME
export const GAME_STATUS = {
  PLAYING: 'playing',
  INFO: 'info',
  VICTORY: 'victory',
  ERROR: 'error'
}

// GAME UI
export const GAME_DESCRIPTION = `Swap bottles find correct order!`;
export const BUTTON_WIDTH = 80;
export const BUTTON_HEIGHT = 30;
export const BUTTON_SIZE = 30;

export const BUTTON_Y = 90;

export const BUTTON_TYPE = {
  OP_BUTTON: "op_button",
  INNER_OP_BUTTON: "inner_op_button",
  CLOSE_BUTTON: "close_button",
  OTHERS: "others"
}

export const BUTTON_NAME = {
  MORE: "More",
  INFO: "Info",
  RESET: "Reset",
  BACK: "Back",
  SHARE_TO_FRIEND: "Share2_to_friend",
  SHARE_TO_MOMENT: "Share_to_moment"
} 

export const ANIMATION_MODE = {
  FAST: "fast",
  SMOOTH: "smooth",
  BOUNCY: "bouncy",
  SLOW: "slow"
}

// INNER OPERATION BUTTONS
export const INNER_BUTTON_SIZE = 40;
export const INNER_BUTTON_SPACING = 15;

// BOTTLES
export const BOTTLE_COLORS = [
  { name: 'Red', code: '#ff6b6b'},
  { name: 'Blue', code: '#45b7d1'},
  { name: 'Green', code: '#96ceb4'},
  { name: 'Yellow', code: '#feca57'},
  { name: 'Pink', code: '#ff9ff3'},
  { name: 'Purple', code: '#6c5ce7'},
  { name: 'Gold', code: '#ffd93d'},
  { name: 'Turquoise', code: '#4ecdc4'},
  { name: 'IceCold', code: '#a8e6cf'},
  { name: 'Light Coral', code: '#F28482'},
  { name: 'Fire Brick', code: '#9F1713'},
  { name: 'Paua', code: '#242C54'},
  { name: 'Blue Haze', code: '#C1C0D4'},
  { name: 'Cascade', code: '#84A59D'},
  { name: 'Deep Lilac', code: '#9B499E'},
  { name: 'Picton Blue', code: '#63AAD7'},
  { name: 'Neon Carrot', code: '#FF8A25'},
  { name: 'Dodger Blue', code: '#0078FF'},
  { name: 'Radical Red', code: '#FF4359'},
  { name: 'Blue Zodiac', code: '#3D405B'},
];

export const BOTTLE_WIDTH = 40;
export const BOTTLE_HEIGHT = 100;
export const BOTTLE_SPACING = 10;
export const MAX_BOTTLE_ROWS = 2;
export const MAX_BOTTLE_PER_ROW = 5;

// Levels
export const GAME_DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
};

export const GAME_DIFFICULTIES = [
  GAME_DIFFICULTY.EASY,
  GAME_DIFFICULTY.MEDIUM,
  GAME_DIFFICULTY.HARD
];

export const GAME_DIFFICULTY_INFO = new Map(
  [
    [GAME_DIFFICULTY.EASY, {name: '简单', description: '适合新手，较少瓶子', bottleCount: 5, gaveEnable: 10 }],
    [GAME_DIFFICULTY.MEDIUM, {name: '中等', description: '适中难度，平衡挑战', bottleCount: 10, gaveEnable: 10 }],
    [GAME_DIFFICULTY.HARD, {name: '困难', description: '高难度，更多瓶子', bottleCount: 15, gaveEnable: 10 }],
  ]
);
