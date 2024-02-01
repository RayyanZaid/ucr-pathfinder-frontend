import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View } from "react-native";

var ucrRegion = {
  latitude: 33.9737,
  longitude: -117.3281,
  latitudeDelta: 0.009,
  longitudeDelta: 0.009,
};

const TestForMap = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={ucrRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        mapType="satellite"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "50%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default TestForMap;
