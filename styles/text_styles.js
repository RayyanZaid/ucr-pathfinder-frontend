import { Dimensions, StyleSheet } from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const fontStyles = {
  fontFamily: "Gabarito",
};

const text_styles = StyleSheet.create({
  titleText: {
    ...fontStyles,
    fontSize: 36,
    color: "black",
    textAlign: "center",
  },

  linkText: {
    color: "blue",
    textDecorationLine: "underline",
    ...fontStyles,
    fontSize: screenHeight * 0.025,

    margin: screenHeight * 0.005,
    textAlign: "center",
  },
  input: {
    ...fontStyles,
    height: screenHeight * 0.06,
    width: screenWidth * 0.8,
    borderWidth: 1,
    borderRadius: 30,
    padding: 10,
    marginTop: screenHeight * 0.04,
    borderWidth: 3,
    fontSize: screenHeight * 0.03,
    fontWeight: "bold",
    color: "black",
  },
  buttonText: {
    ...fontStyles,
    color: "black",
    fontSize: screenHeight * 0.02,
    fontWeight: "bold",
    textAlign: "center",
  },

  errorText: {
    ...fontStyles,
    fontSize: screenHeight * 0.02,
    color: "red",
    margin: screenHeight * 0.02,
  },

  infoText: {
    ...fontStyles,
    fontSize: screenHeight * 0.025,
    color: "black",
    margin: screenHeight * 0.005,
    textAlign: "center",
  },

  scheduleCourseText: {
    ...fontStyles,
    fontSize: 24,
    color: "black",
    marginTop: 20,
  },
  timeRangeText: {
    ...fontStyles,
    fontSize: 20,
    color: "black",
    margin: 20,
  },
  locationText: {
    ...fontStyles,
    position: "absolute",
    bottom: 5,
    right: 5,
    fontSize: 16,
  },

  teacherText: {
    ...fontStyles,
    position: "absolute",
    top: 5,
    left: 5,
    fontSize: 16,
  },

  timeText: {
    ...fontStyles,
    fontSize: screenHeight * 0.03,
    position: "absolute", // Use absolute positioning
    top: 10, // Distance from the top of the parent View
    right: 10, // Distance from the right of the parent View
    color: "white", // Text color for better visibility (optional)
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background (optional)
    padding: 8, // Padding around the text (optional)
    borderRadius: 5, // Rounded corners for the background (optional)
  },
});

export default text_styles;
