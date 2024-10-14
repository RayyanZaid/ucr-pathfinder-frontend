import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FullScheduleDisplay from "../components/CourseComponents/FullScheduleDisplay";
import { getUidFromAsyncStorage } from "../functions/getFromAsyncStorage";
import removeFromAsyncStorage from "../functions/removeFromAsyncStorage";
import api from "../api";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function FullScheduleScreen({ navigation }) {
  const handleDeleteSchedulePress = async () => {
    console.log("Delete Schedule Button");
    const uid = await getUidFromAsyncStorage();
    try {
      await removeFromAsyncStorage("Schedule");
      await api.get("/removeSchedule", { params: { uid } });
      console.log("Removed schedule from firebase");
      navigation.replace("UploadScheduleScreen"); // Navigate back to upload screen
    } catch (error) {
      console.log("Error deleting schedule:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleDeleteSchedulePress}
        style={styles.trashIcon}
      >
        <Icon name="trash" size={30} color="#000" />
      </TouchableOpacity>
      <FullScheduleDisplay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  trashIcon: {
    position: "absolute",
    left: screenWidth * 0.05,
    top: screenHeight * 0.01,
    zIndex: 10,
  },
});
