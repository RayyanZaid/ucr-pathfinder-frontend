import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const button_styles = StyleSheet.create({
  mediumButton: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#007bff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: screenWidth * 0.8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0056b3",
  },
  navigationButton: {
    backgroundColor: "rgba(255, 240, 153, 0.8)",

    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20, // Rounded corners
    margin: screenHeight * 0.01,
  },
});

export default button_styles;
