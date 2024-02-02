import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import UploadICS from "../components/UploadICS";
import { useState } from "react";

export default function ScheduleScreen() {
  const [isSaved, setIsSaved] = useState(false);

  function handleIsSavedChange(isSaveFromChild) {
    // Handle the isSaved state here
    console.log("isSaved state in parent component:", isSaveFromChild);
    setIsSaved(isSaveFromChild);
  }

  return (
    <View style={styles.container}>
      {isSaved ? (
        <Text>Display Schedule</Text>
      ) : (
        <UploadICS onIsSavedChange={handleIsSavedChange} />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
});
