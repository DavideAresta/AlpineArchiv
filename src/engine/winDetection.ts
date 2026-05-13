import { GAME_STATUS, WINNING_LINES, type CellValue, type GameStatusValue, type SymbolValue } from '../constants/gameConstants';

export interface WinDetectionResult {
  status: GameStatusValue;
  winner: SymbolValue | null;
  winningLine: readonly number[] | null;
}

export function detectWin(board: CellValue[]): WinDetectionResult {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const value = board[a];
    if (value && value === board[b] && value === board[c]) {
      return { status: GAME_STATUS.WIN, winner: value, winningLine: line };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { status: GAME_STATUS.DRAW, winner: null, winningLine: null };
  }

  return { status: GAME_STATUS.IN_PROGRESS, winner: null, winningLine: null };
}