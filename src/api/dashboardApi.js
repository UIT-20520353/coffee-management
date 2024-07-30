import axiosClient, { handleResponse } from "./axiosClient";

const dashboardApi = {
  getOrderPnc: () => {
    return handleResponse(axiosClient.get("/admin/order/pnc"));
  },
  getTotalIngredient: () => {
    return handleResponse(axiosClient.get("/admin/import/total-ingredient"));
  },
};

export default dashboardApi;
