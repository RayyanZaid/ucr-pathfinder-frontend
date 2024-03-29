import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScheduleScreen from "./screens/Schedule";
import LandingScreen from "./screens/Landing";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import TestForNotifications from "./TestingInstallations/TestForNotifications";
import { getUidFromAsyncStorage } from "./functions/getFromAsyncStorage";
import SignIn from "./screens/SignIn";

import { LogBox } from "react-native";
import LogoutButton from "./components/AuthComponents/LogoutButton";
LogBox.ignoreAllLogs(); // Ignore all log notifications
// Custom hook for polling AsyncStorage

const globalScreenOptions = {
  headerShown: true,
  headerRight: () => <LogoutButton />,
  headerStyle: {
    backgroundColor: "white",
  },

  headerTitle: "",
};

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

    const id = setInterval(fetchValue, interval); // Start polling

    return () => {
      isMounted = false;
      clearInterval(id); // Cleanup
    };
  }, [key, interval]);

  return value;
}

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
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      })
    ).data;
    // console.log(token);
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

const Tab = createBottomTabNavigator();

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
  } else if (uid === null) {
    return (
      <View style={styles.container}>
        <SignIn />
      </View>
    );
  } else if (schedule === null) {
    return (
      <View style={styles.container}>
        <ScheduleScreen />
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={globalScreenOptions}>
          <Tab.Screen name="Landing" component={LandingScreen} />
          <Tab.Screen name="Schedule" component={ScheduleScreen} />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
