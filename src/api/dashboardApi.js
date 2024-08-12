import axiosClient, { handleResponse } from "./axiosClient";

const dashboardApi = {
  getOrderPnc: (params) => {
    return handleResponse(axiosClient.get("/admin/order/pnc", { params }));
  },
  getTotalIngredient: () => {
    return handleResponse(axiosClient.get("/admin/import/total-ingredient"));
  },
};

export default dashboardApi;
