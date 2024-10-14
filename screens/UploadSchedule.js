import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Linking, StyleSheet, Text, View } from "react-native";
import UploadICS from "../components/UploadICS";
import text_styles from "../styles/text_styles";
import { getScheduleFromAsyncStorage } from "../functions/getFromAsyncStorage";

const screenWidth = Dimensions.get("window").width;

export default function UploadScheduleScreen({ navigation }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkScheduleExists = async () => {
      try {
        const schedule = await getScheduleFromAsyncStorage();
        if (schedule !== null) {
          setIsSaved(true);
          navigation.replace("FullScheduleScreen"); // Navigate if saved
        }
      } catch (error) {
        console.error("Error fetching schedule from async storage:", error);
      }
    };

    checkScheduleExists();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={text_styles.infoText}>Before uploading, go to</Text>
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

      <UploadICS onIsSavedChange={() => setIsSaved(true)} />

      <Text style={text_styles.infoText}>
        Need Help Uploading Your Schedule?
      </Text>
      <Text
        style={text_styles.linkText}
        onPress={() =>
          Linking.openURL("https://www.youtube.com/watch?v=gHxBr6cX3Kg")
        }
      >
        Tutorial Video Here
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
