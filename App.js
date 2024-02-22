import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ScheduleScreen from "./screens/Schedule";

import { useFonts } from "expo-font";
import LandingScreen from "./screens/Landing";

export default function App() {
  const [fontsLoaded] = useFonts({
    Gabarito: require("./assets/fonts/Gabarito-VariableFont_wght.ttf"),
  });

  if (fontsLoaded) {
    return (
      <View style={styles.container}>
        <ScheduleScreen />
        {/* <LandingScreen /> */}
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2AE7F",
  },
});
