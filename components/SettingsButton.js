import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SettingsButton = () => {
  const navigation = useNavigation(); // Get the navigation object

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Settings")}
    >
      <Text style={styles.text}>Settings</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: "blue",
  },
});

export default SettingsButton;
