import axiosClient, { handleResponse } from "./axiosClient";

const promotionApi = {
  createPromotion: (body) => {
    return handleResponse(axiosClient.post("/admin/promotion", body));
  },
  updatePromotion: (id, body) => {
    return handleResponse(axiosClient.put(`/admin/promotion/${id}`, body));
  },
};

export default promotionApi;
