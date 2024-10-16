import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import api from "../api";

import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon component

import button_styles from "../styles/button_styles";
import text_styles from "../styles/text_styles";

import { saveScheduleToAsyncStorage } from "../functions/saveToAsyncStorage";
import getScheduleFromAsyncStorage, {
  getUidFromAsyncStorage,
} from "../functions/getFromAsyncStorage";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
export default function UploadICS({ onIsSavedChange }) {
  const [file, setFile] = useState(null);

  const [isSaved, setIsSaved] = useState(false);

  // Handle File Functions

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

  const deleteFile = () => {
    setFile(null);
  };

  const saveFile = async () => {
    // getScheduleFromFirebase();
    console.log("Local IP: " + process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS);
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", {
          uri: file.assets[0].uri,
          name: file.assets[0].name,
          type: "*/*", // Adjust the file type as needed
        });

        formData.append("uid", await getUidFromAsyncStorage());

        console.log("Will call the /upload route");
        const response = await api.post("/upload", formData);
        console.log("called the /upload route");

        console.log(response.data);

        if (response.data.message === "File successfully uploaded") {
          await getScheduleFromFirebase();
        }
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }
  };

  async function getScheduleFromFirebase() {
    console.log("in getScheduleFromFirebase");
    console.log("Getting Schedule From Firebase");
    try {
      const uid = await getUidFromAsyncStorage();
      console.log("uid: ", uid);

      api
        .get("/displaySchedule", { params: { uid } })
        .then(async (response) => {
          console.log(response.data["scheduleDictionaryArray"]);
          console.log("Got schedule from backend");

          try {
            await saveScheduleToAsyncStorage(
              response.data["scheduleDictionaryArray"]
            );
            setIsSaved(true);

            onIsSavedChange(true); // Inform the parent component that the save operation has completed
            console.log("Saved schedule to Async Storage");
          } catch (error) {
            console.log("Error while saving to Async:", error);
          }
        });
    } catch (error) {
      console.log("Error in overall function:", error);
    }
  }

  return (
    <View style={styles.container}>
      {/* {isSaved ? <Text>True</Text> : <Text>False</Text>} */}

      {/* Code to display the Upload Box */}

      <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
        {!file ? (
          <View style={styles.container}>
            {/* Before file is uploaded*/}
            <Icon name="cloud-upload" size={50} color="#000" />
            <Text style={text_styles.infoText}>
              Tap to Upload Your Schedule
            </Text>
            <Text style={text_styles.infoText}>(Must be a .ics file)</Text>
          </View>
        ) : (
          <View style={styles.container}>
            {/* After file is uploaded*/}
            <Icon name="check" size={50} color="#000" />
            <Text style={text_styles.infoText}>Uploaded</Text>
            <Text style={text_styles.infoText}>{file.assets[0].name}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Code to display the 2 buttons */}
      {file && (
        <View style={styles.verticalButtons}>
          <TouchableOpacity style={styles.saveButton} onPress={saveFile}>
            <Text style={text_styles.buttonText}>Save Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={deleteFile}>
            <Text style={text_styles.buttonText}>Delete Schedule</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  uploadBox: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#000",
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    margin: 20,
  },

  saveButton: {
    ...button_styles.mediumButton,
    backgroundColor: "#CEE4B3",
  },

  deleteButton: {
    ...button_styles.mediumButton,
    backgroundColor: "#EC6D67",
  },

  textInUpload: {
    textAlign: "center",
    marginVertical: 10,
  },
  verticalButtons: {
    flexDirection: "column",
  },
});
