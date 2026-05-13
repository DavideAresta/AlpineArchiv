import { describe, expect, it } from 'vitest';
import { detectWin } from '../../src/engine/winDetection';
import { SYMBOLS } from '../../src/constants/gameConstants';

describe('detectWin', () => {
  it('detects horizontal wins', () => {
    const result = detectWin([SYMBOLS.X, SYMBOLS.X, SYMBOLS.X, null, null, null, null, null, null]);
    expect(result.status).toBe('WIN');
    expect(result.winner).toBe('X');
  });

  it('detects draws', () => {
    const result = detectWin([
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X'
    ]);
    expect(result.status).toBe('DRAW');
    expect(result.winner).toBeNull();
  });

  it('detects in-progress boards', () => {
    const result = detectWin([null, 'O', null, null, 'X', null, null, null, null]);
    expect(result.status).toBe('IN_PROGRESS');
  });
});