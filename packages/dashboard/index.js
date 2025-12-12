import {ScriptManager} from '@callstack/repack/client';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Chỉ set storage trong production và load động.
if (!__DEV__) {
  const {FinXStorage} = require('./src/storage/FinXStorage');
  ScriptManager.shared.setStorage(FinXStorage);
}

AppRegistry.registerComponent(appName, () => App);
