import axiosClient, { handleResponse } from "./axiosClient";

const authApi = {
  login: (body) => {
    return handleResponse(axiosClient.post("/login", body));
  },
  getProfile: () => {
    return handleResponse(axiosClient.get("/user"));
  },
};

export default authApi;
