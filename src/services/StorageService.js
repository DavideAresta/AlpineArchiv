export class StorageService {
  constructor(storage) {
    this.storage = storage;
  }

  get(key, fallbackValue = null) {
    try {
      const raw = this.storage.getItem(key);
      if (raw === null) return fallbackValue;
      return JSON.parse(raw);
    } catch {
      return fallbackValue;
    }
  }

  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    this.storage.removeItem(key);
  }
}