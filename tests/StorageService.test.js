import { describe, expect, it, beforeEach, vi } from 'vitest';
import { StorageService } from '../src/services/StorageService.js';

describe('StorageService', () => {
  let storage;

  beforeEach(() => {
    storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
  });

  it('returns fallback for missing values', () => {
    storage.getItem.mockReturnValue(null);
    const service = new StorageService(storage);
    expect(service.get('missing', { ok: true })).toEqual({ ok: true });
  });

  it('serializes and stores JSON values', () => {
    const service = new StorageService(storage);
    service.set('key', { value: 1 });
    expect(storage.setItem).toHaveBeenCalledWith('key', '{"value":1}');
  });
});