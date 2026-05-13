import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ModeSelector } from './components/ModeSelector';
import { Scoreboard } from './components/Scoreboard';
import { GameStatus } from './components/GameStatus';
import { Board } from './components/Board';
import { ResetButton } from './components/ResetButton';
import { useGameState } from './hooks/useGameState';
import { GAME_MODES } from './constants/gameConstants';
import { setMode, resetBoard } from './store/gameSlice';
import type { RootState } from './store/store';
import { useDispatch } from 'react-redux';

function SetupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedMode = useSelector((state: RootState) => state.game.selectedMode);

  useEffect(() => {
    document.title = 'Tic Tac Toe - Setup';
  }, []);

  return (
    <main aria-label="Game setup screen" className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4 py-10">
      <section className="w-full rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Tic Tac Toe</h1>
        <p className="mt-2 text-sm text-slate-600">Choose a mode to start a new match.</p>
        <div className="mt-6">
          <ModeSelector
            selectedMode={selectedMode}
            onSelect={(mode) => dispatch(setMode(mode))}
          />
        </div>
        <button
          type="button"
          aria-label="Start game"
          disabled={selectedMode === null}
          onClick={() => navigate('/play')}
          className="mt-6 inline-flex w-full items-center justify-center rounded bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Start Game
        </button>
      </section>
    </main>
  );
}

function PlayPage() {
  const dispatch = useDispatch();
  const { game, handleCellClick } = useGameState();

  useEffect(() => {
    document.title = 'Tic Tac Toe - Play';
  }, []);

  if (!game.selectedMode) {
    return <Navigate to="/setup" replace />;
  }

  return (
    <main aria-label="Active game board" className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 py-6">
      <header className="rounded-lg bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Tic Tac Toe</h1>
        <p className="mt-1 text-sm text-slate-600">Mode: {game.selectedMode === GAME_MODES.CPU ? 'Unbeatable CPU' : 'Local PvP'}</p>
      </header>

      <Scoreboard scoreboard={game.scoreboard} />
      <GameStatus status={game.status} currentTurn={game.currentTurn} winner={game.winner} />
      <Board board={game.board} winningLine={game.winningLine} onCellClick={handleCellClick} disabled={game.status !== 'IN_PROGRESS'} />
      <ResetButton onClick={() => dispatch(resetBoard())} />
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/play" element={<PlayPage />} />
      <Route path="*" element={<Navigate to="/setup" replace />} />
    </Routes>
  );
}