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

  // Fetching user's current location
  useEffect(() => {
    console.log("Getting User Location");
    const fetchLocation = async () => {
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
    };

    fetchLocation();

    const locationFetchInterval = setInterval(fetchLocation, 1000);

    return () => clearInterval(locationFetchInterval);
  }, []);

  // Fetching the next class data
  useEffect(() => {
    const fetchNextClass = async () => {
      const uid = "rayyanzaid0401@gmail.com";
      try {
        const response = await api.get("/getNextClass", { params: { uid } });
        setNextClass(response.data["nextClass"]);
      } catch (error) {
        console.error("Error fetching next class data:", error);
      }
    };

    fetchNextClass();
  }, []);

  useEffect(() => {
    // Directly check if all required data is present
    if (
      nextClass &&
      latitude != null &&
      longitude != null &&
      altitude != null
    ) {
      getNavigationData();
    }
  }, [nextClass, latitude, longitude, altitude]);

  const toggleNavigation = () => {
    setIsInNavigation(!isInNavigation);
  };

  const getNavigationData = async () => {
    console.log("Getting Navigation data from backend");
    const uid = "rayyanzaid0401@gmail.com";
    let classBuildingName = nextClass["locationInfo"]["buildingName"];
    try {
      api
        .get("/getShortestPath", {
          params: { uid, latitude, longitude, altitude, classBuildingName },
        })
        .then((response) => {
          if (response) {
            setNodes(response.data["nodes"]);
            setEdges(response.data["edges"]);
            setMinutesNeeded(Math.ceil(response.data["totalTime"]));
            setDistance(Math.ceil(response.data["totalLength"]));
          }
        });
    } catch (error) {
      console.log(error);
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
