import { EVENT_NAMES } from '../utils/constants.js';

export class MoveHistoryService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.moves = [];
    this.eventBus.subscribe(EVENT_NAMES.MOVE_MADE, (move) => this.addMove(move));
    this.eventBus.subscribe(EVENT_NAMES.BOARD_RESET, () => this.clear());
  }

  addMove(move) {
    this.moves = [...this.moves, move];
    this.eventBus.emit(EVENT_NAMES.STATE_CHANGED, this.getMoves());
  }

  clear() {
    this.moves = [];
    this.eventBus.emit(EVENT_NAMES.STATE_CHANGED, this.getMoves());
  }

  getMoves() {
    return [...this.moves];
  }
}