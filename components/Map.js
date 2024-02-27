import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";

import * as Location from "expo-location";
import text_styles from "../styles/text_styles";
import { useEffect, useState, useRef } from "react";
import api from "../api";

var ucrRegion = {
  latitude: 33.9737,
  longitude: -117.3281,
  latitudeDelta: 0.009,
  longitudeDelta: 0.009,
};

const screenHeight = Dimensions.get("window").height;

const MapWithPath = ({ classBuildingName }) => {
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [altitude, setAltitude] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  const [nodes, setNodes] = useState(null);
  const [edges, setEdges] = useState(null);

  const [minutesNeeded, setMinutesNeeded] = useState(null);
  const [distance, setDistance] = useState(null);

  // Function to fetch location
  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLatitude(location["coords"]["latitude"]);
    setLongitude(location["coords"]["longitude"]);
    setAltitude(location["coords"]["altitude"]);
  };

  const getNavigationData = async () => {
    console.log("This runs every 1 second");

    const uid = "rayyanzaid0401@gmail.com";
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

  // This useEffect gets the location every 30 seconds
  useEffect(() => {
    fetchLocation(); // Wait for fetchLocation to complete

    // Then set up the interval to repeat both in sequence every second
    const locationFetchInterval = setInterval(fetchLocation, 30000);

    // Clear the interval when the component unmounts
    return () => clearInterval(locationFetchInterval);
  }, []);

  // This useEffect depends on the location state
  useEffect(() => {
    if (location) {
      getNavigationData();
    }
  }, [location]);

  // Show loading indicator if nodes or edges are not loaded yet
  if (!nodes || !edges) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
        <Text style={text_styles.titleText}>Loading map data...</Text>
      </View>
    );
  }

  // Main content with map and markers
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={ucrRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        mapType="satellite"
      >
        {edges &&
          nodes &&
          edges.map((edge, index) => (
            <Polyline
              key={index}
              coordinates={edge.arrayOfCoordinates.map((coord) => ({
                latitude: coord[0],
                longitude: coord[1],
              }))}
              strokeColor="#EC6D67" // red color for visibility
              strokeWidth={6}
            />
          ))}
        {nodes && nodes.length > 0 && (
          <Marker
            coordinate={{
              latitude: parseFloat(nodes[0].location[0]),
              longitude: parseFloat(nodes[0].location[1]),
            }}
            title="Start"
            pinColor="green" // Green color for start
          />
        )}
        {nodes && nodes.length > 0 && (
          <Marker
            coordinate={{
              latitude: parseFloat(nodes[nodes.length - 1].location[0]),
              longitude: parseFloat(nodes[nodes.length - 1].location[1]),
            }}
            title={nodes[nodes.length - 1].name}
            pinColor="blue"
          />
        )}
      </MapView>
      <Text style={text_styles.timeText}>ETA: {minutesNeeded} mins</Text>
      <Text style={text_styles.distanceText}>{distance} ft</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "50%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    margin: screenHeight * 0.01,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapWithPath;
