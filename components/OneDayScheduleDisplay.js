import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import Icon from "react-native-vector-icons/FontAwesome";

import button_styles from "../styles/button_styles";
import text_styles from "../styles/text_styles";
import axios from "axios";
import api from "../api";
import EachCourse from "./EachCourse";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function OneDayScheduleDisplay({
  scheduleDictionary,
  dayIndex,
}) {
  const getDayOfWeek = (dayIndex) => {
    const date = new Date();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return days[dayIndex];
  };

  return (
    <SafeAreaView style={styles.container}>
      {scheduleDictionary ? (
        <View style={styles.container}>
          <Text style={text_styles.titleText}>{getDayOfWeek(dayIndex)}</Text>
          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
              <View>
                {Object.keys(scheduleDictionary).map((key) => (
                  <EachCourse key={key} courseData={scheduleDictionary[key]} />
                ))}
              </View>
            </ScrollView>
            <Icon
              name="arrow-down"
              size={30}
              color="#000"
              style={{ alignSelf: "center", marginBottom: 10 }}
            />
          </View>
        </View>
      ) : (
        <Text>Loading</Text>
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: screenWidth * 0.05,
  },
});
