import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { Notifications } from "expo";

const getDeviceToken = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permission to access notifications not granted");
    return;
  }

  const tokenObj = await Notifications.getExpoPushTokenAsync();
  const token = tokenObj.data;
  console.log("Expo Push Token:", token);
  // Send this token to your Flask backend via an API call
};

const TestForNotifications = () => {
  return (
    <View style={styles.container}>
      <Text>Hi</Text>
      <Button title="Push to print token" onPress={getDeviceToken} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TestForNotifications;
