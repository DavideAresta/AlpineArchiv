import { GAME_STATUS, SYMBOLS, type GameStatusValue, type SymbolValue } from '../constants/gameConstants';

interface GameStatusProps {
  status: GameStatusValue;
  currentTurn: SymbolValue;
  winner: SymbolValue | null;
}

export function GameStatus({ status, currentTurn, winner }: GameStatusProps) {
  let message = '';
  if (status === GAME_STATUS.IN_PROGRESS) {
    message = `Current turn: ${currentTurn}`;
  } else if (status === GAME_STATUS.WIN) {
    message = `Winner: ${winner}`;
  } else {
    message = 'Game ended in a draw';
  }

  return (
    <section aria-label="Current turn indicator" className="rounded-lg bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-700">{message}</p>
      {status === GAME_STATUS.IN_PROGRESS && currentTurn === SYMBOLS.O && (
        <p className="mt-1 text-xs text-slate-500">CPU thinking may appear briefly in CPU mode.</p>
      )}
    </section>
  );
}