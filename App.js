import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import axios from "axios";

const API_URL = "http://192.168.4.45:5000/";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>{data.name}</Text>
      <Text>{data.major}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default App;
