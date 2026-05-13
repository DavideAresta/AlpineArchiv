import { CPU_PLAYER, DEFAULT_GAME_MODE, EVENT_NAMES, PLAYER_ONE, PLAYER_TWO, SYMBOLS } from '../utils/constants.js';
import { getWinningLines, isValidCellIndex } from '../utils/helpers.js';

export class GameEngine {
  constructor(eventBus, cpuPlayerService, moveHistoryService, blitzTimerService) {
    this.eventBus = eventBus;
    this.cpuPlayerService = cpuPlayerService;
    this.moveHistoryService = moveHistoryService;
    this.blitzTimerService = blitzTimerService;
    this.state = this.createInitialState();
    this.eventBus.subscribe(EVENT_NAMES.TURN_FORFEITED, () => this.handleForfeit());
  }

  createInitialState() {
    return {
      board: Array(9).fill(''),
      currentPlayer: PLAYER_ONE,
      currentSymbol: SYMBOLS.X,
      gameMode: DEFAULT_GAME_MODE,
      blitzEnabled: false,
      blitzDurationSeconds: 10,
      remainingSeconds: 10,
      timerExpired: false,
      timerMessage: 'Blitz mode is disabled.',
      winner: null,
      outcome: null,
      winningCells: []
    };
  }

  initialize() {
    this.resetBoard();
  }

  getState() {
    return { ...this.state, board: [...this.state.board], winningCells: [...this.state.winningCells] };
  }

  updateSettings(settings) {
    this.state.gameMode = settings.gameMode || this.state.gameMode;
    this.state.blitzEnabled = typeof settings.blitzEnabled === 'boolean' ? settings.blitzEnabled : this.state.blitzEnabled;
    this.state.blitzDurationSeconds = Number.isFinite(settings.blitzDurationSeconds) ? settings.blitzDurationSeconds : this.state.blitzDurationSeconds;
    this.state.remainingSeconds = this.state.blitzDurationSeconds;
    this.state.timerMessage = this.state.blitzEnabled ? `${this.state.remainingSeconds}s remaining` : 'Blitz mode is disabled.';
    this.eventBus.emit(EVENT_NAMES.GAME_MODE_CHANGED, {
      gameMode: this.state.gameMode,
      blitzEnabled: this.state.blitzEnabled,
      blitzDurationSeconds: this.state.blitzDurationSeconds
    });
    this.eventBus.emit(EVENT_NAMES.STATE_CHANGED, this.getState());
  }

  resetBoard() {
    this.state = { ...this.createInitialState(), gameMode: this.state.gameMode, blitzEnabled: this.state.blitzEnabled, blitzDurationSeconds: this.state.blitzDurationSeconds };
    this.eventBus.emit(EVENT_NAMES.BOARD_RESET, { gameMode: this.state.gameMode, blitzEnabled: this.state.blitzEnabled });
    if (this.state.blitzEnabled) this.blitzTimerService.start();
    this.eventBus.emit(EVENT_NAMES.STATE_CHANGED, this.getState());
  }

  playMove(index) {
    if (!isValidCellIndex(index) || this.state.board[index] || this.state.outcome) return false;
    this.state.board[index] = this.state.currentSymbol;
    const move = {
      moveNumber: this.moveHistoryService.getMoves().length + 1,
      player: this.state.currentPlayer,
      symbol: this.state.currentSymbol,
      cellIndex: index,
      timestamp: new Date().toISOString(),
      playerType: this.state.gameMode === 'cpu' && this.state.currentPlayer === PLAYER_TWO ? 'cpu' : 'player'
    };
    this.eventBus.emit(EVENT_NAMES.MOVE_MADE, move);
    const result = this.checkWinner();
    if (result) {
      this.state.outcome = result.outcome;
      this.state.winner = result.winner;
      this.state.winningCells = result.winningCells;
      this.eventBus.emit(EVENT_NAMES.MATCH_CONCLUDED, { outcome: result.outcome, winner: result.winner, gameMode: this.state.gameMode });
      return true;
    }
    if (this.state.board.every(Boolean)) {
      this.state.outcome = 'draw';
      this.state.winner = null;
      this.eventBus.emit(EVENT_NAMES.MATCH_CONCLUDED, { outcome: 'draw', winner: null, gameMode: this.state.gameMode });
      return true;
    }
    this.toggleTurn();
    if (this.state.gameMode === 'cpu' && this.state.currentPlayer === PLAYER_TWO) {
      const cpuMove = this.cpuPlayerService.chooseMove(this.state.board);
      if (cpuMove !== null) this.playMove(cpuMove);
    }
    if (this.state.blitzEnabled) this.blitzTimerService.reset();
    this.eventBus.emit(EVENT_NAMES.STATE_CHANGED, this.getState());
    return true;
  }

  toggleTurn() {
    this.state.currentPlayer = this.state.currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    this.state.currentSymbol = this.state.currentSymbol === SYMBOLS.X ? SYMBOLS.O : SYMBOLS.X;
  }

  handleForfeit() {
    if (this.state.outcome) return;
    const winner = this.state.currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    this.state.outcome = 'win';
    this.state.winner = winner;
    this.eventBus.emit(EVENT_NAMES.MATCH_CONCLUDED, { outcome: 'win', winner, gameMode: this.state.gameMode });
  }

  checkWinner() {
    for (const line of getWinningLines()) {
      const [a, b, c] = line;
      const symbol = this.state.board[a];
      if (symbol && symbol === this.state.board[b] && symbol === this.state.board[c]) {
        return { outcome: 'win', winner: symbol === SYMBOLS.X ? PLAYER_ONE : this.state.gameMode === 'cpu' && symbol === SYMBOLS.O ? CPU_PLAYER : PLAYER_TWO, winningCells: line };
      }
    }
    return null;
  }
}