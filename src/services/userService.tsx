import axios from "axios";

/**
 * Service to interact with the user API.
 * This service provides methods for user registration and login.
 * It uses Axios for making HTTP requests.
 * The API base URL is set to a local server running on port 8080.
 */
const API_BASE_URL = "http://localhost:8080/";

/**
 * Registers a new user.
 * @param {any} data - The user data for registration.
 * @returns {Promise} A promise that resolves when the user is successfully registered.
 */
export const signUp = async (data: any) => {
  return axios.post(`${API_BASE_URL}user/userRegistration`, data);
};

/**
 * Logs in a user.
 * @param {any} data - The user credentials for login.
 * @returns {Promise} A promise that resolves with the user data upon successful login.
 */
export const signIn = async (data: any) => {
  return axios.post(`${API_BASE_URL}user/login`, data);
};

