import { EventBus } from './services/EventBus.js';
import { StorageService } from './services/StorageService.js';
import { ScoreboardService } from './services/ScoreboardService.js';
import { MoveHistoryService } from './services/MoveHistoryService.js';
import { BlitzTimerService } from './services/BlitzTimerService.js';
import { CpuPlayerService } from './services/CpuPlayerService.js';
import { GameEngine } from './services/GameEngine.js';
import { DEFAULT_BLITZ_CONFIG, DEFAULT_GAME_MODE, EVENT_NAMES, SYMBOLS } from './utils/constants.js';
import { formatCellPosition } from './utils/helpers.js';

function renderTemplate(state) {
  const winnerText = state.winner ? `${state.winner} wins!` : state.outcome === 'draw' ? 'Match ended in a draw.' : 'Game in progress.';
  const blitzLabel = state.blitzEnabled ? `Blitz on (${state.blitzDurationSeconds}s)` : 'Blitz off';
  const timerMarkup = state.blitzEnabled
    ? `<section class="card timer-card" aria-label="Blitz countdown timer">
        <div class="card-header">
          <h2 class="card-title">Blitz Timer</h2>
          <span class="badge ${state.timerExpired ? 'badge-error' : state.remainingSeconds <= 3 ? 'badge-warning' : 'badge-neutral'}" aria-label="Time remaining">${state.remainingSeconds}s</span>
        </div>
        <p class="muted">${state.timerMessage}</p>
      </section>`
    : '';

  const movesMarkup = state.moves.length
    ? state.moves.map((move) => `
      <li class="history-item ${move.playerType === 'cpu' ? 'history-item-cpu' : 'history-item-player'}" aria-label="Move history entry">
        <div class="history-index">#${move.moveNumber}</div>
        <div class="history-content">
          <strong>${move.player}</strong>
          <span>${move.symbol} · ${formatCellPosition(move.cellIndex)}</span>
        </div>
        <div class="history-meta">${new Date(move.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </li>`).join('')
    : '<li class="empty-state">No moves yet. Start a match to see the log.</li>';

  const boardCells = state.board.map((cell, index) => {
    const winning = state.winningCells.includes(index);
    const label = cell ? `Cell ${index + 1}, ${cell}` : `Cell ${index + 1}, empty`;
    return `<button class="board-cell ${winning ? 'board-cell-winning' : ''}" data-cell-index="${index}" aria-label="${label}" ${state.phase === 'match-ended' || cell ? '' : ''}>${cell || ''}</button>`;
  }).join('');

  return `
    <main class="page" aria-label="Game session page">
      <header class="hero">
        <div>
          <h1>Tic-Tac-Toe Advanced Features</h1>
          <p class="muted">Local PvP and Vs CPU play with persistent scoreboard, move history, and optional blitz mode.</p>
        </div>
        <div class="hero-status">
          <span class="badge badge-neutral">${state.gameMode === 'cpu' ? 'Vs CPU' : 'Local PvP'}</span>
          <span class="badge ${state.blitzEnabled ? 'badge-warning' : 'badge-neutral'}">${blitzLabel}</span>
        </div>
      </header>

      <section class="layout">
        <section class="card controls-card" aria-label="Game controls">
          <div class="card-header">
            <h2 class="card-title">Game Controls</h2>
            <p class="muted">${winnerText}</p>
          </div>
          <div class="controls-grid">
            <label class="field">
              <span>Game mode</span>
              <select id="gameMode" aria-label="Game mode selector">
                <option value="pvp" ${state.gameMode === 'pvp' ? 'selected' : ''}>Local PvP</option>
                <option value="cpu" ${state.gameMode === 'cpu' ? 'selected' : ''}>Vs CPU</option>
              </select>
            </label>
            <label class="toggle">
              <input id="blitzEnabled" type="checkbox" ${state.blitzEnabled ? 'checked' : ''} aria-label="Toggle blitz mode" />
              <span>Blitz mode</span>
            </label>
            <label class="field">
              <span>Blitz duration</span>
              <input id="blitzDuration" type="number" min="3" max="60" value="${state.blitzDurationSeconds}" aria-label="Blitz duration in seconds" />
            </label>
            <button id="newMatch" class="btn btn-primary" type="button" aria-label="Start new match">New match</button>
            <button id="resetScores" class="btn btn-danger" type="button" aria-label="Reset session scores">Reset scores</button>
          </div>
        </section>

        ${timerMarkup}

        <section class="card board-card" aria-label="Game board">
          <div class="card-header">
            <h2 class="card-title">Board</h2>
            <span class="muted">Turn: ${state.currentPlayer}</span>
          </div>
          <div class="board" role="grid" aria-label="Tic-tac-toe board">
            ${boardCells}
          </div>
        </section>

        <section class="card scoreboard-card" aria-label="Session scoreboard">
          <div class="card-header">
            <h2 class="card-title">Session Scoreboard</h2>
            <button id="scoreboardResetTop" class="btn btn-ghost" type="button" aria-label="Reset session scores">Reset</button>
          </div>
          <div class="scoreboard-grid">
            <div class="score-item"><span>Wins</span><strong>${state.scoreboard.player1Wins}</strong></div>
            <div class="score-item"><span>Losses</span><strong>${state.scoreboard.player1Losses}</strong></div>
            <div class="score-item"><span>Draws</span><strong>${state.scoreboard.draws}</strong></div>
          </div>
          <p class="muted">Last updated: ${state.scoreboard.lastUpdated ? new Date(state.scoreboard.lastUpdated).toLocaleString() : 'Never'}</p>
        </section>

        <section class="card history-card" aria-label="Move history log">
          <div class="card-header">
            <h2 class="card-title">Move History</h2>
            <span class="muted">${state.moves.length} moves</span>
          </div>
          <ul class="history-list">
            ${movesMarkup}
          </ul>
        </section>
      </section>
    </main>
  `;
}

function buildInitialState(services) {
  const scoreboard = services.scoreboardService.getState();
  const blitzConfig = services.blitzTimerService.getConfig();
  return {
    phase: 'loading',
    board: Array(9).fill(''),
    currentPlayer: 'Player 1',
    gameMode: scoreboard.gameMode || DEFAULT_GAME_MODE,
    blitzEnabled: blitzConfig.enabled,
    blitzDurationSeconds: blitzConfig.durationSeconds,
    remainingSeconds: blitzConfig.durationSeconds,
    timerExpired: false,
    timerMessage: 'Blitz mode is disabled.',
    scoreboard,
    moves: services.moveHistoryService.getMoves(),
    winner: null,
    outcome: null,
    winningCells: []
  };
}

export function createApp(rootElement) {
  const eventBus = new EventBus();
  const storageService = new StorageService(window.localStorage);
  const cpuPlayerService = new CpuPlayerService(eventBus);
  const moveHistoryService = new MoveHistoryService(eventBus);
  const blitzTimerService = new BlitzTimerService(eventBus, { ...DEFAULT_BLITZ_CONFIG });
  const scoreboardService = new ScoreboardService(storageService, eventBus);
  const gameEngine = new GameEngine(eventBus, cpuPlayerService, moveHistoryService, blitzTimerService);

  const services = {
    scoreboardService,
    moveHistoryService,
    blitzTimerService,
    gameEngine
  };

  const state = buildInitialState(services);
  state.phase = 'ready';

  function syncState() {
    const engineState = gameEngine.getState();
    state.board = engineState.board;
    state.currentPlayer = engineState.currentPlayer;
    state.gameMode = engineState.gameMode;
    state.blitzEnabled = engineState.blitzEnabled;
    state.blitzDurationSeconds = engineState.blitzDurationSeconds;
    state.remainingSeconds = engineState.remainingSeconds;
    state.timerExpired = engineState.timerExpired;
    state.timerMessage = engineState.timerMessage;
    state.winner = engineState.winner;
    state.outcome = engineState.outcome;
    state.winningCells = engineState.winningCells;
    state.moves = moveHistoryService.getMoves();
    state.scoreboard = scoreboardService.getState();
    state.phase = engineState.outcome ? 'match-ended' : 'playing';
  }

  function render() {
    rootElement.innerHTML = renderTemplate(state);
    const boardButtons = rootElement.querySelectorAll('[data-cell-index]');
    boardButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-cell-index'));
        gameEngine.playMove(index);
        syncState();
        render();
      });
    });

    const newMatch = rootElement.querySelector('#newMatch');
    const resetScores = rootElement.querySelector('#resetScores');
    const scoreboardResetTop = rootElement.querySelector('#scoreboardResetTop');
    const gameMode = rootElement.querySelector('#gameMode');
    const blitzEnabled = rootElement.querySelector('#blitzEnabled');
    const blitzDuration = rootElement.querySelector('#blitzDuration');

    newMatch?.addEventListener('click', () => {
      gameEngine.resetBoard();
      syncState();
      render();
    });

    const resetHandler = () => {
      scoreboardService.reset();
      syncState();
      render();
    };

    resetScores?.addEventListener('click', resetHandler);
    scoreboardResetTop?.addEventListener('click', resetHandler);

    gameMode?.addEventListener('change', (event) => {
      const target = event.target;
      if (target instanceof HTMLSelectElement) {
        gameEngine.updateSettings({ gameMode: target.value });
        syncState();
        render();
      }
    });

    blitzEnabled?.addEventListener('change', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        gameEngine.updateSettings({ blitzEnabled: target.checked });
        syncState();
        render();
      }
    });

    blitzDuration?.addEventListener('change', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        gameEngine.updateSettings({ blitzDurationSeconds: Number(target.value) });
        syncState();
        render();
      }
    });
  }

  const rerender = () => {
    syncState();
    render();
  };

  eventBus.subscribe(EVENT_NAMES.STATE_CHANGED, rerender);
  eventBus.subscribe(EVENT_NAMES.MATCH_CONCLUDED, rerender);
  eventBus.subscribe(EVENT_NAMES.BOARD_RESET, rerender);
  eventBus.subscribe(EVENT_NAMES.GAME_MODE_CHANGED, rerender);
  eventBus.subscribe(EVENT_NAMES.TIMER_TICK, rerender);

  gameEngine.initialize();
  syncState();
  render();

  return {
    destroy() {
      eventBus.clear();
    }
  };
}