import {
  clear as finxClear,
  getItem as finxGetItem,
  removeItem as finxRemoveItem,
  setItem as finxSetItem,
} from 'finx-core-rn';

/**
 * Promise-wrapped Keychain storage so it can be plugged into consumers
 * expecting an AsyncStorage-like interface (e.g., ScriptManager cache).
 */
export const FinXStorage = {
  async getItem(key: string) {
    try {
      return finxGetItem(key) ?? null;
    } catch (e) {
      return null;
    }
  },
  async setItem(key: string, value: string) {
    try {
      finxSetItem(key, value);
    } catch (e) {
      // ignore
    }
  },
  async removeItem(key: string) {
    try {
      finxRemoveItem(key);
    } catch (e) {
      // ignore
    }
  },
  async clear() {
    try {
      finxClear();
    } catch (e) {
      // ignore
    }
  },
};
