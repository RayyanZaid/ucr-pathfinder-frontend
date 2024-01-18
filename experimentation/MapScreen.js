import React from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { View, StyleSheet } from "react-native";

var ucrRegion = {
  latitude: 33.9737,
  longitude: -117.3281,
  latitudeDelta: 0.009,
  longitudeDelta: 0.009,
};

var lot30Coord = {
  latitude: 33.96942746772863,
  longitude: -117.33279650010662,
};

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton
        showsUserLocation
        followsUserLocation
      >
        <Marker coordinate={lot30Coord}></Marker>
      </MapView>

      {/* 33.96942746772863, -117.33279650010662 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
