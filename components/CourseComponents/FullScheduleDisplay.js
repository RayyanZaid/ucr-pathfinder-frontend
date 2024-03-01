import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";

import OneDayScheduleDisplay from "../CourseComponents/OneDayScheduleDisplay";
import api from "../../api";
import Icon from "react-native-vector-icons/FontAwesome";

import getFromAsyncStorage from "../../functions/getFromAsyncStorage";
const screenWidth = Dimensions.get("window").width;

export default function FullScheduleDisplay() {
  const [scheduleDictionaryArray, setScheduleDictionaryArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();

  useEffect(() => {
    async function fetchSchedule() {
      const schedule = await getFromAsyncStorage("Schedule");

      // Assuming you want to set the schedule to state after fetching
      setScheduleDictionaryArray(schedule);

      const date = new Date();
      let currentDayNumber = date.getDay(); // Get current day (0 for Sunday, 1 for Monday, etc.)

      if (currentDayNumber < 1) {
        currentDayNumber = 1; // If it's Sunday, set it to index 6 (last day of the week)
      }

      if (currentDayNumber > 5) {
        currentDayNumber = 5; // Adjust based on your scheduling needs
      }

      currentDayNumber--; // Adjust because your logic seems to want a 0-based index

      setCurrentIndex(currentDayNumber); // Set currentIndex to the current day
      scrollToCurrentDay(currentDayNumber);
    }

    fetchSchedule();
  }, []); // The empty array means this effect runs once after the initial render

  const scrollToCurrentDay = (dayIndex) => {
    const xPosition = dayIndex * screenWidth;
    scrollViewRef.current.scrollTo({ x: xPosition, animated: true });
  };

  const scrollToNextDay = () => {
    const nextIndex = currentIndex + 1;
    scrollViewRef.current.scrollTo({
      x: screenWidth * nextIndex,
      animated: true,
    });
    setCurrentIndex(nextIndex);
  };

  const scrollToPreviousDay = () => {
    const prevIndex = currentIndex - 1;
    scrollViewRef.current.scrollTo({
      x: screenWidth * prevIndex,
      animated: true,
    });
    setCurrentIndex(prevIndex);
  };

  console.log("Current Index:", currentIndex); // Log current index for debugging

  return (
    <View style={styles.container}>
      {currentIndex > 0 && (
        <TouchableOpacity
          onPress={scrollToPreviousDay}
          style={styles.leftArrow}
        >
          <Icon name="arrow-left" size={30} color="#000" />
        </TouchableOpacity>
      )}

      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        onLayout={() => {
          scrollToCurrentDay(currentIndex);
        }}
      >
        {scheduleDictionaryArray.map((schedule, index) => (
          <OneDayScheduleDisplay
            key={index}
            dayIndex={index}
            scheduleDictionary={schedule}
          />
        ))}
      </ScrollView>
      {currentIndex < scheduleDictionaryArray.length - 1 && (
        <TouchableOpacity onPress={scrollToNextDay} style={styles.rightArrow}>
          <Icon name="arrow-right" size={30} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  leftArrow: {
    position: "absolute",
    left: 10,
    top: "50%",
    zIndex: 10,
  },
  rightArrow: {
    position: "absolute",
    right: 10,
    top: "50%",
    zIndex: 10,
  },
});
