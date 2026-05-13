export const EVENT_NAMES = {
  MOVE_MADE: 'MOVE_MADE',
  MATCH_CONCLUDED: 'MATCH_CONCLUDED',
  TURN_FORFEITED: 'TURN_FORFEITED',
  TIMER_TICK: 'TIMER_TICK',
  BOARD_RESET: 'BOARD_RESET',
  GAME_MODE_CHANGED: 'GAME_MODE_CHANGED',
  STATE_CHANGED: 'STATE_CHANGED'
};

export const STORAGE_KEYS = {
  SCOREBOARD: 'ttt_scoreboard',
  MOVE_HISTORY: 'ttt_move_history',
  BLITZ_CONFIG: 'ttt_blitz_config'
};

export const DEFAULT_GAME_MODE = 'pvp';
export const PLAYER_ONE = 'Player 1';
export const PLAYER_TWO = 'Player 2';
export const CPU_PLAYER = 'CPU';
export const SYMBOLS = { X: 'X', O: 'O' };
export const DEFAULT_BLITZ_CONFIG = { enabled: false, durationSeconds: 10 };
export const DEFAULT_SCOREBOARD = {
  player1Wins: 0,
  player1Losses: 0,
  draws: 0,
  gameMode: DEFAULT_GAME_MODE,
  lastUpdated: new Date().toISOString()
};