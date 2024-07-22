import axiosClient, { handleResponse } from "./axiosClient";

const areaApi = {
  getAllAreas: () => {
    return handleResponse(axiosClient.get("/admin/area"));
  },
};

export default areaApi;
