import axiosClient, { handleResponse } from "./axiosClient";

const orderApi = {
  getAllOrders: (params) => {
    return handleResponse(axiosClient.get("/admin/order", { params }));
  },
  getOrderDetail: (id) => {
    return handleResponse(axiosClient.get(`/admin/order/${id}`));
  },
};

export default orderApi;
