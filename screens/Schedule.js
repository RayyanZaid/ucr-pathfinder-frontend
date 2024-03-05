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
          console.log("Get from firebase if it exists");
          try {
            const uid = await getUidFromAsyncStorage();
            await api
              .get("/displaySchedule", { params: { uid } })
              .then(async (response) => {
                // console.log(response.data["scheduleDictionaryArray"]);
                console.log("Got schedule from backend");

                try {
                  await saveScheduleToAsyncStorage(
                    response.data["scheduleDictionaryArray"]
                  );
                  setIsSaved(true);

                  console.log("Saved schedule to Async Storage");
                } catch (error) {
                  console.log("Error while saving to Async:", error);
                }
              });
          } catch (error) {
            console.log("Error in overall function:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, []); // Depend on isSaved to re-run this effect

  function handleIsSavedChange(isSaveFromChild) {
    console.log("isSaved state in parent component:", isSaveFromChild);
    setIsSaved(isSaveFromChild);
  }

  // Async function to handle the trash icon press
  const handleDeleteSchedulePress = async () => {
    console.log("Delete Schedule Button");
    const uid = await getUidFromAsyncStorage();
    try {
      await removeFromAsyncStorage("Schedule");
      await api
        .get("/removeSchedule", { params: { uid } })
        .then(async (response) => {
          console.log("Removed schedule from firebase");
        });
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
