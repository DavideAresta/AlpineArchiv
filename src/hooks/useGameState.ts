import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { advanceTurn, applyOutcome, placeSymbol, type GameState } from '../store/gameSlice';
import type { AppDispatch, RootState } from '../store/store';
import { GAME_MODES, GAME_STATUS, SYMBOLS } from '../constants/gameConstants';
import { detectWin } from '../engine/winDetection';
import { getBestMove } from '../engine/minimax';

export function useGameState() {
  const dispatch = useDispatch<AppDispatch>();
  const game = useSelector((state: RootState) => state.game);

  const evaluateBoard = (board: GameState['board']) => {
    const result = detectWin(board);
    if (result.status !== GAME_STATUS.IN_PROGRESS) {
      dispatch(applyOutcome(result));
      return result;
    }
    return result;
  };

  const handleCellClick = (index: number) => {
    if (game.status !== GAME_STATUS.IN_PROGRESS) return;
    if (game.board[index]) return;
    if (game.selectedMode === null) return;
    if (game.selectedMode === GAME_MODES.CPU && game.currentTurn === SYMBOLS.O) return;

    dispatch(placeSymbol(index));
    const nextBoard = [...game.board];
    nextBoard[index] = game.currentTurn;
    const result = detectWin(nextBoard);
    if (result.status !== GAME_STATUS.IN_PROGRESS) {
      dispatch(applyOutcome(result));
      return;
    }

    dispatch(advanceTurn());
  };

  useEffect(() => {
    if (game.selectedMode !== GAME_MODES.CPU) return;
    if (game.status !== GAME_STATUS.IN_PROGRESS) return;
    if (game.currentTurn !== SYMBOLS.O) return;

    const timer = window.setTimeout(() => {
      const move = getBestMove(game.board);
      if (move < 0) return;
      dispatch(placeSymbol(move));
      const nextBoard = [...game.board];
      nextBoard[move] = SYMBOLS.O;
      const result = detectWin(nextBoard);
      if (result.status !== GAME_STATUS.IN_PROGRESS) {
        dispatch(applyOutcome(result));
        return;
      }
      dispatch(advanceTurn());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [game.selectedMode, game.currentTurn, game.status, game.board, dispatch]);

  return {
    game,
    handleCellClick,
    evaluateBoard
  };
}