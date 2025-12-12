import {ScriptManager} from '@callstack/repack/client';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Dev: không set storage, dùng in-memory; Prod: set FinXStorage (keychain).
if (!__DEV__) {
  const {FinXStorage} = require('./src/storage/FinXStorage');
  ScriptManager.shared.setStorage(FinXStorage);
  console.log('[Storage] Using FinXStorage (prod)');
} else {
  console.log('[Storage] Using in-memory (dev)');
}

AppRegistry.registerComponent(appName, () => App);
