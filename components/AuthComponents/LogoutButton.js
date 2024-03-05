import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import removeFromAsyncStorage from "../../functions/removeFromAsyncStorage";
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
    top: 20,
    right: 20,
  },
});

export default LogoutButton;
