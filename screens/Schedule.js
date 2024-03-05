import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UploadICS from "../components/UploadICS";
import FullScheduleDisplay from "../components/CourseComponents/FullScheduleDisplay";
import text_styles from "../styles/text_styles";
import Icon from "react-native-vector-icons/FontAwesome";

import removeFromAsyncStorage from "../functions/removeFromAsyncStorage";
import { getScheduleFromAsyncStorage } from "../functions/getFromAsyncStorage";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ScheduleScreen() {
  const [isSaved, setIsSaved] = useState(false);

  // In ScheduleScreen
  function handleIsSavedChange(isSaveFromChild) {
    setIsSaved(isSaveFromChild); // This should trigger useEffect if isSaved is a dependency
  }

  useEffect(() => {
    // Define the function inside useEffect to avoid defining it on every render
    const fetchSchedule = async () => {
      try {
        let schedule = await getScheduleFromAsyncStorage();
        if (schedule !== null) {
          // If there is a schedule, do something with it (e.g., set state to cause re-render)
          console.log("Schedule found and set");
          setIsSaved(true);
        } else {
          console.log("No schedule found");
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, [isSaved]); // Depend on isSaved to re-run this effect

  function handleIsSavedChange(isSaveFromChild) {
    console.log("isSaved state in parent component:", isSaveFromChild);
    setIsSaved(isSaveFromChild);
  }

  // Async function to handle the trash icon press
  const handleDeleteSchedulePress = async () => {
    console.log("Button");

    try {
      await removeFromAsyncStorage("Schedule");
    } catch (error) {
      console.log(error);
    }
    setIsSaved(false);
  };

  return (
    <View style={styles.container}>
      {isSaved ? (
        <View>
          <TouchableOpacity
            onPress={handleDeleteSchedulePress}
            style={styles.trashIcon}
          >
            <Icon name="trash" size={30} color="#000" />
          </TouchableOpacity>
          <FullScheduleDisplay />
        </View>
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
  trashIcon: {
    position: "absolute",
    right: screenWidth * 0.1,
    top: screenHeight * 0.06, // Adjusted for top right position
    zIndex: 10,
  },
});
