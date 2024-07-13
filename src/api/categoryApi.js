import axiosClient, { handleResponse } from "./axiosClient";

const categoryApi = {
  getAllCategories: (params) => {
    return handleResponse(axiosClient.get("/admin/category", { params }));
  },
  createCategory: (body) => {
    return handleResponse(axiosClient.post("/admin/category", body));
  },
  updateCategory: (id, body) => {
    return handleResponse(
      axiosClient.post(`/admin/category/update/${id}`, body)
    );
  },
};

export default categoryApi;
