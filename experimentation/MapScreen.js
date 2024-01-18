import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import { View, StyleSheet } from "react-native";

var ucrRegion = {
  latitude: 33.9737,
  longitude: -117.3281,
  latitudeDelta: 0.009,
  longitudeDelta: 0.009,
};
export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton
        showsUserLocation={true}
        followsUserLocation
        showsScale
        minZoomLevel={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "75%",
  },
});
