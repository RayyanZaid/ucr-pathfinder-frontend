import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to remove item from AsyncStorage
export default removeItemFromAsyncStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Item removed successfully");
  } catch (error) {
    console.error("Error removing item from AsyncStorage:", error);
  }
};

// Example usage
// removeItemFromAsyncStorage('Schedule'); // Replace 'Schedule' with the key you want to remove
