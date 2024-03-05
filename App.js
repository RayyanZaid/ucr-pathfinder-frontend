import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScheduleScreen from "./screens/Schedule";
import LandingScreen from "./screens/Landing";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignIn from "./screens/SignIn";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs(); // Ignore all log notifications
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import TestForNotifications from "./TestingInstallations/TestForNotifications";

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
    console.log(token);
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
  const schedule = useAsyncStoragePolling("Schedule");
  const uid = "Vv5dp03BRhSwMqRcYPnoeaf1frA2";
  console.log(uid);

  // console.log(uid);
  const [fontsLoaded] = useFonts({
    Gabarito: require("./assets/fonts/Gabarito-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  if (!fontsLoaded) {
    return <View />;
  } else if (uid == null) {
    return (
      <View style={styles.container}>
        <SignIn />
      </View>
    );
  } else if (schedule == null) {
    return (
      <View style={styles.container}>
        <ScheduleScreen />
        <StatusBar style="auto" />
      </View>
    );
  } else {
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
