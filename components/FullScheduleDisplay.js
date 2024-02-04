import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon component

import button_styles from "../styles/button_styles";
import text_styles from "../styles/text_styles";

const API_URL =
  "http://" + process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS + ":5000/upload";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
export default function FullScheduleDisplay() {
  return (
    <View style={styles.container}>
      <Text>YAY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
