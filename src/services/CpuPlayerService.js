export class CpuPlayerService {
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  chooseMove(board) {
    const available = board.map((cell, index) => (cell ? null : index)).filter((value) => value !== null);
    if (available.length === 0) return null;
    const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7].find((index) => available.includes(index));
    return preferred ?? available[0];
  }
}