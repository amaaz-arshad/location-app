/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

// Register the service
ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => App);
