import {getItem, setItem, removeItem} from 'finx-core-rn';

// Sử dụng FinXCoreRN cho cả Dev và Prod để đảm bảo persistence (giữ session khi restart).
// Fallback in-memory chỉ dùng khi FinXCoreRN throw loĩ thực sự.
const memoryStore: Record<string, string> = {};

const getKey = (key: string) => {
  try {
    const val = getItem(key);
    console.log('[AuthService] getKey val:', val);
    // Nếu implementation trả về undefined/null thì fallback? 
    // Giả sử getItem trả về string | null.
    return val; 
  } catch (e) {
    console.warn('AuthService getKey failed', e);
    return memoryStore[key] ?? null;
  }
};

const setKey = (key: string, value: string) => {
  try {
    setItem(key, value);
  } catch (e) {
    console.warn('AuthService setKey failed', e);
    memoryStore[key] = value;
  }
};

const removeKey = (key: string) => {
  try {
    removeItem(key);
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
