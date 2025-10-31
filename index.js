import 'react-native-gesture-handler'; // le tout 1er import de l'app doit être Gesture Handler car React Navigation en dépend pour tous les gestes (swipe, drag, etc.).
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
