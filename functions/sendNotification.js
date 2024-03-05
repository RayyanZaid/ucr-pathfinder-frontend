import * as Notifications from "expo-notifications";

const sendLocalNotification = async (title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null, // means send it immediately
    });
  } catch (error) {
    console.log(error);
  }
};

export { sendLocalNotification };
