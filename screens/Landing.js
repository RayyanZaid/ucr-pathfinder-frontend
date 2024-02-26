import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import text_styles from "../styles/text_styles";
import MapWithPath from "../components/MapWithPath";
import EachCourse from "../components/CourseComponents/EachCourse";
import { useEffect, useState } from "react";
import api from "../api";
export default function LandingScreen() {
  // replace with local storage schedule later
  const [scheduleDictionaryArray, setScheduleDictionaryArray] = useState([]);

  var sampleCourseData = {
    courseNumber: "ME 010 001",
    teacherName: "Mentzel, Tamar (Primary) Rudnicki, Chris\n",
    className: "STATICS",
  };

  useEffect(() => {
    const uid = "rayyanzaid0401@gmail.com";
    api
      .get("/displaySchedule", { params: { uid } })
      .then((response) => {
        setScheduleDictionaryArray(response.data["scheduleDictionaryArray"]);

        // console.log(scheduleDictionaryArray[1][2]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (scheduleDictionaryArray.length == 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
        <Text style={text_styles.titleText}>Loading your next class</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={text_styles.titleText}>
        Path to your {sampleCourseData["className"]} class
      </Text>
      <MapWithPath
        classBuildingName={
          scheduleDictionaryArray[3][0]["locationInfo"]["buildingName"]
          // "Materials Sci and Engineering"
        }
      />
      <EachCourse courseData={scheduleDictionaryArray[3][0]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
});
