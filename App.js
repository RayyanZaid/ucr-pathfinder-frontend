import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";

import MapViewDirections from "react-native-maps-directions";
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

const coordinates = [
  { latitude: 33.9737, longitude: -117.3281 },
  {
    latitude: 33.96942746772863,
    longitude: -117.33279650010662,
  },

  {
    latitude: 33.9755388,
    longitude: -117.3263134,
  },

  {
    latitude: 33.9753854,
    longitude: -117.3272187,
  },

  {
    latitude: 33.9740251,
    longitude: -117.3303292,
  },
];
export default function App() {
  return (
    <MapView
      style={styles.map}
      initialRegion={ucrRegion}
      provider={PROVIDER_GOOGLE}
      mapType="satellite"
    >
      {/* <MapViewDirections
        apikey="AIzaSyCAtOelti_U6pD67Arv0sSBiKbNkb8_oCk"
        origin={coordinates[2]}
        destination={coordinates[4]}
        strokeWidth={3}
        onReady={(result) => {
          console.log("Distance: " + result.distance + " km");
          console.log("Duration: " + result.duration + " min.");
        }}
        mode="WALKING"
      /> */}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    width: "100%",
    height: "100%",
  },
});

// AIzaSyCAtOelti_U6pD67Arv0sSBiKbNkb8_oCk

{
  /* <Polyline
coordinates={[
  { latitude: 33.9737, longitude: -117.3281 },
  { latitude: 33.96942746772863, longitude: -117.33279650010662 },
]}
strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
strokeColors={[
  "#7F0000",
  "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
]}
strokeWidth={6}
/> */
}
