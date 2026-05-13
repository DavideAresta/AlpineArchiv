import { DEFAULT_BLITZ_CONFIG, EVENT_NAMES, STORAGE_KEYS } from '../utils/constants.js';

export class BlitzTimerService {
  constructor(eventBus, initialConfig = DEFAULT_BLITZ_CONFIG) {
    this.eventBus = eventBus;
    this.config = { ...DEFAULT_BLITZ_CONFIG, ...initialConfig };
    this.remainingSeconds = this.config.durationSeconds;
    this.timerId = null;
    this.eventBus.subscribe(EVENT_NAMES.GAME_MODE_CHANGED, (payload) => this.updateConfig(payload));
    this.eventBus.subscribe(EVENT_NAMES.BOARD_RESET, () => this.cancel());
    this.eventBus.subscribe(EVENT_NAMES.MATCH_CONCLUDED, () => this.cancel());
    this.eventBus.subscribe(EVENT_NAMES.TURN_FORFEITED, () => this.cancel());
  }

  getConfig() {
    return { ...this.config };
  }

  updateConfig(payload) {
    this.config = {
      enabled: typeof payload?.blitzEnabled === 'boolean' ? payload.blitzEnabled : this.config.enabled,
      durationSeconds: Number.isFinite(payload?.blitzDurationSeconds) ? payload.blitzDurationSeconds : this.config.durationSeconds
    };
    this.remainingSeconds = this.config.durationSeconds;
  }

  start() {
    this.cancel();
    if (!this.config.enabled) return;
    this.remainingSeconds = this.config.durationSeconds;
    this.eventBus.emit(EVENT_NAMES.TIMER_TICK, { remainingSeconds: this.remainingSeconds });
    this.timerId = window.setInterval(() => {
      this.remainingSeconds -= 1;
      this.eventBus.emit(EVENT_NAMES.TIMER_TICK, { remainingSeconds: this.remainingSeconds });
      if (this.remainingSeconds <= 0) {
        this.cancel();
        this.eventBus.emit(EVENT_NAMES.TURN_FORFEITED, { forfeitedPlayer: null, gameMode: null });
      }
    }, 1000);
  }

  reset() {
    this.start();
  }

  cancel() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}