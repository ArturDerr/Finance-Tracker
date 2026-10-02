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

/**
 expenses - доходы 
 transactions - расходы
 */

export async function getExpenses(params = {}) {
  try {
    const { data } = await api.get("/expenses", {
      params,
    });
    return data;
  } catch (error) {
    console.log(`Ошибка получения операций ${error.message}`);
    throw error;
  }
}

export async function getExpense(id) {
  try {
    const { data } = await api.get(`/expenses/${id}`);
    return data;
  } catch (error) {
    console.log(`Ошибка получения операции ${error.message}`);
    throw error;
  }
}

export async function createExpense(expenses) {
  try {
    const { data } = await api.post("/expenses", expenses);
    return data;
  } catch (error) {
    console.log(`Ошибка создания операции: ${error.message}`);
    throw error;
  }
}

export async function updateExpense(id, expenses) {
  try {
    const { data } = await api.put(`/expenses/${id}`, expenses);
    return data;
  } catch (error) {
    console.log(`Ошибка обновления операции ${error.message}`);
    throw error;
  }
}

export async function deleteExpenses(id) {
  try {
    const { data } = await api.delete(`/expenses/${id}`);
    return data;
  } catch (error) {
    console.log(`Ошибка удаления операции ${error.message}`);
    throw error;
  }
}
