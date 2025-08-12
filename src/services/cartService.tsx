import axios from "axios";

const API_BASE_URL = "http://localhost:8080/";

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

export const removeCartItem = async (cartId: number) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`${API_BASE_URL}cartApi/removeFromCart/${cartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


