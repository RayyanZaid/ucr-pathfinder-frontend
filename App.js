import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScheduleScreen from "./screens/Schedule";
import LandingScreen from "./screens/Landing";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

function useAsyncStoragePolling(key, interval = 1000) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchValue = async () => {
      const storedValue = await AsyncStorage.getItem(key);
      if (isMounted) {
        setValue(storedValue ? JSON.parse(storedValue) : null);
      }
    };

    fetchValue(); // Initial fetch

    const id = setInterval(fetchValue, interval); // Start polling

    return () => {
      isMounted = false;
      clearInterval(id); // Cleanup
    };
  }, [key, interval]);

  return value;
}

const Tab = createBottomTabNavigator();

export default function App() {
  const schedule = useAsyncStoragePolling("Schedule");

  const [fontsLoaded] = useFonts({
    Gabarito: require("./assets/fonts/Gabarito-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  if (schedule === null) {
    return (
      <View style={styles.container}>
        <ScheduleScreen />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Landing" component={LandingScreen} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
