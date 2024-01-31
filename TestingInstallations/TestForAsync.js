import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem("my-key", value);
    console.log(
      "Yay, storeData successful. Here is the value you saved: ",
      value
    );
  } catch (e) {
    console.log("Saving Error", e);
  }
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("my-key");
    if (value !== null) {
      console.log("Yay, getData successful. Here is the value: ", value);
    }
  } catch (e) {
    console.log("Reading Error", e);
  }
};

const TestForAsync = () => {
  // State to hold the input value
  const [inputValue, setInputValue] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setInputValue}
        value={inputValue}
        placeholder="Type my-key value here..."
      />
      <Button title="Store my-key" onPress={() => storeData(inputValue)} />
      <Button title="Get my-key" onPress={getData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%", // Adjust the width as needed
  },
});

export default TestForAsync;
