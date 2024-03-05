import AsyncStorage from "@react-native-async-storage/async-storage";

async function getScheduleFromAsyncStorage() {
  try {
    const jsonValue = await AsyncStorage.getItem("Schedule");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log(e);
  }
}

async function getUidFromAsyncStorage() {
  try {
    const jsonValue = await AsyncStorage.getItem("uid");
    // console.log(jsonValue);
    return jsonValue;
  } catch (e) {
    console.log(e);
  }
}
export { getScheduleFromAsyncStorage, getUidFromAsyncStorage };
