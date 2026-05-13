import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GAME_MODES, GAME_STATUS, INITIAL_BOARD, STORAGE_KEY, SYMBOLS, type CellValue, type GameMode, type GameStatusValue, type SymbolValue } from '../constants/gameConstants';
import type { WinDetectionResult } from '../engine/winDetection';

export interface ScoreboardState {
  xWins: number;
  oWins: number;
  draws: number;
}

export interface GameState {
  board: CellValue[];
  currentTurn: SymbolValue;
  status: GameStatusValue;
  winner: SymbolValue | null;
  selectedMode: GameMode | null;
  winningLine: readonly number[] | null;
  scoreboard: ScoreboardState;
  hydrated: boolean;
}

const initialScoreboard = (): ScoreboardState => {
  if (typeof window === 'undefined') return { xWins: 0, oWins: 0, draws: 0 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { xWins: 0, oWins: 0, draws: 0 };
    const parsed = JSON.parse(raw) as ScoreboardState;
    return {
      xWins: Number(parsed.xWins) || 0,
      oWins: Number(parsed.oWins) || 0,
      draws: Number(parsed.draws) || 0
    };
  } catch {
    return { xWins: 0, oWins: 0, draws: 0 };
  }
};

const initialState: GameState = {
  board: [...INITIAL_BOARD],
  currentTurn: SYMBOLS.X,
  status: GAME_STATUS.IN_PROGRESS,
  winner: null,
  selectedMode: null,
  winningLine: null,
  scoreboard: initialScoreboard(),
  hydrated: true
};

const persistScoreboard = (scoreboard: ScoreboardState): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scoreboard));
};

const slice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<GameMode>) {
      state.selectedMode = action.payload;
      state.board = [...INITIAL_BOARD];
      state.currentTurn = SYMBOLS.X;
      state.status = GAME_STATUS.IN_PROGRESS;
      state.winner = null;
      state.winningLine = null;
    },
    placeSymbol(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (state.status !== GAME_STATUS.IN_PROGRESS || state.board[index]) return;
      state.board[index] = state.currentTurn;
    },
    advanceTurn(state) {
      state.currentTurn = state.currentTurn === SYMBOLS.X ? SYMBOLS.O : SYMBOLS.X;
    },
    applyOutcome(state, action: PayloadAction<WinDetectionResult>) {
      state.status = action.payload.status;
      state.winner = action.payload.winner;
      state.winningLine = action.payload.winningLine;
      if (action.payload.status === GAME_STATUS.WIN) {
        if (action.payload.winner === SYMBOLS.X) state.scoreboard.xWins += 1;
        if (action.payload.winner === SYMBOLS.O) state.scoreboard.oWins += 1;
      }
      if (action.payload.status === GAME_STATUS.DRAW) {
        state.scoreboard.draws += 1;
      }
      persistScoreboard(state.scoreboard);
    },
    resetBoard(state) {
      state.board = [...INITIAL_BOARD];
      state.currentTurn = SYMBOLS.X;
      state.status = GAME_STATUS.IN_PROGRESS;
      state.winner = null;
      state.winningLine = null;
    },
    hydrateScoreboard(state) {
      state.scoreboard = initialScoreboard();
      state.hydrated = true;
    }
  }
});

export const { setMode, placeSymbol, advanceTurn, applyOutcome, resetBoard, hydrateScoreboard } = slice.actions;
export const gameReducer = slice.reducer;