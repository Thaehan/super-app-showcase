import {
  clear as finxClear,
  getItem as finxGetItem,
  removeItem as finxRemoveItem,
  setItem as finxSetItem,
} from 'finx-core-rn';

export const FinXStorage = {
  async getItem(key: string) {
    try {
      return finxGetItem(key) ?? null;
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string) {
    try {
      finxSetItem(key, value);
    } catch {
      // ignore
    }
  },
  async removeItem(key: string) {
    try {
      finxRemoveItem(key);
    } catch {
      // ignore
    }
  },
  async clear() {
    try {
      finxClear();
    } catch {
      // ignore
    }
  },
};
