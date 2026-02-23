import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'super-app-shared' });

// Sử dụng MMKV cho cả Dev và Prod để đảm bảo persistence (giữ session khi restart).
// Fallback in-memory chỉ dùng khi MMKV throw loĩ thực sự.
const memoryStore: Record<string, string> = {};

const getKey = (key: string) => {
  try {
    const val = storage.getString(key);
    console.log('[AuthService] getKey val:', val);
    return val ?? null; 
  } catch (e) {
    console.warn('AuthService getKey failed', e);
    return memoryStore[key] ?? null;
  }
};

const setKey = (key: string, value: string) => {
  try {
    storage.set(key, value);
  } catch (e) {
    console.warn('AuthService setKey failed', e);
    memoryStore[key] = value;
  }
};

const removeKey = (key: string) => {
  try {
    storage.delete(key);
  } catch (e) {
    console.warn('AuthService removeKey failed', e);
    delete memoryStore[key];
  }
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
