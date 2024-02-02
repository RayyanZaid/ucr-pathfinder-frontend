import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon component
import { Dimensions } from "react-native";

const API_URL =
  "http://" + process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS + ":5000/upload";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
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

        formData.append("uid", "temporary");

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
      <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
        <Icon name="cloud-upload" size={50} color="#000" />
        <Text style={styles.textInUpload}>
          Tap to Upload Your Schedule (.ics)
        </Text>
      </TouchableOpacity>

      {file && (
        <TouchableOpacity style={styles.button} onPress={uploadFile}>
          <Text>Upload File</Text>
        </TouchableOpacity>
      )}
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
  uploadBox: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },

  textInUpload: {
    textAlign: "center",
    marginVertical: 20,
  },
});
