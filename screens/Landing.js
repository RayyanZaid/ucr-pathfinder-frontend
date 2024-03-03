import {
  ActivityIndicator,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import text_styles from "../styles/text_styles";
import MapWithPath from "../components/MapComponents/PreviewStage";
import EachCourse from "../components/CourseComponents/EachCourse";
import { useEffect, useState } from "react";
import api from "../api";
import button_styles from "../styles/button_styles";
import * as Location from "expo-location";
import NavigationStage from "../components/MapComponents/NavigationStage";
import { sendLocalNotification } from "../functions/sendNotification";
const screenHeight = Dimensions.get("window").height;

var ucrRegion = {
  latitude: 33.9737,
  longitude: -117.3281,
  latitudeDelta: 0.009,
  longitudeDelta: 0.009,
};

export default function LandingScreen() {
  // State Variables

  const [nextClass, setNextClass] = useState(null);

  const [isInNavigation, setIsInNavigation] = useState(false);

  const [minutesUntilNextClass, setMinutesUntilNextClass] = useState(null);

  const toggleNavigation = () => {
    setIsInNavigation(!isInNavigation);
  };

  // Location State Variables

  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [altitude, setAltitude] = useState(null);

  // Navigation State Variables

  const [nodes, setNodes] = useState(null);
  const [edges, setEdges] = useState(null);
  const [minutesNeeded, setMinutesNeeded] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const bufferTime = 40;

    if (nextClass) {
      console.log(minutesUntilNextClass); // This will log the updated state
      console.log(minutesNeeded);

      if (minutesNeeded + bufferTime >= minutesUntilNextClass) {
        const title = "DUDE";
        const body =
          "Your " +
          nextClass["courseNumber"] +
          " class starts in " +
          minutesUntilNextClass +
          " minutes. Start walking bruh";
        sendLocalNotification(title, body);
      }
    }
  }, [minutesUntilNextClass]);

  useEffect(() => {
    const fetchLocationAndGetNavigation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setAltitude(location.coords.altitude);

      try {
        const nextClassData = await getNextClass();

        if (nextClassData != null) {
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

    // Fetches user location every 3 seconds
    const intervalId = setInterval(fetchLocationAndGetNavigation, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const getNavigationData = async (nextClassData, coords) => {
    // console.log("Getting Navigation Data");

    if (nextClassData != "No classes today") {
      // console.log("Getting Navigation data from backend");
      const uid = "rayyanzaid0401@gmail.com";

      let classBuildingName = nextClassData["locationInfo"]["buildingName"];

      try {
        const response = await api.get("/getShortestPath", {
          params: {
            uid,
            latitude: coords.latitude,
            longitude: coords.longitude,
            altitude: coords.altitude,
            classBuildingName,
          },
        });
        if (response) {
          setNodes(response.data["nodes"]);
          setEdges(response.data["edges"]);
          setMinutesNeeded(Math.ceil(response.data["totalTime"]));
          setDistance(Math.ceil(response.data["totalLength"]));
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
    let schedule = await getFromAsyncStorage("Schedule");

    // Assuming the day index is correct
    let currentDayNumber = now.getDay();
    let scheduleCurrentDayIndex = 3;
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

      // Compare only the time part (in minutes) to find the next class

      if (classStartTimeInMinutesPST > currentTimeInMinutesPST) {
        setMinutesUntilNextClass(
          classStartTimeInMinutesPST - currentTimeInMinutesPST
        );
      }
      return classStartTimeInMinutesPST > currentTimeInMinutesPST;
    });

    if (nextClass) {
      // Make Materials Sci until we finish Google Earth
      nextClass["locationInfo"]["buildingName"] =
        "Materials Sci and Engineering";
      // console.log("Next class:", nextClass);
      return nextClass;
    } else {
      // console.log("No more classes for today.");
      return null;
    }
  };

  if (!nextClass) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
        <Text style={text_styles.titleText}>Loading your next class</Text>
      </View>
    );
  } else if (nextClass == "No classes today") {
    return (
      <View style={styles.container}>
        <Text style={text_styles.titleText}>No Classes Today!! :)</Text>
        <Button
          title="Push to send notif"
          onPress={() => sendLocalNotification("title", "body")}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {!isInNavigation ? (
          <>
            <Text style={text_styles.titleText}>
              Path to your {nextClass["courseNumber"]} class
            </Text>
            <MapWithPath
              nodes={nodes}
              edges={edges}
              minutesNeeded={minutesNeeded}
              distance={distance}
            />

            <Button
              onPress={toggleNavigation}
              title="Start Navigation"
              style={button_styles.mediumButton}
            />
            <EachCourse courseData={nextClass} />
          </>
        ) : (
          <>
            <NavigationStage />
            <Button
              onPress={toggleNavigation}
              title="Cancel Navigation"
              style={button_styles.mediumButton}
            />
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
    marginVertical: screenHeight * 0.05,
  },
});
