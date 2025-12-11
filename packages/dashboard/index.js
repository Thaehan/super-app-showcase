import {ScriptManager} from '@callstack/repack/client';
import {AppRegistry} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './src/App';
import {name as appName} from './app.json';

// Only set storage caching in production
// @todo: fix this to be reliable in both dev and prod
if (!__DEV__) {
  ScriptManager.shared.setStorage(AsyncStorage);
}

AppRegistry.registerComponent(appName, () => App);
