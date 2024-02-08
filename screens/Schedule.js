import { StatusBar } from "expo-status-bar";
import { Linking, StyleSheet, Text, View } from "react-native";
import UploadICS from "../components/UploadICS";
import { useState } from "react";
import FullScheduleDisplay from "../components/FullScheduleDisplay";
import text_styles from "../styles/text_styles";

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
        <View style={styles.container}>
          <Text style={text_styles.infoText}>Before uploading, go to </Text>

          <Text
            style={text_styles.linkText}
            onPress={() =>
              Linking.openURL(
                "https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/registrationHistory/registrationHistory"
              )
            }
          >
            Your UCR Class Schedule
          </Text>

          <UploadICS onIsSavedChange={handleIsSavedChange} />
        </View>
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
