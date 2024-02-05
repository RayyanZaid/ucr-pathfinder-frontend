import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import UploadICS from "../components/UploadICS";
import { useEffect, useState } from "react";
import OneDayScheduleDisplay from "../components/OneDayScheduleDisplay";
import api from "../api";
import React, { useRef } from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ScheduleScreen() {
  const [isSaved, setIsSaved] = useState(true);
  const [scheduleDictionaryArray, setScheduleDictionaryArray] = useState([]);

  const scrollViewRef = useRef();

  const scrollToNextDay = () => {
    scrollViewRef.current.scrollTo({
      x: screenWidth * (currentIndex + 1),
      animated: true,
    });
    // Update currentIndex accordingly
  };

  const scrollToPreviousDay = () => {
    scrollViewRef.current.scrollTo({
      x: screenWidth * (currentIndex - 1),
      animated: true,
    });
    // Update currentIndex accordingly
  };

  useEffect(() => {
    const uid = "rayyanzaid0401@gmail.com";

    // Send a GET request with the uid as a query parameter
    api
      .get("/displaySchedule", { params: { uid } })
      .then((response) => {
        // Handle the response data here
        console.log(response.data["scheduleDictionaryArray"]);
        setScheduleDictionaryArray(response.data["scheduleDictionaryArray"]);
        console.log(scheduleDictionaryArray);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error fetching data:", error);
      });
  }, []);

  function handleIsSavedChange(isSaveFromChild) {
    // Handle the isSaved state here
    console.log("isSaved state in parent component:", isSaveFromChild);
    setIsSaved(isSaveFromChild);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={scrollToPreviousDay}></TouchableOpacity>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
      >
        {scheduleDictionaryArray.map((schedule, index) => (
          <OneDayScheduleDisplay
            key={index}
            dayIndex={index}
            scheduleDictionary={schedule}
          />
        ))}
      </ScrollView>
      <TouchableOpacity onPress={scrollToNextDay}></TouchableOpacity>
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
