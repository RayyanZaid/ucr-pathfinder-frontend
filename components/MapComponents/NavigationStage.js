import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import text_styles from "../../styles/text_styles";

const NavigationStage = ({ nodes, edges }) => {
  const mapRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [eta, setEta] = useState(0);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);

  function truncateToOneDecimalPlace(value) {
    return Math.floor(value * 10) / 10;
  }

  // Simulate user movement along the nodes for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(currentNodeIndex);
      if (currentNodeIndex < nodes.length) {
        const node = nodes[currentNodeIndex];
        setCurrentPosition({
          latitude: parseFloat(node.location[0]),
          longitude: parseFloat(node.location[1]),
        });
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              ...currentPosition,
              latitude: parseFloat(node.location[0]),
              longitude: parseFloat(node.location[1]),
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            },
            100
          );
        }
        setCurrentNodeIndex(currentNodeIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, 1000); // Move to the next node every 1 second for demonstration

    return () => clearInterval(interval);
  }, [nodes]);

  // Calculate ETA based on edges' time properties
  useEffect(() => {
    // Adjust condition to ensure ETA is set to 0 when all nodes have been visited
    if (currentNodeIndex >= nodes.length - 1) {
      setEta(0); // No more edges to traverse, so ETA should be 0
    } else if (edges.length > 0 && currentNodeIndex < edges.length) {
      // Only calculate remaining ETA if there are edges left to traverse
      const remainingEta = edges
        .slice(currentNodeIndex) // Adjust slice to start from currentNodeIndex instead of currentNodeIndex - 1
        .reduce((acc, edge) => acc + edge.time, 0);
      setEta(truncateToOneDecimalPlace(remainingEta));
    }
  }, [edges, currentNodeIndex, nodes.length]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        mapType="satellite"
        followUserLocation={true}
        initialRegion={{
          latitude: nodes[0] ? parseFloat(nodes[0].location[0]) : 0,
          longitude: nodes[0] ? parseFloat(nodes[0].location[1]) : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
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
        {currentPosition && (
          <Marker coordinate={currentPosition} title="Current Position" />
        )}
      </MapView>
      <View style={styles.overlay}>
        <Text style={text_styles.titleText}>
          ETA: {truncateToOneDecimalPlace(eta)} mins
        </Text>
      </View>
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
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
  },
});

export default NavigationStage;
