import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";

import {
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ImageBackground } from "react-native";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

import AuthScreen from "./screens/AuthScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();

// Prevent Splash Screen from hiding automatically
SplashScreen.preventAutoHideAsync();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    </HomeStack.Navigator>
  );
};

const SearchNavigator = () => {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} />
    </SearchStack.Navigator>
  );
};

const TabNavigator = () => {
  const { currentTheme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: currentTheme.text,
        tabBarInactiveTintColor: currentTheme.text,

        tabBarStyle: {
          borderTopWidth: 0,
        },

        tabBarBackground: () => (
          <ImageBackground
            source={currentTheme.footerBackground}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ),

        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Add") {
            iconName = "add-sharp";
          } else if (route.name === "Search") {
            iconName = "search";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Add" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchNavigator} />
    </Tab.Navigator>
  );
};

const RootNavigation = () => {
  const user = useSelector((state) => state.user.value);
  const isConnected = !!user.token;

  const initialRoute = isConnected ? "TabNavigator" : "Auth";

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once the fonts have been loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't display anything during fonts loading
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <NavigationContainer>
            <RootNavigation />
          </NavigationContainer>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
