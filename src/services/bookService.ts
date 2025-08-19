import axios from "axios";

/**
 * Service to interact with the book API.
 * This service provides methods to fetch book data from the backend.
 * It uses Axios for making HTTP requests.
 * The API base URL is set to a local server running on port 8080.
 */
const API_BASE_URL = "http://localhost:8080/";

/**
 * Fetches all books from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of books.
 */
export const getBooks = async () => {
  const response = await axios.get(`${API_BASE_URL}book/allBooks`);
  return response.data;
};

