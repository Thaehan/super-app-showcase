import {ScriptManager} from '@callstack/repack/client';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Dev: không set storage, dùng in-memory; Prod: set SMobileStorage (keychain).
if (!__DEV__) {
  const {SMobileStorage} = require('./src/storage/SMobileStorage');
  ScriptManager.shared.setStorage(SMobileStorage);
  console.log('[Storage] Using SMobileStorage (prod)');
} else {
  console.log('[Storage] Using in-memory (dev)');
}

AppRegistry.registerComponent(appName, () => App);
