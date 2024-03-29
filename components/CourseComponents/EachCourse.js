import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import text_styles from "../../styles/text_styles";

import { getShortestPath } from "../../functions/getShortestPath";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import * as Location from "expo-location";
import MapWithPath from "../MapComponents/PreviewStage";

export default function EachCourse({ courseData }) {
  const [location, setLocation] = useState(null);

  const [nodes, setNodes] = useState(null);
  const [edges, setEdges] = useState(null);
  const [minutesNeeded, setMinutesNeeded] = useState(null);
  const [distance, setDistance] = useState(null);

  const [isFlipped, setIsFlipped] = useState(false);

  const [pressStart, setPressStart] = useState(null);

  const handlePressIn = () => {
    console.log("pin\n");
    setPressStart(Date.now());
  };

  const handlePressOut = () => {
    console.log(Date.now() - pressStart);
    if (Date.now() - pressStart > 100) {
      console.log("long press or pan\n");
    } else {
      console.log("short press\n");
      setIsFlipped(!isFlipped);
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        let classBuildingName = courseData["locationInfo"]["buildingName"];
        let roomName = courseData["locationInfo"]["roomNumber"];
        // console.log(roomName);
        const response = await getShortestPath(
          location.coords,
          classBuildingName,
          roomName
        );

        if (response) {
          setNodes(response["nodes"]);
          setEdges(response["edges"]);
          setMinutesNeeded(response["minutesNeeded"]);
          setDistance(response["distance"]);
        }
      } catch (error) {
        console.error("Error fetching navigation data:", error);
      }
    };

    fetchData();
  }, [courseData, isFlipped]);

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.courseContainer}>
        {!isFlipped ? (
          <>
            <Text style={text_styles.scheduleCourseText}>
              {getCourseNumber()}
            </Text>
            <Text style={text_styles.locationText}>{getLocation()}</Text>
            <Text
              style={[
                text_styles.teacherText,
                { fontSize: getTeacherName().fontSize },
              ]}
            >
              {getTeacherName().name}
            </Text>
            <Text style={text_styles.timeRangeText}>{getTimeRange()}</Text>
          </>
        ) : (
          <MapWithPath
            nodes={nodes}
            edges={edges}
            minutesNeeded={minutesNeeded}
            distance={distance}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  courseContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: screenHeight * 0.03,
    borderWidth: 2,
    borderRadius: 15,

    backgroundColor: "#ADD8E6",
    width: screenWidth * 0.8,
    height: screenHeight * 0.2,
  },

  emptyCourseContainer: {
    justifyContent: "center",
    marginVertical: screenHeight * 0.03,
    borderWidth: 2,
    borderRadius: 15,

    backgroundColor: "black",
    width: screenWidth * 0.8,
    height: screenHeight * 0.2,
  },
});
