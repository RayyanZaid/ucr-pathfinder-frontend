import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import UploadICS from "../components/UploadICS";
import { useState } from "react";
import FullScheduleDisplay from "../components/FullScheduleDisplay";

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
        <FullScheduleDisplay />
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
