import {ScriptManager} from '@callstack/repack/client';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Chỉ set storage trong production và load động.
  const {SMobileStorage} = require('./src/storage/SMobileStorage');
  ScriptManager.shared.setStorage(SMobileStorage);

AppRegistry.registerComponent(appName, () => App);
