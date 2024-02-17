import { StyleSheet, Text, View } from "react-native";
import text_styles from "../styles/text_styles";
import MapWithPath from "../components/MapWithPath";
import EachCourse from "../components/EachCourse";

export default function LandingScreen() {
  var sampleCourseData = {
    courseNumber: "ME 010 001",
    teacherName: "Mentzel, Tamar (Primary) Rudnicki, Chris\n",
    className: "STATICS",
  };

  return (
    <View style={styles.container}>
      <Text style={text_styles.titleText}>
        Path to your {sampleCourseData["className"]} class
      </Text>
      <MapWithPath />
      <EachCourse courseData={sampleCourseData} />
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
