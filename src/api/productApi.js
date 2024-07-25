import axiosClient, { handleResponse } from "./axiosClient";

const productApi = {
  createProduct: (body) => {
    return handleResponse(axiosClient.post("/admin/product", body));
  },
  getAllProducts: (params) => {
    return handleResponse(axiosClient.get("/admin/product", { params }));
  },
};

export default productApi;
