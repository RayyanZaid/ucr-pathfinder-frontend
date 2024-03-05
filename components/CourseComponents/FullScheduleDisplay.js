import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import OneDayScheduleDisplay from "../CourseComponents/OneDayScheduleDisplay";
import Icon from "react-native-vector-icons/FontAwesome";

import { getScheduleFromAsyncStorage } from "../../functions/getFromAsyncStorage";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function FullScheduleDisplay() {
  const [scheduleDictionaryArray, setScheduleDictionaryArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();

  useEffect(() => {
    async function fetchSchedule() {
      let schedule = await getScheduleFromAsyncStorage();
      setScheduleDictionaryArray(schedule || []);

      const date = new Date();
      let currentDayNumber = date.getDay();

      if (currentDayNumber < 1) {
        currentDayNumber = 1;
      }

      if (currentDayNumber > 5) {
        currentDayNumber = 5;
      }

      currentDayNumber--;
      setCurrentIndex(currentDayNumber);
      scrollToCurrentDay(currentDayNumber);
    }

    fetchSchedule();
  }, []);

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
