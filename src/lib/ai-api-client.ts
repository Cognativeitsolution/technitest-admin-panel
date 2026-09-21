import axios from "axios";

const aiApiClient = axios.create({
  baseURL: "/ai-api",
  timeout: 60000,
});

aiApiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    if (typeof config.headers?.delete === "function") {
      config.headers.delete("Content-Type");
    } else if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }
  return config;
});

export default aiApiClient;
