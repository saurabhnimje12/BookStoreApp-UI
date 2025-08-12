import axios from "axios";
const API_BASE_URL = "http://localhost:8080/";

export const signUp = async (data: any) => {
  return axios.post(`${API_BASE_URL}user/userRegistration`, data);
};

export const signIn = async (data: any) => {
  return axios.post(`${API_BASE_URL}user/login`, data);
};

