import React from "react";

import { TouchableOpacity, Text } from "react-native";
import button_styles from "../styles/button_styles";
import text_styles from "../styles/text_styles";

const SubmitButton = ({ buttonText, onPressFunction }) => {
  return (
    <TouchableOpacity
      style={button_styles.submitButton}
      onPress={() => onPressFunction()}
    >
      <Text style={text_styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;
