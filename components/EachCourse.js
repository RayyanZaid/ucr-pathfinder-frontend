import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import React from "react";
import text_styles from "../styles/text_styles";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function EachCourse({ courseData }) {
  function getCourseNumber() {
    const courseNumber = courseData["courseNumber"];

    return courseNumber;
  }

  function getLocation() {
    const locationDict = courseData["locationInfo"];

    const buildingName = locationDict["buildingName"];
    const roomNumber = locationDict["roomNumber"];

    const locationString = buildingName + " " + roomNumber;

    return locationString;
  }

  function getTimeRange() {
    const timeInfoDict = courseData["timeInfo"];

    const endTimeString = timeInfoDict["endTime"];
    const startTimeString = timeInfoDict["startTime"];

    const startTimeGMT = new Date(startTimeString);
    const endTimeGMT = new Date(endTimeString);

    // Set the desired time zone (PST)
    const timeZoneOffset = 0;

    // Convert to PST by adding the time zone offset in minutes
    const startTimePST = new Date(
      startTimeGMT.getTime() + timeZoneOffset * 60 * 1000
    );
    const endTimePST = new Date(
      endTimeGMT.getTime() + timeZoneOffset * 60 * 1000
    );

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

    console.log(formattedStartTimePST);

    const timeRangeString = modifiedStartTime + " — " + formattedEndTimePST;

    return timeRangeString;
  }

  function getTeacherName() {
    const teacherName = courseData["teacherName"];

    return teacherName;
  }
  return (
    <View style={styles.courseContainer}>
      <Text style={text_styles.scheduleCourseText}>{getCourseNumber()}</Text>
      <Text style={text_styles.locationText}> {getLocation()}</Text>
      <Text style={text_styles.teacherText}> {getTeacherName()}</Text>
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
    backgroundColor: "#CEE4B3",
    width: screenWidth * 0.9,
  },
});
