import axios from "axios";
import commonConstants from "@/app/constant";

const instance = axios.create({
  baseURL: "http://localhost:8081/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const value = localStorage.getItem(commonConstants.LOCAL_STORAGE_KEY);
  config.headers.Authorization = `Bearer ${
    value ? JSON.parse(value).accessToken : ""
  }`;
  return config;
});

instance.interceptors.response.use(
  (value) => {
    return {
      ok: true,
      body: value.data,
      status: value.status,
      total: value.headers["x-total-count"],
    };
  },
  (error) => {
    return Promise.reject({
      ok: false,
      errors: error.response.data,
      status: error.response.status,
    });
  }
);

export const handleResponse = (response) => {
  return response.then((res) => res).catch((res) => res);
};

export default instance;
