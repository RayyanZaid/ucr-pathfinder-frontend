import AsyncStorage from "@react-native-async-storage/async-storage";

export default getFromAsyncStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

// // Call the function and handle the retrieved data
// retrieveData().then((arrayOfDictionaries) => {
//   console.log(arrayOfDictionaries);
//   // Use your array of dictionaries here
// });
