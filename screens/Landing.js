import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import text_styles from "../styles/text_styles";
import MapWithPath from "../components/Map";
import EachCourse from "../components/CourseComponents/EachCourse";
import { useEffect, useState } from "react";
import api from "../api";
import button_styles from "../styles/button_styles";
export default function LandingScreen() {
  // replace with local storage schedule later
  const [nextClass, setNextClass] = useState(null);
  const [isInNavigation, setIsInNavigation] = useState(false);

  // This gets the student's next class. Right now it's just a mock class. Need to implement in the backend
  useEffect(() => {
    const uid = "rayyanzaid0401@gmail.com";
    api
      .get("/getNextClass", { params: { uid } })
      .then((response) => {
        setNextClass(response.data["nextClass"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const toggleNavigation = () => {
    setIsInNavigation(!isInNavigation);
  };

  if (!nextClass) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
        <Text style={text_styles.titleText}>Loading your next class</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {!isInNavigation ? (
          <>
            <Text style={text_styles.titleText}>
              Path to your {nextClass["courseNumber"]} class
            </Text>
            <MapWithPath
              classBuildingName={nextClass["locationInfo"]["buildingName"]}
            />

            <Button
              onPress={toggleNavigation}
              title="Start Navigation"
              style={button_styles.mediumButton}
            />
            <EachCourse courseData={nextClass} />
          </>
        ) : (
          <>
            <Text style={text_styles.titleText}>In Navigation</Text>
            <Button
              onPress={toggleNavigation}
              title="Cancel Navigation"
              style={button_styles.mediumButton}
            />
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
});
