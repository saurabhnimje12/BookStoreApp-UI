import axios from "axios";

const BASE_URL = "http://localhost:8080/orderApi";

export const placeOrder = async (orderData: any, token: string) => {
  return axios.post(`${BASE_URL}/orderPlace`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
