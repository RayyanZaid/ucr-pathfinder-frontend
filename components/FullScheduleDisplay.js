import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import OneDayScheduleDisplay from "../components/OneDayScheduleDisplay";
import api from "../api";
import Icon from "react-native-vector-icons/FontAwesome";
const screenWidth = Dimensions.get("window").width;

export default function FullScheduleDisplay() {
  const [isSaved, setIsSaved] = useState(true);
  const [scheduleDictionaryArray, setScheduleDictionaryArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // New state to track current index

  const scrollViewRef = useRef();

  useEffect(() => {
    const uid = "rayyanzaid0401@gmail.com";
    api
      .get("/displaySchedule", { params: { uid } })
      .then((response) => {
        setScheduleDictionaryArray(response.data["scheduleDictionaryArray"]);
        // Set initial position based on the current day, adjusted as necessary
        const date = new Date();
        const currentDayNumber = date.getDay() - 1;
        // setCurrentIndex(currentDayNumber); // Initialize currentIndex to the current day
        setCurrentIndex(0);
        const initialPosition = screenWidth * currentDayNumber;
        // scrollViewRef.current.scrollTo({ x: initialPosition, animated: false });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const scrollToNextDay = () => {
    const nextIndex = currentIndex + 1;
    scrollViewRef.current.scrollTo({
      x: screenWidth * nextIndex,
      animated: true,
    });
    setCurrentIndex(nextIndex); // Update currentIndex accordingly
  };

  const scrollToPreviousDay = () => {
    const prevIndex = currentIndex - 1;
    scrollViewRef.current.scrollTo({
      x: screenWidth * prevIndex,
      animated: true,
    });
    setCurrentIndex(prevIndex); // Update currentIndex accordingly
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
        onMomentumScrollEnd={(e) => {
          // Update currentIndex based on scroll position
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentIndex(newIndex);
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
