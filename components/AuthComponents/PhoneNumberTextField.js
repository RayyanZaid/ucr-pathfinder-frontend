import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Dimensions,
} from "react-native";

import text_styles from "../../styles/text_styles";

const PhoneNumberTextField = ({ onPhoneChange }) => {
  const [rawPhone, setRawPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");

  const handlePhoneInputChange = (text) => {
    const raw = text.replace(/\D/g, "");

    const areaCode = raw.substr(0, 3);

    const middlePart = raw.substr(3, 3);

    const lastPart = raw.substr(6, 4);

    // formatting logic to maintain (___)-___-____ format
    let formatted = text;
    if (raw.length <= 3) {
      formatted = `(${areaCode})-`;
    } else if (raw.length <= 6) {
      formatted = `(${areaCode})-${middlePart}`;
    } else if (raw.length <= 10) {
      formatted = `(${areaCode})-${middlePart}-${lastPart}`;
    }

    setRawPhone(raw);
    setFormattedPhone(formatted);
    console.log(raw);
    onPhoneChange(raw);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={text_styles.input}
        onChangeText={handlePhoneInputChange}
        value={rawPhone.length === 10 ? formattedPhone : rawPhone}
        placeholder={"Enter Phone Number"}
        keyboardType="phone-pad"
        placeholderTextColor="black"
        maxLength={14} // Limit to the (___)-___-____ format
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PhoneNumberTextField;
