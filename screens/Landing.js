import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import text_styles from "../styles/text_styles";
import MapWithPath from "../components/MapComponents/PreviewStage";
import EachCourse from "../components/CourseComponents/EachCourse";
import api from "../api";
import button_styles from "../styles/button_styles";
import * as Location from "expo-location";
import NavigationStage from "../components/MapComponents/NavigationStage";
import { sendLocalNotification } from "../functions/sendNotification";
import LogoutButton from "../components/AuthComponents/LogoutButton";
import {
  getScheduleFromAsyncStorage,
  getUidFromAsyncStorage,
} from "../functions/getFromAsyncStorage";

import { getShortestPath } from "../functions/getShortestPath";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function LandingScreen() {
  const [nextClass, setNextClass] = useState(null);
  const [isInNavigation, setIsInNavigation] = useState(false);
  const [minutesUntilNextClass, setMinutesUntilNextClass] = useState(null);
  const [location, setLocation] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [edges, setEdges] = useState(null);
  const [minutesNeeded, setMinutesNeeded] = useState(null);
  const [distance, setDistance] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [nextClassStartTime, setNextClassStartTime] = useState(null);

  const toggleNavigation = () => {
    setIsInNavigation(!isInNavigation);
  };

  const convertMinutesToFormattedTime = (minutesSinceMidnight) => {
    const hours = Math.floor(minutesSinceMidnight / 60);
    const minutes = minutesSinceMidnight % 60;
    const hourIn12HourFormat = hours % 12 === 0 ? 12 : hours % 12; // Converts 0 hours to 12 for both midnight and noon
    const amPm = hours < 12 ? "AM" : "PM";
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Adds leading zero to minutes if less than 10

    return `${hourIn12HourFormat}:${formattedMinutes} ${amPm}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const bufferTime = 65;

      if (
        nextClass &&
        !notificationSent &&
        minutesNeeded + bufferTime >= minutesUntilNextClass
      ) {
        if (nextClass["courseNumber"] == null) {
          return;
        }
        const title =
          nextClass["courseNumber"] +
          " at " +
          convertMinutesToFormattedTime(nextClassStartTime);
        const body = "Start walking now";

        console.log("Sending notification...");
        await sendLocalNotification(title, body);

        setNotificationSent(true);
        console.log("Notification sent.");
      }
    };

    fetchData();
  }, [minutesUntilNextClass, notificationSent]);

  useEffect(() => {
    setNotificationSent(false);

    console.log("nextClass changed to:", nextClass);
  }, [JSON.stringify(nextClass)]);

  useEffect(() => {
    const fetchLocationAndGetNavigation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      try {
        const nextClassData = await getNextClass();

        if (nextClassData) {
          setNextClass(nextClassData);
        } else {
          return;
        }

        if (nextClassData && location.coords) {
          await getNavigationData(nextClassData, location.coords);
        }
      } catch (error) {
        console.error("Error in sequence operations:", error);
      }
    };

    // Call the function immediately to run once on component mount.
    fetchLocationAndGetNavigation();

    // Then set up the interval to repeat it.
    const intervalId = setInterval(fetchLocationAndGetNavigation, 5000); // Adjust the interval as needed.

    // Cleanup on component unmount.
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setNotificationSent(false);

    console.log("nextClass changed to:", nextClass);
  }, [JSON.stringify(nextClass)]);

  useEffect(() => {
    const fetchLocationAndGetNavigation = async () => {
      console.log("Inital Fetch");
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      try {
        const nextClassData = await getNextClass();

        if (nextClassData) {
          setNextClass(nextClassData);
        } else {
          return;
        }

        if (nextClassData && location.coords) {
          await getNavigationData(nextClassData, location.coords);
        }
      } catch (error) {
        console.error("Error in sequence operations:", error);
      }
    };

    // Call the function immediately to run once on component mount.
    fetchLocationAndGetNavigation();
  }, []);

  const getNavigationData = async (nextClassData, coords) => {
    if (
      nextClassData !== "No classes today" &&
      nextClassData !== "No more classes today"
    ) {
      let classBuildingName = nextClassData["locationInfo"]["buildingName"];
      let roomName = nextClassData["locationInfo"]["roomNumber"];

      try {
        const response = await getShortestPath(
          coords,
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
    }
  };
  const getNextClass = async () => {
    const now = new Date();
    // Adjust current time to PST for comparison
    // console.log("Getting Next Class");
    let schedule = await getScheduleFromAsyncStorage();

    // Assuming the day index is correct
    let currentDayNumber = now.getDay() - 3;
    let scheduleCurrentDayIndex = currentDayNumber - 1;
    let currentDayClasses = schedule[scheduleCurrentDayIndex] || [];

    if (currentDayClasses.length === 0) {
      return "No classes today";
    }

    const nextClass = currentDayClasses.find((eachClass) => {
      const classStartTimeString = eachClass["timeInfo"]["startTime"];
      // console.log(eachClass["courseNumber"]);
      const classStartTimeDateObject = new Date(classStartTimeString);

      // Extract hours and minutes for current time in PST
      const currentHoursPST = now.getHours();
      const currentMinutesPST = now.getMinutes();
      const currentTimeInMinutesPST = currentHoursPST * 60 + currentMinutesPST;

      // Extract hours and minutes for class start time in PST
      const classStartHoursPST = classStartTimeDateObject.getHours();
      const classStartMinutesPST = classStartTimeDateObject.getMinutes();
      const classStartTimeInMinutesPST =
        classStartHoursPST * 60 + classStartMinutesPST;

      setNextClassStartTime(classStartTimeInMinutesPST);
      // console.log(classStartHoursPST);
      // Compare only the time part (in minutes) to find the next class

      // console.log("Current Time: ", currentTimeInMinutesPST);
      // console.log("Class Start Time: ", classStartTimeInMinutesPST);

      if (classStartTimeInMinutesPST > currentTimeInMinutesPST) {
        setMinutesUntilNextClass(
          classStartTimeInMinutesPST - currentTimeInMinutesPST
        );
      }
      return classStartTimeInMinutesPST > currentTimeInMinutesPST;
    });

    if (nextClass) {
      // Make Materials Sci until we finish Google Earth
      // nextClass["locationInfo"]["buildingName"] =
      //   "Materials Sci and Engineering";
      // console.log("Next class:", nextClass);
      return nextClass;
    } else {
      // console.log("No more classes for today.");
      return "No more classes today";
    }
  };

  if (!nextClass) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={text_styles.titleText}>Loading your next class...</Text>
      </View>
    );
  } else if (
    nextClass === "No classes today" ||
    nextClass === "No more classes today"
  ) {
    return (
      <View style={styles.container}>
        <Text style={text_styles.titleText}>{nextClass}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {isInNavigation ? (
          <>
            <View style={{ flex: 1, width: "100%" }}>
              <NavigationStage
                nodes={nodes}
                edges={edges}
                endNavigation={() => setIsInNavigation(false)}
                isInNavigation={isInNavigation}
              />
              <TouchableOpacity
                onPress={toggleNavigation}
                style={button_styles.navigationButton}
              >
                <Text style={text_styles.buttonText}>Cancel Navigation</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={text_styles.titleText}>
              Path to your {nextClass["courseNumber"]} class
            </Text>
            <View style={styles.mapContainer}>
              <MapWithPath
                nodes={nodes}
                edges={edges}
                minutesNeeded={minutesNeeded}
                distance={distance}
              />
            </View>
            <TouchableOpacity
              onPress={toggleNavigation}
              style={button_styles.navigationButton}
            >
              <Text style={text_styles.buttonText}>Start Navigation</Text>
            </TouchableOpacity>

            <EachCourse courseData={nextClass} />
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "white",
  },
  mapContainer: {
    height: screenHeight * 1,
    width: screenWidth * 1,
  },
});
