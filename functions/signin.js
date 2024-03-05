import { auth } from "../firebaseConfig";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { FirebaseError } from "firebase/app";

function validatePhoneNumber(phoneNumber) {
  if (phoneNumber.length !== 10) {
    return false;
  }

  return true;
}
async function sendVerificationCodeFirebase(
  phoneNumber,
  currentRecaptchaVerifier
) {
  let result = {
    verificationId: null,
    message: null,
  };
  try {
    phoneNumber = "+1" + phoneNumber;

    const phoneProvider = new PhoneAuthProvider(auth);

    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      currentRecaptchaVerifier
    );

    result.verificationId = verificationId;
    result.message = "Success";
    console.log("In functionality, SUCCESS");
  } catch (error) {
    if (error instanceof FirebaseError) {
      // Printing the error message
      console.log("ugh");
      console.log(`Error: ${error.message}`);
      result.message = error.message;
    } else {
      // Handling other types of errors
      console.log(`An unexpected error occurred: ${error}`);
      result.message = error;
    }
  }

  return result;
}

async function verifyVerificationCode(verificationCode, verificationId) {
  let result = {
    message: null,
  };

  try {
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    await signInWithCredential(auth, credential);

    result.message = "Success";
  } catch (err) {
    // console.log("Error: " + err.message);
    result.message = err.message;
  }

  return result;
}

export {
  validatePhoneNumber,
  sendVerificationCodeFirebase,
  verifyVerificationCode,
};

// if(result.message === "Firebase: message (auth/invalid-verification-code)") {
//   result.message = "Verification code "
// }
