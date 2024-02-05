import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon component

import button_styles from "../styles/button_styles";
import text_styles from "../styles/text_styles";
import axios from "axios";
import api from "../api";
import EachCourse from "./EachCourse";

export default function FullScheduleDisplay() {
  const [scheduleDictionary, setScheduleDictionary] = useState(null);

  useEffect(() => {
    const uid = "rayyanzaid0401@gmail.com";

    // Send a GET request with the uid as a query parameter
    api
      .get("/displaySchedule", { params: { uid } })
      .then((response) => {
        // Handle the response data here
        console.log(response.data["scheduleDictionary"]);
        setScheduleDictionary(response.data["scheduleDictionary"]);
        console.log(scheduleDictionary);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {scheduleDictionary ? (
        <ScrollView>
          <View style={styles.container}>
            {Object.keys(scheduleDictionary).map((key) => (
              <EachCourse key={key} courseData={scheduleDictionary[key]} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text>Loading</Text>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
