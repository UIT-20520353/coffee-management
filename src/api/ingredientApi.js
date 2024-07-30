import axiosClient, { handleResponse } from "./axiosClient";

const ingredientApi = {
  getAllIngredients: (params) => {
    return handleResponse(axiosClient.get("/admin/ingredient", { params }));
  },
  createIngredient: (data) => {
    return handleResponse(axiosClient.post("/admin/ingredient", data));
  },
  updateIngredient: (id, data) => {
    return handleResponse(
      axiosClient.post(`/admin/ingredient/update/${id}`, data)
    );
  },
  importIngredient: (data) => {
    return handleResponse(axiosClient.post("/admin/import", data));
  },
};

export default ingredientApi;
