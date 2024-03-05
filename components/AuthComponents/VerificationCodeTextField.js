import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const VerificationCodeTextField = ({ onCodeChange }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = Array(6)
    .fill()
    .map(() => useRef(null));
  const hiddenInputRef = useRef(null);

  const handleCodeInputChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    onCodeChange(newCode.join(""));

    // Focus the next input
    if (text && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleHiddenInput = (text) => {
    const newCode = text.split("").slice(0, 6);
    setCode(newCode);
    onCodeChange(newCode.join(""));

    // Focus the correct input
    const nextIndex = newCode.findIndex((char) => char === "");
    if (nextIndex !== -1) {
      inputRefs[nextIndex].current.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        ref={hiddenInputRef}
        style={styles.hiddenInput}
        onChangeText={handleHiddenInput}
        value={code.join("")}
        maxLength={6}
        keyboardType="number-pad"
      />
      <View style={styles.codeInputContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.codeInput}
            onPress={() => hiddenInputRef.current.focus()}
          >
            <Text style={styles.codeInputText}>{code[index]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "gray",
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#f0f0f0",
  },
  codeInputText: {
    fontSize: 25,
  },
  // ... [other styles remain unchanged]
});

export default VerificationCodeTextField;
