import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import LogoutButton from "../components/AuthComponents/LogoutButton";
import DeleteAccountButton from "../components/AuthComponents/DeleteAccountButton";

const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <LogoutButton />
      <DeleteAccountButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default SettingsScreen;
