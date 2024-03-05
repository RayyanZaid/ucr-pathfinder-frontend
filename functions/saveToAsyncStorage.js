import AsyncStorage from "@react-native-async-storage/async-storage";

async function saveScheduleToAsyncStorage(value) {
  schedule = JSON.stringify(value);
  try {
    await AsyncStorage.setItem("Schedule", schedule);
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function saveUidToAsyncStorage(value) {
  try {
    await AsyncStorage.setItem("uid", value);
  } catch (error) {
    console.log("Error: ", error);
  }
}

export { saveScheduleToAsyncStorage, saveUidToAsyncStorage };
