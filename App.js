import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './Screens/OnboardingScreen';
import Profile from './Screens/Profile';
import HomeScreen from './Screens/HomeScreen';
import SplashScreen from './Screens/SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user');
      // if user exists, setHasUser will be true
      // because !! converts the value to a boolean
      // and AsyncStorage.getItem returns null if the key is not found
      setHasUser(!!user);
      setIsLoading(false);
    };
    checkUser();
  }, []);

  if (isLoading) return <SplashScreen/>; // or a custom loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName={hasUser ? "Home" : "Onboarding"}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profilescreen" component={Profile} />
        <Stack.Screen name="splashscreen" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
