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

      // Assuming getNextClass and getNavigation are now async functions or handle their promises.
      try {
        const nextClassData = await getNextClass(); // Modify to actually fetch or simulate fetching data
        setNextClass(nextClassData);

        if (nextClassData && location.coords) {
          await getNavigationData(nextClassData, location.coords);
        }
      } catch (error) {
        console.error("Error in sequence operations:", error);
      }
    };

    const intervalId = setInterval(fetchLocationAndGetNavigation, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Assuming this function now accepts parameters and fetches data based on them
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

  const getNextClass = async () => {
    const uid = "rayyanzaid0401@gmail.com"; // This should ideally be dynamic or fetched from user context.
    try {
      const response = await api.get("/getNextClass", { params: { uid } });
      if (response.data && response.data.nextClass) {
        return response.data.nextClass;
      }
      console.error("No next class data found.");
      return null;
    } catch (error) {
      console.error("Error fetching next class data:", error);
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
