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

// Imports for functionality
import {
  validatePhoneNumber,
  sendVerificationCodeFirebase,
  verifyVerificationCode,
} from "../functions/signin";
import { firebaseConfig } from "../firebaseConfig";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

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

    // First validate the phone number
    let isValidNumber = false;
    isValidNumber = validatePhoneNumber(phoneNumber);

    if (!isValidNumber) {
      setStatusMessage("Please enter a valid phone number");
      return;
    }

    // Sends a request to firebase for verification code.
    let result;
    try {
      const sendVerificationPromise = sendVerificationCodeFirebase(
        phoneNumber,
        recaptchaVerifier.current
      );

      // Set a timeout to wait for 5 seconds
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(null); // Resolving with null after 5 seconds
        }, 5000);
      });

      // Wait for either the sendVerificationPromise or the timeoutPromise to resolve
      result = await Promise.race([sendVerificationPromise, timeoutPromise]);
    } catch (error) {
      console.error("Error sending verification code:", error);
      setStatusMessage("Failed to send verification code");
      return;
    }

    if (!result) {
      // Timeout occurred
      setStatusMessage("Firebase: Error (auth/too-many-requests).");
      console.log(
        "Timeout occurred, setting message to Firebase: Error (auth/too-many-requests)."
      );

      return;
    }

    // Proceed with handling the result if it's not null
    if (result.message === "Success") {
      setVerificationId(result.verificationId);
      setStatusMessage(null);
      setIsClickedSendVerificationCodeButton(true);
    } else {
      setStatusMessage(result.message);
      console.log(result.message);
    }
  };

  const onClickSignIn = async () => {
    console.log("This function is responsible for signing the user in.");

    // Attempt to verify the verification code provided by the user
    const result = await verifyVerificationCode(
      verificationCode,
      verificationId
    );

    if (result.message === "Success") {
      console.log("Success: User is verified.");

      // Now, proceed to fetch the UID by sending a GET request to '/getUID' with the phoneNumber as a parameter
      try {
        const uidResponse = await api.get("/getUID", {
          params: { phoneNumber }, // Ensure your backend expects this query parameter
        });

        // Check if the response is successful and contains the data
        if (uidResponse && uidResponse.data) {
          // Assuming uidResponse.data contains the UID, you can now use it for further processing
          console.log("UID fetched successfully:", uidResponse.data);
          console.log(uidResponse.data["uid"]);
          saveUidToAsyncStorage(uidResponse.data["uid"]);
        }
      } catch (error) {
        console.error("Error fetching UID:", error);
        setStatusMessage("Failed to fetch UID");
      }
    } else {
      console.log(result.message);
      if (
        result.message === "Firebase: Error (auth/invalid-verification-code)."
      ) {
        setStatusMessage("Invalid verification code");
      } else {
        setStatusMessage(result.message);
      }
    }
  };

  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification
      />
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        {!isClickedSendVerificationCodeButton ? (
          <View style={styles.inner}>
            <PhoneNumberTextField onPhoneChange={handlePhoneNumberChange} />
            <Text style={text_styles.errorText}>{statusMessage}</Text>
            <SubmitButton
              buttonText={"Send Verification Code"}
              onPressFunction={onClickSendVerificationCode}
            />
          </View>
        ) : (
          <View>
            <Text style={text_styles.infoText}>
              Enter the verification code sent to {phoneNumber}
            </Text>
            <VerificationCodeTextField
              onCodeChange={handleVerificationCodeChange}
            />
            <Text style={text_styles.errorText}>{statusMessage}</Text>
            {/* <Button title="I didn't receive a code" /> */}
            <SubmitButton
              buttonText={"Sign In"}
              onPressFunction={onClickSignIn}
            />
          </View>
        )}
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
