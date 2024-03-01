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
        setNextClass(nextClassData);

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
    console.log("Getting Navigation data from backend");
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
  };

  // Function to adjust Date object to PST (UTC-8) for display purposes
  function convertToPST(dateObj) {
    // Calculate the time offset in milliseconds (8 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const offset = 8 * 60 * 60 * 1000;
    // Create a new Date object adjusted for PST
    const pstDate = new Date(dateObj.getTime() - offset);

    // Format the date for display (optional, for clarity)
    // Note: This is just for display, the Date object remains in local time
    return pstDate.toISOString().replace("Z", " PST"); // ISO string adjusted for PST
  }

  const getNextClass = async () => {
    const now = new Date();
    const currentTimePST = convertToPST(now);
    console.log(currentTimePST);
    // Get the current time in hours and minutes
    const currentHours = now.getUTCHours();
    const currentMinutes = now.getUTCMinutes();

    let schedule = await getFromAsyncStorage("Schedule");

    // Adjusting the index if necessary
    let currentDayNumber = now.getUTCDay();
    let scheduleCurrentDayIndex = currentDayNumber - 1;
    let currentDayClasses = schedule[scheduleCurrentDayIndex] || [];

    if (currentDayClasses.length === 0) {
      console.log("No classes today");
      return; // Exit if there are no classes today
    }

    // Process to find the next class based on time comparison
    const nextClass = currentDayClasses.find((eachClass) => {
      // Convert the startTime to a Date object
      const classStartTimeString = eachClass["timeInfo"]["startTime"];
      const classStartTimeDataObject = new Date(classStartTimeString);

      // Convert and display the date in PST
      const pstDateDisplay = convertToPST(classStartTimeDataObject);
      console.log(pstDateDisplay);
    });

    if (nextClass) {
      console.log("Next class:", nextClass);
    } else {
      console.log("No more classes for today.");
    }
  };

  if (!nextClass) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
        <Text style={text_styles.titleText}>Loading your next class</Text>
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
