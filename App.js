import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";

import * as Location from "expo-location";

import MapViewDirections from "react-native-maps-directions";
import { useEffect, useState } from "react";

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
];

export default function App() {
  const [location, setLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);

  useEffect(() => {
    const getPermissionsAndUpdateLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location access not granted");
        return;
      }

      // Set up the location subscription
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (newLocation) => {
          console.log(newLocation);
          setLocation(newLocation.coords);
        }
      );

      setLocationSubscription(subscription);
    };

    getPermissionsAndUpdateLocation();

    // Clean up
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Check if location is null before rendering it
  return (
    <View>
      <MapView
        style={styles.map}
        initialRegion={ucrRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        mapType="satellite"
      >
        {/* <MapViewDirections
          apikey="AIzaSyCAtOelti_U6pD67Arv0sSBiKbNkb8_oCk"
          origin={{
            latitude: location?.latitude ?? 0,
            longitude: location?.longitude ?? 0,
          }}
          destination={coordinates[1]}
          strokeWidth={3}
          onReady={(result) => {
            console.log("Distance: " + result.distance + " km");
            console.log("Duration: " + result.duration + " min.");
          }}
          mode="DRIVING"
        /> */}
      </MapView>
    </View>
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
    height: "80%",
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
