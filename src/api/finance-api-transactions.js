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

export async function getTransactions(params = {}) {
  try {
    const { data } = await api.get("/transactions", {
      params,
    });
    return data;
  } catch (error) {
    console.log(`Ошибка получения операций ${error.message}`);
    throw error;
  }
}

export async function getTransaction(id) {
  try {
    const { data } = await api.get(`/transactions/${id}`);
    return data;
  } catch (error) {
    console.log(`Ошибка получения операции ${error.message}`);
    throw error;
  }
}

export async function createTransaction(transaction) {
  try {
    const { data } = await api.post("/transactions", transaction);
    return data;
  } catch (error) {
    console.log(`Ошибка создания операции: ${error.message}`);
    throw error;
  }
}

export async function updateTransaction(id, transaction) {
  try {
    const { data } = await api.put(`/transactions/${id}`, transaction);
    return data;
  } catch (error) {
    console.log(`Ошибка обновления операции ${error.message}`);
    throw error;
  }
}

export async function deleteTransaction(id) {
  try {
    const { data } = await api.delete(`/transactions/${id}`);
    return data;
  } catch (error) {
    console.log(`Ошибка удаления операции ${error.message}`);
    throw error;
  }
}
