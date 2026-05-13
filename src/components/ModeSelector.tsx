import { GAME_MODES, type GameMode } from '../constants/gameConstants';

interface ModeSelectorProps {
  selectedMode: GameMode | null;
  onSelect: (mode: GameMode) => void;
}

export function ModeSelector({ selectedMode, onSelect }: ModeSelectorProps) {
  return (
    <fieldset aria-label="Select game mode" className="w-full">
      <legend className="sr-only">Select game mode</legend>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          aria-label="Local Player vs Player option"
          aria-pressed={selectedMode === GAME_MODES.PVP}
          onClick={() => onSelect(GAME_MODES.PVP)}
          className={`flex-1 rounded border px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedMode === GAME_MODES.PVP ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400'}`}
        >
          Local PvP
        </button>
        <button
          type="button"
          aria-label="Unbeatable CPU option"
          aria-pressed={selectedMode === GAME_MODES.CPU}
          onClick={() => onSelect(GAME_MODES.CPU)}
          className={`flex-1 rounded border px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedMode === GAME_MODES.CPU ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400'}`}
        >
          Vs CPU
        </button>
      </div>
    </fieldset>
  );
}