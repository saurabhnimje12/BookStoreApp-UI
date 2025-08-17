import axios from "axios";

/**
 * Service to interact with the order API.
 * This service provides methods to place orders.
 * It uses Axios for making HTTP requests.
 * The API base URL is set to a local server running on port 8080.
 */
const BASE_URL = "http://localhost:8080/orderApi";

/**
 * Places an order with the given order data.
 * @param {any} orderData - The data for the order to be placed.
 * @param {string} token - The authentication token for the user.
 * @returns {Promise} A promise that resolves when the order is successfully placed.
 */
export const placeOrder = async (orderData: any, token: string) => {
  return axios.post(`${BASE_URL}/orderPlace`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
