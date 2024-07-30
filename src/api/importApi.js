import axiosClient, { handleResponse } from "./axiosClient";

const importApi = {
  getAllImports: (params) => {
    return handleResponse(axiosClient.get("/admin/import", { params }));
  },
  getImportById: (id) => {
    return handleResponse(axiosClient.get(`/admin/import/${id}`));
  },
  addIngredient: (id, data) => {
    return handleResponse(axiosClient.post(`/admin/import/update/${id}`, data));
  },
  updateImportDetail: (data) => {
    return handleResponse(
      axiosClient.post(`/admin/import/update/detail`, data)
    );
  },
};

export default importApi;
