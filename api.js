import axios from "axios";

const api = axios.create({
  baseURL: `http://${process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS}:5000`,
  headers: {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  },
});

export default api;
