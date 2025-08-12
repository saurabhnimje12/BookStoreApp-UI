import axios from "axios";

const API_BASE_URL = "http://localhost:8080/";

export const getBooks = async () => {
  const response = await axios.get(`${API_BASE_URL}book/allBooks`);
  return response.data;
};

