import { DEFAULT_SCOREBOARD, EVENT_NAMES, STORAGE_KEYS } from '../utils/constants.js';

export class ScoreboardService {
  constructor(storageService, eventBus) {
    this.storageService = storageService;
    this.eventBus = eventBus;
    this.state = this.load();
    this.eventBus.subscribe(EVENT_NAMES.MATCH_CONCLUDED, (payload) => this.handleMatchConcluded(payload));
  }

  load() {
    const stored = this.storageService.get(STORAGE_KEYS.SCOREBOARD, null);
    return stored && typeof stored === 'object'
      ? { ...DEFAULT_SCOREBOARD, ...stored }
      : { ...DEFAULT_SCOREBOARD };
  }

  save() {
    this.state.lastUpdated = new Date().toISOString();
    this.storageService.set(STORAGE_KEYS.SCOREBOARD, this.state);
  }

  handleMatchConcluded(payload) {
    if (!payload) return;
    if (payload.outcome === 'draw') {
      this.state.draws += 1;
    } else if (payload.winner === 'Player 1') {
      this.state.player1Wins += 1;
    } else if (payload.winner) {
      this.state.player1Losses += 1;
    }
    if (payload.gameMode) this.state.gameMode = payload.gameMode;
    this.save();
    this.eventBus.emit(EVENT_NAMES.STATE_CHANGED, this.state);
  }

  getState() {
    return { ...this.state };
  }

  reset() {
    this.state = { ...DEFAULT_SCOREBOARD };
    this.storageService.remove(STORAGE_KEYS.SCOREBOARD);
    this.save();
    this.eventBus.emit(EVENT_NAMES.STATE_CHANGED, this.state);
  }
}