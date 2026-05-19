import React from 'react';
import 'react-native-url-polyfill/auto';
import {
  NavigationContainer,
  DarkTheme,
} from '@react-navigation/native';

import { createNativeStackNavigator }
from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import MusicScreen from './screens/MusicScreen';
import LightScreen from './screens/LightScreen';
import MoodScreen from './screens/MoodScreen';
import ProfileScreen from './screens/ProfileScreen';
import SmellScreen from './screens/SmellScreen';
import AIScreen from './screens/AIScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  return (

    <NavigationContainer
      theme={{
        ...DarkTheme,

        colors: {
          ...DarkTheme.colors,

          primary: '#A98CFF',

          background: '#080B16',

          card: '#080B16',

          text: '#FFFFFF',

          border: '#080B16',

          notification: '#A98CFF',
        },
      }}
    >

      <Stack.Navigator
        initialRouteName="Home"

        screenOptions={{
          headerShown: false,

          animation: 'slide_from_right',

          contentStyle: {
            backgroundColor: '#080B16',
          },
        }}
      >

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Music"
          component={MusicScreen}
        />

        <Stack.Screen
          name="Light"
          component={LightScreen}
        />

        <Stack.Screen
          name="Mood"
          component={MoodScreen}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />

        <Stack.Screen
          name="Smell"
          component={SmellScreen}
        />

        <Stack.Screen
          name="AI"
          component={AIScreen}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );
}