import type { CellValue } from '../constants/gameConstants';

interface CellProps {
  index: number;
  value: CellValue;
  isWinningCell?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function Cell({ index, value, isWinningCell = false, disabled = false, onClick }: CellProps) {
  const label = value ? `Marked cell ${index + 1} with ${value}` : `Cell ${index + 1}, place X or O`;
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled || Boolean(value)}
      disabled={disabled || Boolean(value)}
      onClick={onClick}
      className={`flex aspect-square items-center justify-center rounded-lg border text-3xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${isWinningCell ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-300 bg-white text-slate-900 hover:border-blue-400'} ${value ? 'cursor-default' : 'cursor-pointer'} disabled:cursor-not-allowed disabled:opacity-90`}
    >
      <span aria-hidden="true">{value ?? ''}</span>
    </button>
  );
}