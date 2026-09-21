import axios from "axios";

const apiClient =
  axios.create({
    baseURL:
      "https://localhost:7014/api",
  });

apiClient.interceptors.request.use(
  (config) => {
    /*
     * JSON requests get JSON content
     * type automatically from Axios.
     *
     * FormData requests are allowed
     * to generate their own multipart
     * boundary.
     */
    if (
      !(config.data instanceof FormData)
    ) {
      config.headers[
        "Content-Type"
      ] = "application/json";
    }

    return config;
  }
);

export default apiClient;