import axios from "axios";
import { API } from "../constants";

const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export async function login(email, password) {
  try {
    const { data } = await api.post("/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log(`Ошибка входа ${error.message}`);
    throw error;
  }
}

export async function registration(email, password) {
  try {
    const { data } = await api.post("/register", {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log(`Ошибка регистрации ${error.message}`);
    throw error;
  }
}

export async function getUser(id) {
  try {
    const { data } = await api.get(`/users/${id}`);
    return data;
  } catch (error) {
    console.log(`Ошибка получения данных ${error.message}`);
    throw error;
  }
}
