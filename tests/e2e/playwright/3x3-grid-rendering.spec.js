import { test, expect } from '@playwright/test';

test.describe('3x3 Grid Rendering and Turn Alternation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Select PvP mode to start
    await page.click('button:has-text("Local PvP")');
  });

  test('Given a fresh game session When the board renders Then a 3x3 grid of nine empty cells is displayed with no symbols present', async ({ page }) => {
    // Count cells
    const cells = await page.locator('[data-testid="cell"]');
    await expect(cells).toHaveCount(9);
    
    // Verify all cells are empty
    for (let i = 0; i < 9; i++) {
      const cell = cells.nth(i);
      await expect(cell).toBeEmpty();
      await expect(cell).not.toHaveText(/[XO]/);
    }
  });

  test('Given it is Player X\'s turn When Player X clicks an empty cell Then an X symbol is placed in that cell and the turn switches to Player O', async ({ page }) => {
    // Check initial turn indicator
    await expect(page.locator('[data-testid="turn-indicator"]')).toContainText(/Player X.*turn/i);
    
    // Click first cell
    const firstCell = page.locator('[data-testid="cell"]').first();
    await firstCell.click();
    
    // Verify X appears
    await expect(firstCell).toHaveText('X');
    
    // Verify turn switched to O
    await expect(page.locator('[data-testid="turn-indicator"]')).toContainText(/Player O.*turn/i);
  });

  test('Given a cell already contains a symbol When any player clicks that cell Then no change occurs and the turn does not advance', async ({ page }) => {
    // Place X in first cell
    const firstCell = page.locator('[data-testid="cell"]').first();
    await firstCell.click();
    
    // Record current turn indicator
    const turnBefore = await page.locator('[data-testid="turn-indicator"]').textContent();
    
    // Click same cell again
    await firstCell.click();
    
    // Verify cell still has X (not O or empty)
    await expect(firstCell).toHaveText('X');
    
    // Verify turn didn't change
    const turnAfter = await page.locator('[data-testid="turn-indicator"]').textContent();
    expect(turnAfter).toBe(turnBefore);
  });

  test('Given Player O has just moved When the board is inspected Then the active turn indicator shows Player X as the next player', async ({ page }) => {
    // Make two moves: X then O
    const cells = page.locator('[data-testid="cell"]');
    await cells.nth(0).click(); // X
    await cells.nth(1).click(); // O
    
    // Verify turn indicator shows X
    await expect(page.locator('[data-testid="turn-indicator"]')).toContainText(/Player X.*turn/i);
  });
});