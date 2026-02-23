import {ScriptManager} from '@callstack/repack/client';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Use MMKVStorage to cache federated modules
const {MMKVStorage} = require('./src/storage/MMKVStorage');
ScriptManager.shared.setStorage(MMKVStorage);
console.log('[Storage] Using MMKVStorage');

AppRegistry.registerComponent(appName, () => App);
