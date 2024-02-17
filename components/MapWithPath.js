import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { Dimensions, StyleSheet, View, Text } from "react-native";

import * as Location from "expo-location";
import text_styles from "../styles/text_styles";
import { useEffect, useState } from "react";
import api from "../api";

var ucrRegion = {
  latitude: 33.9737,
  longitude: -117.3281,
  latitudeDelta: 0.009,
  longitudeDelta: 0.009,
};

const screenHeight = Dimensions.get("window").height;

const MapWithPath = () => {
  const [location, setLocation] = useState(null);
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
  };

  const getTimeAndDistance = async () => {
    let cumulativeTime = 0;
    let cumulativeDistance = 0;
    for (let i = 0; i < edges.length; i++) {
      let eachTime = edges[i]["time"];
      let eachDistance = edges[i]["distance"];

      cumulativeTime += eachTime;
      cumulativeDistance += eachDistance;
    }

    setMinutesNeeded(Math.ceil(cumulativeTime));
    setDistance(cumulativeDistance);
  };
  const getPath = async () => {
    console.log("This runs every 1 second");

    const uid = "rayyanzaid0401@gmail.com";
    try {
      api.get("/getShortestPath", { params: { uid } }).then((response) => {
        if (response) {
          setNodes(response.data["nodes"]);
          setEdges(response.data["edges"]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (edges) {
      // This checks if edges is not null
      getTimeAndDistance(); // Now we call getTimeAndDistance
    }
  }, [edges]); // This useEffect depends on changes to edges

  useEffect(() => {
    const fetchData = async () => {
      await fetchLocation(); // Wait for fetchLocation to complete
      await getPath(); // Then call getPath
    };

    fetchData();

    // Then set up the interval to repeat both in sequence every second
    const combinedInterval = setInterval(fetchData, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(combinedInterval);
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

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
              strokeColor="#EC6D67" // black
              strokeWidth={6}
            />
          ))}
      </MapView>
      <Text style={text_styles.timeText}>ETA: {minutesNeeded} mins</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "50%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: screenHeight * 0.01,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapWithPath;
