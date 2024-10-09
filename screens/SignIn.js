import React, { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

// Imports for UI

import text_styles from "../styles/text_styles";
import PhoneNumberTextField from "../components/AuthComponents/PhoneNumberTextField";
import VerificationCodeTextField from "../components/AuthComponents/VerificationCodeTextField";

import SubmitButton from "../components/SubmitButton";

import api from "../api";
import { saveUidToAsyncStorage } from "../functions/saveToAsyncStorage";

const skipAuth = true;

export default function SignIn() {
  // State Variables
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [statusMessage, setStatusMessage] = useState("");
  const [
    isClickedSendVerificationCodeButton,
    setIsClickedSendVerificationCodeButton,
  ] = useState(false);

  const handlePhoneNumberChange = (phone) => {
    setPhoneNumber(phone);
  };

  const handleVerificationCodeChange = (code) => {
    setVerificationCode(code);
  };
  const onClickSendVerificationCode = async () => {
    // using William's UID : TbpyIr6hrGWgK96zUCZYvVdMkjr1
    if (skipAuth) {
      saveUidToAsyncStorage("TbpyIr6hrGWgK96zUCZYvVdMkjr1");
      return;
    }
    console.log(
      "This function is responsible for sending the verification code."
    );

    // // First validate the phone number
    // let isValidNumber = false;
    // isValidNumber = validatePhoneNumber(phoneNumber);

    // if (!isValidNumber) {
    //   setStatusMessage("Please enter a valid phone number");
    //   return;
    // }

    // // Sends a request to firebase for verification code.
    // let result;
    // try {
    //   const sendVerificationPromise = sendVerificationCodeFirebase(
    //     phoneNumber,
    //     recaptchaVerifier.current
    //   );

    //   // Set a timeout to wait for 5 seconds
    //   const timeoutPromise = new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve(null); // Resolving with null after 5 seconds
    //     }, 5000);
    //   });

    //   // Wait for either the sendVerificationPromise or the timeoutPromise to resolve
    //   result = await Promise.race([sendVerificationPromise, timeoutPromise]);

    //   console.log("sent verification");
    // } catch (error) {
    //   console.error("Error sending verification code:", error);
    //   setStatusMessage("Failed to send verification code");
    //   return;
    // }

    // if (!result) {
    //   // Timeout occurred
    //   setStatusMessage("Firebase: Error (auth/too-many-requests).");
    //   console.log(
    //     "Timeout occurred, setting message to Firebase: Error (auth/too-many-requests)."
    //   );

    //   return;
    // }

    // // Proceed with handling the result if it's not null
    // if (result.message === "Success") {
    //   setVerificationId(result.verificationId);
    //   setStatusMessage(null);
    //   setIsClickedSendVerificationCodeButton(true);
    // } else {
    //   setStatusMessage(result.message);
    //   console.log(result.message);
    // }
  };

  const onClickSignIn = async () => {
    if (skipAuth) {
      saveUidToAsyncStorage("TbpyIr6hrGWgK96zUCZYvVdMkjr1");
      return;
    }
    console.log(
      "This function is responsible for sending the verification code."
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <SubmitButton
            buttonText={"Proceed"}
            onPressFunction={onClickSignIn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
