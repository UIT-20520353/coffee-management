import axiosClient, { handleResponse } from "./axiosClient";

const areaApi = {
  getAllAreas: () => {
    return handleResponse(axiosClient.get("/api/admin/area"));
  },
};

export default areaApi;
