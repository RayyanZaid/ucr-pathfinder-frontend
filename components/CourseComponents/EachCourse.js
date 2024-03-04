import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import React from "react";
import text_styles from "../../styles/text_styles";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function EachCourse({ courseData }) {
  function getCourseNumber() {
    const courseNumber = courseData["courseNumber"];

    return courseNumber;
  }

  function getLocation() {
    if (courseData["locationInfo"] == null) {
      return "Building Name Room 1";
    }

    const locationDict = courseData["locationInfo"];

    const buildingName = locationDict["buildingName"];
    const roomNumber = locationDict["roomNumber"];

    const locationString = buildingName + " " + roomNumber;

    return locationString;
  }

  function getTimeRange() {
    if (courseData["timeInfo"] == null) {
      return "12:30pm - 1:50";
    }
    const timeInfoDict = courseData["timeInfo"];

    const endTimeString = timeInfoDict["endTime"];
    const startTimeString = timeInfoDict["startTime"];

    const startTimePST = new Date(startTimeString);
    const endTimePST = new Date(endTimeString);

    // Format the PST times as strings
    const options = {
      timeZone: "America/Los_Angeles", // Set the desired time zone (PST)
      hour12: true, // Use 12-hour format
      hour: "numeric", // Display hours
      minute: "numeric", // Display minutes
    };

    const formattedStartTimePST = startTimePST.toLocaleString("en-US", options);

    const modifiedStartTime = formattedStartTimePST.replace(/\s[APap][Mm]/, "");

    const formattedEndTimePST = endTimePST.toLocaleString("en-US", options);

    // console.log(formattedStartTimePST);

    const timeRangeString = modifiedStartTime + " — " + formattedEndTimePST;

    return timeRangeString;
  }

  function getTeacherName() {
    const teacherName = courseData["teacherName"];
    const nameLength = teacherName.length;

    let fontSize = 16; // Default font size

    if (nameLength > 30) {
      fontSize = 10;
    } else if (nameLength > 20) {
      // If the length of teacherName is greater than 20 characters, decrease the font size
      fontSize = 14;
    }

    return { name: teacherName, fontSize: fontSize };
  }

  return (
    <View style={styles.courseContainer}>
      <Text style={text_styles.scheduleCourseText}>{getCourseNumber()}</Text>
      <Text style={text_styles.locationText}> {getLocation()}</Text>
      <Text
        style={[
          text_styles.teacherText,
          { fontSize: getTeacherName().fontSize },
        ]}
      >
        {getTeacherName().name}
      </Text>
      <Text style={text_styles.timeRangeText}>{getTimeRange()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  courseContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: screenHeight * 0.03,
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#ADD8E6",
    width: screenWidth * 0.8,
    height: screenHeight * 0.2,
  },
});
