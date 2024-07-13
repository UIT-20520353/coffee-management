import axiosClient, { handleResponse } from "./axiosClient";

const staffApi = {
  getAllStaffs: (params) => {
    return handleResponse(axiosClient.get("/admin/user", { params }));
  },
  createStaff: (body) => {
    return handleResponse(axiosClient.post("/admin/user", body));
  },
};

export default staffApi;
