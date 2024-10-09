import axios from "axios";

const api = axios.create({
  baseURL: `http://10.183.50.48:5000`,
  headers: {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  },
});

export default api;
