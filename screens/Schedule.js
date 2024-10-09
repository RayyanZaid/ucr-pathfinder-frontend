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
import {
  getScheduleFromAsyncStorage,
  getUidFromAsyncStorage,
} from "../functions/getFromAsyncStorage";
import api from "../api";
import { saveScheduleToAsyncStorage } from "../functions/saveToAsyncStorage";
import LogoutButton from "../components/AuthComponents/LogoutButton";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ScheduleScreen() {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchAndSaveSchedule = async () => {
      try {
        // Fetch schedule from API
        const uid = await getUidFromAsyncStorage();
        console.log("fetching schedule");
        const response = await api.get("/displaySchedule", { params: { uid } });
        const schedule = response.data["scheduleDictionaryArray"];
        console.log("scheuile", schedule);

        // Save schedule to async storage
        await saveScheduleToAsyncStorage(schedule);
        setIsSaved(true);
      } catch (error) {
        console.log("Error fetching and saving schedule:", error);
      }
    };

    // Check if schedule exists in async storage
    const checkScheduleExists = async () => {
      try {
        const schedule = await getScheduleFromAsyncStorage();
        if (schedule !== null) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error("Error fetching schedule from async storage:", error);
      }
    };

    checkScheduleExists(); // Check if schedule exists in async storage
    fetchAndSaveSchedule(); // Fetch schedule from API and save to async storage
  }, []);

  const handleDeleteSchedulePress = async () => {
    console.log("Delete Schedule Button");
    const uid = await getUidFromAsyncStorage();
    try {
      await removeFromAsyncStorage("Schedule");
      await api.get("/removeSchedule", { params: { uid } });
      console.log("Removed schedule from firebase");
      setIsSaved(false);
    } catch (error) {
      console.log("Error deleting schedule:", error);
    }
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
        <View style={styles.logoutContainer}>
          <LogoutButton />
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
          <UploadICS onIsSavedChange={setIsSaved} />
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
    backgroundColor: "white",
  },

  logoutContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginTop: 40,
  },

  trashIcon: {
    position: "absolute",
    left: screenWidth * 0.05,
    top: screenHeight * 0.01, // Adjusted for top right position
    zIndex: 10,
  },
});
