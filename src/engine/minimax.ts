import { GAME_STATUS, SYMBOLS, type CellValue, type SymbolValue } from '../constants/gameConstants';
import { detectWin } from './winDetection';

const CPU: SymbolValue = SYMBOLS.O;
const HUMAN: SymbolValue = SYMBOLS.X;

function availableMoves(board: CellValue[]): number[] {
  return board.flatMap((cell, index) => (cell === null ? [index] : []));
}

function scoreTerminal(board: CellValue[], depth: number): number | null {
  const result = detectWin(board);
  if (result.status === GAME_STATUS.WIN) {
    if (result.winner === CPU) return 10 - depth;
    if (result.winner === HUMAN) return depth - 10;
  }
  if (result.status === GAME_STATUS.DRAW) return 0;
  return null;
}

function minimax(board: CellValue[], isMaximizing: boolean, depth: number): number {
  const terminalScore = scoreTerminal(board, depth);
  if (terminalScore !== null) return terminalScore;

  const moves = availableMoves(board);
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of moves) {
      const nextBoard = [...board];
      nextBoard[move] = CPU;
      bestScore = Math.max(bestScore, minimax(nextBoard, false, depth + 1));
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (const move of moves) {
    const nextBoard = [...board];
    nextBoard[move] = HUMAN;
    bestScore = Math.min(bestScore, minimax(nextBoard, true, depth + 1));
  }
  return bestScore;
}

export function getBestMove(board: CellValue[]): number {
  const moves = availableMoves(board);
  if (moves.length === 0) return -1;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const nextBoard = [...board];
    nextBoard[move] = CPU;
    const score = minimax(nextBoard, false, 1);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}