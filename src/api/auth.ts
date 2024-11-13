import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/v1"; // Replace with your API URL

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  return response.data;
};

export const authAxios = axios.create({
  baseURL: API_URL,
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
