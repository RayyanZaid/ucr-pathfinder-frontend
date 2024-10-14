import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

import text_styles from "../styles/text_styles";
import SubmitButton from "../components/SubmitButton";
import api from "../api";
import { saveUidToAsyncStorage } from "../functions/saveToAsyncStorage";

import { signInUser, signUpUser } from "../firebase";
const skipAuth = true;
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function AuthScreen() {
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between Sign In and Sign Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [resultMessage, setResultMessage] = useState("");

  const handleEmailInputChange = (text) => {
    setEmail(text);
    console.log("Email: " + email);
  };

  const handlePasswordInputChange = (text) => {
    setPassword(text);
    console.log("Password: " + password);
  };
  const onClickAuth = async () => {
    // if (skipAuth) {
    //   saveUidToAsyncStorage("TbpyIr6hrGWgK96zUCZYvVdMkjr1");
    //   return;
    // }

    // console.log("Email: " + email);
    // console.log("Password: " + password);

    try {
      if (isSignIn) {
        console.log("Signing in with email and password.");
        const userCredential = await signInUser(email, password);
        const user = userCredential.user;
        console.log("Signed in successfully:", user);
        saveUidToAsyncStorage(user.uid); // Save user ID to AsyncStorage
      } else {
        console.log("Signing up with email and password.");
        const userCredential = await signUpUser(email, password);
        const user = userCredential.user;
        console.log("User signed up successfully:", user);
        // saveUidToAsyncStorage(user.uid); // Save user ID to AsyncStorage
        setResultMessage("Verification email sent.");
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
      setResultMessage(error.message);
    }
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
        <View style={styles.header}></View>

        <Image
          source={require("../assets/logo.jpg")}
          style={{ width: screenWidth * 0.95, height: screenHeight * 0.4 }}
          resizeMode="contain"
        />
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <TextInput
            style={text_styles.input}
            onChangeText={handleEmailInputChange}
            value={email}
            placeholder={"Enter Email"}
            autoCapitalize="none"
            inputMode="email"
            placeholderTextColor="black"
          />

          <TextInput
            style={text_styles.input}
            onChangeText={handlePasswordInputChange}
            value={password}
            placeholder={"Enter Password"}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholderTextColor="black"
          />
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)}>
              <Text style={styles.switchText}>
                {isSignIn
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Text>
            </TouchableOpacity>

            <Text style={text_styles.errorText}>{resultMessage}</Text>
          </View>

          <SubmitButton
            buttonText={isSignIn ? "Sign In" : "Sign Up"}
            onPressFunction={onClickAuth}
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  switchText: {
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
