import axios from "axios";

/**
 * Service to interact with the cart API.
 * This service provides methods to manage the shopping cart.
 * It uses Axios for making HTTP requests.
 * The API base URL is set to a local server running on port 8080.
 */
const API_BASE_URL = "http://localhost:8080/";

/**
 * Adds a book to the cart.
 * @param {any} bookId - The ID of the book to add to the cart.
 * @returns {Promise} A promise that resolves when the book is added to the cart.
 */
export const addToCart = async (bookId: any) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) throw new Error("No token found. Please login.");
  return await axios.post(
    `${API_BASE_URL}cartApi/addTooCart/${bookId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Fetches the cart by user ID.
 * @returns {Promise<Array>} A promise that resolves to an array of cart items.
 */
export const getCartById = async () => {
  const token = localStorage.getItem("token"); // changed from "jwt" to "token" for consistency
  if (!token) throw new Error("No token found. Please login.");
  const response = await axios.get(`${API_BASE_URL}cartApi/getAllCartById`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Updates the quantity of a book in the cart.
 * @param {number} cartId - The ID of the cart item to update.
 * @param {number} quantity - The new quantity for the cart item.
 * @returns {Promise} A promise that resolves when the cart item is updated.
 */
export const increaseCartQuantity = async (cartId: number) => {
  const token = localStorage.getItem("token");
  return await axios.patch(
    `${API_BASE_URL}cartApi/updateCartAdd/${cartId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/**
 * Decreases the quantity of a book in the cart.
 * @param {number} cartId - The ID of the cart item to decrease.
 * @returns {Promise} A promise that resolves when the cart item quantity is decreased.
 */
export const decreaseCartQuantity = async (cartId: number) => {
  const token = localStorage.getItem("token");
  return await axios.patch(
    `${API_BASE_URL}cartApi/updateCartRmv/${cartId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/**
 * Removes a book from the cart.
 * @param {number} cartId - The ID of the cart item to remove.
 * @returns {Promise} A promise that resolves when the cart item is removed.
 */
export const removeCartItem = async (cartId: number) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`${API_BASE_URL}cartApi/removeFromCart/${cartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


