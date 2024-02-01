import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import UploadICS from "../components/UploadICS";

export default function ScheduleScreen() {
  return (
    <View style={styles.container}>
      <Text>Schedule Screen</Text>
      <UploadICS />
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
