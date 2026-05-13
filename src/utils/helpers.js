export function formatCellPosition(index) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return `${String.fromCharCode(65 + row)}${col + 1}`;
}

export function getWinningLines() {
  return [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
}

export function isValidCellIndex(index) {
  return Number.isInteger(index) && index >= 0 && index < 9;
}