import axios from "axios";

const api = axios.create({
  baseURL: `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000`,
});

export default api;
