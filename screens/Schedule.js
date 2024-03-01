import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Linking, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UploadICS from "../components/UploadICS";
import FullScheduleDisplay from "../components/CourseComponents/FullScheduleDisplay";
import text_styles from "../styles/text_styles";

import getFromAsyncStorage from "../functions/getFromAsyncStorage";

export default function ScheduleScreen() {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkScheduleSaved = async () => {
      try {
        const schedule = await getFromAsyncStorage("Schedule");
        if (schedule !== null) {
          setIsSaved(true);
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };

    checkScheduleSaved();
  }, []);

  function handleIsSavedChange(isSaveFromChild) {
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
