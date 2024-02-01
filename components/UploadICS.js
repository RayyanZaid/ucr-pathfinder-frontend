import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";

const API_URL =
  "http://" + process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS + ":5000/upload";

export default function UploadICS() {
  const [file, setFile] = useState(null);

  const pickFile = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "text/calendar", // or '*/*' for all types
      });
      console.log(result.assets[0].uri);
      setFile(result);
    } catch (error) {
      console.error("Error picking file: ", error);
    }
  };

  const uploadFile = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", {
          uri: file.assets[0].uri,
          name: file.assets[0].name,
          type: "*/*", // Adjust the file type as needed
        });

        const response = await axios.post(API_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(response.data);
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Upload File</Text>

      <Button title="Pick a File" onPress={pickFile} />
      {file && <Button title="Upload File" onPress={uploadFile} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
