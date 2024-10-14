import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScheduleScreen from "./screens/Schedule";
import LandingScreen from "./screens/Landing";
import SettingsScreen from "./screens/Settings";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import SignIn from "./screens/SignIn";
import { LogBox } from "react-native";
import SettingsButton from "./components/SettingsButton";
import { getUidFromAsyncStorage } from "./functions/getFromAsyncStorage";
import UploadScheduleScreen from "./screens/UploadSchedule";

// Ignore all log warnings
LogBox.ignoreAllLogs();

const globalScreenOptions = {
  headerShown: true,
  headerRight: () => <SettingsButton />, // Settings button appears in the header
  headerStyle: {
    backgroundColor: "white",
  },
  headerTitle: "",
};

const Tab = createBottomTabNavigator();

// Custom hook to poll AsyncStorage for values
function useAsyncStoragePolling(key, interval = 1000) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchValue = async () => {
      const storedValue = await AsyncStorage.getItem(key);
      if (isMounted) {
        if (key === "schedule") {
          setValue(storedValue ? JSON.parse(storedValue) : null);
        } else {
          setValue(storedValue);
        }
      }
    };

    fetchValue(); // Initial fetch
    const id = setInterval(fetchValue, interval); // Poll every interval

    return () => {
      isMounted = false;
      clearInterval(id); // Cleanup on unmount
    };
  }, [key, interval]);

  return value;
}

// Function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notifications!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      })
    ).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function App() {
  const uid = useAsyncStoragePolling("uid");
  const schedule = useAsyncStoragePolling("Schedule");

  const [fontsLoaded] = useFonts({
    Gabarito: require("./assets/fonts/Gabarito-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  if (!fontsLoaded) {
    return <View />;
  }

  if (uid === null) {
    return (
      <View style={styles.container}>
        <SignIn />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={globalScreenOptions}>
        <Tab.Screen name="Landing" component={LandingScreen} />
        <Tab.Screen name="Schedule">
          {() =>
            schedule === null ? <UploadScheduleScreen /> : <ScheduleScreen />
          }
        </Tab.Screen>
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
