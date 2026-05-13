import type { CellValue } from '../constants/gameConstants';
import { Cell } from './Cell';

interface BoardProps {
  board: CellValue[];
  winningLine: readonly number[] | null;
  disabled?: boolean;
  onCellClick: (index: number) => void;
}

export function Board({ board, winningLine, disabled = false, onCellClick }: BoardProps) {
  return (
    <section aria-label="Tic-Tac-Toe 3x3 grid" className="rounded-lg bg-white p-4 shadow-sm">
      <div className="grid grid-cols-3 gap-2">
        {board.map((value, index) => (
          <Cell
            key={index}
            index={index}
            value={value}
            disabled={disabled}
            isWinningCell={Boolean(winningLine?.includes(index))}
            onClick={() => onCellClick(index)}
          />
        ))}
      </div>
    </section>
  );
}