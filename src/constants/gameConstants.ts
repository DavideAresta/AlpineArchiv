export const SYMBOLS = {
  X: 'X',
  O: 'O'
} as const;

export const GAME_MODES = {
  PVP: 'PVP',
  CPU: 'CPU'
} as const;

export const GAME_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  WIN: 'WIN',
  DRAW: 'DRAW'
} as const;

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
] as const;

export type SymbolValue = typeof SYMBOLS[keyof typeof SYMBOLS];
export type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];
export type GameStatusValue = typeof GAME_STATUS[keyof typeof GAME_STATUS];
export type CellValue = SymbolValue | null;

export const INITIAL_BOARD: CellValue[] = Array(9).fill(null);
export const STORAGE_KEY = 'tictactoe.scoreboard.v1';