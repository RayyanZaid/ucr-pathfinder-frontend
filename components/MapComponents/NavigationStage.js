import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import text_styles from "../../styles/text_styles";
import button_styles from "../../styles/button_styles";

const screenHeight = Dimensions.get("window").height;
const NavigationStage = ({ nodes, edges, endNavigation, isInNavigation }) => {
  const isInTesting = false;
  const mapRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [heading, setHeading] = useState(0);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [eta, setEta] = useState(0);

  // Updated function to include heading tracking
  const watchPositionAndHeading = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        const { latitude, longitude, heading } = location.coords;
        const userLocation = { latitude, longitude };
        setCurrentPosition(userLocation);
        setHeading(heading);

        if (isInNavigation && mapRef.current) {
          mapRef.current.animateCamera({
            center: userLocation,
            pitch: 0,
            heading,
            altitude: 1000,
            zoom: 18,
          });
        }
      }
    );
  };

  useEffect(() => {
    if (!isInTesting) {
      watchPositionAndHeading();
    }
    // Add cleanup code if needed, for example to stop watching the position
  }, [isInTesting]); // Dependency array ensures effect runs only once

  function truncateToOneDecimalPlace(value) {
    return Math.round(value);
  }

  // Function to calculate distance between two lat/lng coordinates in kilometers
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  // Function to find the closest node to the user's current location
  const findClosestNode = (userLocation, nodes) => {
    let closestDistance = Infinity;
    let closestNodeIndex = 0;

    nodes.forEach((node, index) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(node.location[0]),
        parseFloat(node.location[1])
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestNodeIndex = index;
      }
    });
    // console.log(closestNodeIndex);
    return closestNodeIndex;
  };

  useEffect(() => {
    // when we are testing (simulate user movement)
    if (isInTesting) {
      // Simulate user movement along the nodes for demonstration (maybe we can demo this idk)
      const interval = setInterval(() => {
        if (currentNodeIndex < nodes.length) {
          const node = nodes[currentNodeIndex];
          setCurrentPosition({
            latitude: parseFloat(node.location[0]),
            longitude: parseFloat(node.location[1]),
          });
          if (mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude: parseFloat(node.location[0]),
                longitude: parseFloat(node.location[1]),
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              },
              100
            );
          }
          setCurrentNodeIndex(currentNodeIndex + 1);
        }
      }, 1000); // Move to the next node every 1 second for demonstration

      return () => clearInterval(interval);
    }
    // when we are NOT testing (get actual user movement)
    else {
      // Use actual user location and find closest node
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setCurrentPosition(userLocation);

        // Find the closest node to the user's location
        const closestNodeIndex = findClosestNode(userLocation, nodes);
        setCurrentNodeIndex(closestNodeIndex); // Set the starting node based on user's location
      })();
    }
  }, [isInTesting, nodes, currentNodeIndex]);

  // Calculate ETA based on edges' time properties
  // Calculate ETA based on edges' time properties
  useEffect(() => {
    console.log("Calculating ETA");
    if (currentNodeIndex > nodes.length - 1) {
      setEta(0); // No more edges to traverse, so ETA should be 0
    } else {
      const remainingEdges = edges.slice(currentNodeIndex); // Start slice from currentNodeIndex

      // console.log(remainingEdges.length);
      if (remainingEdges.length > 0) {
        const remainingEta = remainingEdges.reduce(
          (acc, edge) => acc + edge.time,
          0
        );

        console.log(remainingEta);
        console.log(remainingEdges.length);
        setEta(truncateToOneDecimalPlace(remainingEta));
      } else {
        setEta(0); // If no remaining edges, set ETA to 0
      }
    }
  }, [edges, currentNodeIndex, nodes.length]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        mapType="satellite"
        followUserLocation={!isInTesting} // Follow the user's location
        showsMyLocationButton={true} // Hide the default "My Location" button
        initialRegion={{
          latitude: nodes[0] ? parseFloat(nodes[0].location[0]) : 0,
          longitude: nodes[0] ? parseFloat(nodes[0].location[1]) : 0,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        // Set the heading property to the user's heading
        heading={currentPosition ? currentPosition.heading : 0}
      >
        {edges.map((edge, index) => (
          <Polyline
            key={index}
            coordinates={edge.arrayOfCoordinates.map((coord) => ({
              latitude: parseFloat(coord[0]),
              longitude: parseFloat(coord[1]),
            }))}
            strokeColor="#0000FF" // blue
            strokeWidth={6}
          />
        ))}
        {isInTesting && currentPosition && (
          <Marker coordinate={currentPosition} title="Current Position" />
        )}
      </MapView>
      <View style={styles.overlay}>
        <Text style={text_styles.titleText}>
          ETA: {truncateToOneDecimalPlace(eta)} mins
        </Text>
      </View>
      {currentNodeIndex >= nodes.length - 1 && (
        <View style={styles.endNavigationButtonContainer}>
          <TouchableOpacity
            onPress={endNavigation}
            style={button_styles.navigationButton}
          >
            <Text style={text_styles.buttonText}>End Navigation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "white",
    padding: 10,
  },

  endNavigationButtonContainer: {
    position: "absolute",
    bottom: 100,
    padding: 0,

    borderRadius: 20,
    marginBottom: screenHeight * 0.02,
  },
});

export default NavigationStage;
