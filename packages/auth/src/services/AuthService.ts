import {getItem, setItem, removeItem} from 'finx-core-rn';
// Ưu tiên Keychain (FinXCoreRN); fallback bộ nhớ nếu lỗi/không khả dụng.
const memoryStore: Record<string, string> = {};
const useKeychain = !__DEV__; // chỉ bật keychain ở prod để tránh xung đột dev.

const getKey = (key: string) => {
  if (useKeychain) {
    try {
      return getItem(key);
    } catch (e) {
      console.warn('AuthService getKey keychain failed, fallback memory', e);
    }
  }
  return memoryStore[key] ?? null;
};

const setKey = (key: string, value: string) => {
  if (useKeychain) {
    try {
      setItem(key, value);
      return;
    } catch (e) {
      console.warn('AuthService setKey keychain failed, fallback memory', e);
    }
  }
  memoryStore[key] = value;
};

const removeKey = (key: string) => {
  if (useKeychain) {
    try {
      removeItem(key);
      return;
    } catch (e) {
      console.warn('AuthService removeKey keychain failed, fallback memory', e);
    }
  }
  delete memoryStore[key];
};

class AuthService {
  TOKEN_KEY = 'token';

  async getCredentials(): Promise<string | null> {
    const value = getKey(this.TOKEN_KEY);
    if (__DEV__) {
      console.log('[AuthService] getCredentials dev value:', value);
    }
    return value;
  }

  async setCredentials(token: string): Promise<void> {
    setKey(this.TOKEN_KEY, token);
    if (__DEV__) {
      console.log('[AuthService] setCredentials dev token:', token);
    }
  }

  async removeCredentials(): Promise<void> {
    removeKey(this.TOKEN_KEY);
    if (__DEV__) {
      console.log('[AuthService] removeCredentials dev');
    }
  }

  static shared = new AuthService();
}

export default AuthService;
