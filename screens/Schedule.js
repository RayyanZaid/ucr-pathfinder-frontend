import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import UploadICS from "../components/UploadICS";
import { useState } from "react";
import OneDayScheduleDisplay from "../components/OneDayScheduleDisplay";

export default function ScheduleScreen() {
  const [isSaved, setIsSaved] = useState(true);

  function handleIsSavedChange(isSaveFromChild) {
    // Handle the isSaved state here
    console.log("isSaved state in parent component:", isSaveFromChild);
    setIsSaved(isSaveFromChild);
  }

  return (
    <View style={styles.container}>
      {isSaved ? (
        <OneDayScheduleDisplay />
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
