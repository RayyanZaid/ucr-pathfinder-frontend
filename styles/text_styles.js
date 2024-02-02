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
});

export default text_styles;
