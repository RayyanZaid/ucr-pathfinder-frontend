import React, { useRef, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import text_styles from "../../styles/text_styles";

const MapWithPath = ({ nodes, edges, minutesNeeded, distance }) => {
  const mapRef = useRef(null);
  var ucrRegion = {
    latitude: 33.9737,
    longitude: -117.3281,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  };

  useEffect(() => {
    if (mapRef.current && nodes && nodes.length >= 2) {
      // Get coordinates of the two markers
      const marker1 = {
        latitude: parseFloat(nodes[0].location[0]),
        longitude: parseFloat(nodes[0].location[1]),
      };
      const marker2 = {
        latitude: parseFloat(nodes[nodes.length - 1].location[0]),
        longitude: parseFloat(nodes[nodes.length - 1].location[1]),
      };

      // Calculate bounding box
      const minLat = Math.min(marker1.latitude, marker2.latitude);
      const maxLat = Math.max(marker1.latitude, marker2.latitude);
      const minLng = Math.min(marker1.longitude, marker2.longitude);
      const maxLng = Math.max(marker1.longitude, marker2.longitude);

      // Calculate region to fit both markers with some padding
      const region = {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.abs(maxLat - minLat) * 2,
        longitudeDelta: Math.abs(maxLng - minLng) * 2,
      };

      // Animate map to fit the markers
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [nodes]);

  return (
    <View style={styles.container}>
      <MapView
        // ref={mapRef}
        initialRegion={ucrRegion}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
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
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapWithPath;
