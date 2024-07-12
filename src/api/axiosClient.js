import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (value) => {
    return {
      ok: true,
      body: value.data,
      status: value.status,
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
