import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";

import text_styles from "../../styles/text_styles";

var ucrRegion = {
  latitude: 33.9737,
  longitude: -117.3281,
  latitudeDelta: 0.009,
  longitudeDelta: 0.009,
};

const screenHeight = Dimensions.get("window").height;

const MapWithPath = ({ nodes, edges, minutesNeeded, distance }) => {
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
