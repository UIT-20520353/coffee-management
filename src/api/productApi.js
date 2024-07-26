import axiosClient, { handleResponse } from "./axiosClient";

const productApi = {
  createProduct: (body) => {
    return handleResponse(axiosClient.post("/admin/product", body));
  },
  getAllProducts: (params) => {
    return handleResponse(axiosClient.get("/admin/product", { params }));
  },
  deleteProduct: (id) => {
    return handleResponse(axiosClient.delete(`/admin/product/${id}`));
  },
  getProductDetail: (id) => {
    return handleResponse(axiosClient.get(`/admin/product/${id}`));
  },
  updateProductInfo: (id, body) => {
    return handleResponse(axiosClient.put(`/admin/product/${id}`, body));
  },
  updateProductRecipe: (id, body) => {
    return handleResponse(axiosClient.put(`/admin/product/recipe/${id}`, body));
  },
};

export default productApi;
