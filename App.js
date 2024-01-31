import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import TestForAxios from "./TestingInstallations/TestForAxios";
import TestForAsync from "./TestingInstallations/TestForAsync";
import TestForMap from "./TestingInstallations/TestForMap";
import TestForSecureStorage from "./TestingInstallations/TestForSecureStorage";
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      {/* <TestForAxios />
      <TestForAsync />
      <TestForMap /> */}
      <TestForSecureStorage />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
