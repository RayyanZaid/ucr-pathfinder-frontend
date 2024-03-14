import React from "react";
import { TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import removeFromAsyncStorage from "../../functions/removeFromAsyncStorage";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const LogoutButton = () => {
  const handlePress = () => {
    // Define your logout logic here
    console.log("Logout button pressed");
    removeFromAsyncStorage("uid");
    removeFromAsyncStorage("Schedule");
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.logoutButton}>
      <Icon name="sign-out" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    position: "absolute",
    top: screenHeight * 0.01,
    right: screenWidth * 0.05,
  },
});

export default LogoutButton;
