import React from "react";
import { TouchableOpacity, StyleSheet, Dimensions, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import removeFromAsyncStorage from "../../functions/removeFromAsyncStorage";
import button_styles from "../../styles/button_styles";
import text_styles from "../../styles/text_styles";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const LogoutButton = () => {
  const handlePress = () => {
    console.log("Logout button pressed");
    removeFromAsyncStorage("uid");
    removeFromAsyncStorage("Schedule");
  };

  return (
    <TouchableOpacity onPress={handlePress} style={button_styles.mediumButton}>
      <Text style={text_styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
