import axiosClient, { handleResponse } from "./axiosClient";

const authApi = {
  login: (body) => {
    return handleResponse(axiosClient.post("/login", body));
  },
};

export default authApi;
