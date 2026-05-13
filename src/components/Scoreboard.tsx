import type { ScoreboardState } from '../store/gameSlice';

interface ScoreboardProps {
  scoreboard: ScoreboardState;
}

export function Scoreboard({ scoreboard }: ScoreboardProps) {
  return (
    <section aria-label="Player scores" className="rounded-lg bg-white p-4 shadow-sm">
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded bg-slate-100 p-3">
          <div className="font-semibold text-slate-900">X Wins</div>
          <div className="mt-1 text-2xl font-semibold text-blue-700">{scoreboard.xWins}</div>
        </div>
        <div className="rounded bg-slate-100 p-3">
          <div className="font-semibold text-slate-900">O Wins</div>
          <div className="mt-1 text-2xl font-semibold text-blue-700">{scoreboard.oWins}</div>
        </div>
        <div className="rounded bg-slate-100 p-3">
          <div className="font-semibold text-slate-900">Draws</div>
          <div className="mt-1 text-2xl font-semibold text-blue-700">{scoreboard.draws}</div>
        </div>
      </div>
    </section>
  );
}