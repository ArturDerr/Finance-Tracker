import { createTransaction } from "../../../api/finance-api-transactions.js";

const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const summInput = document.getElementById("summ");
const loginForm = document.getElementById("fin-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const transaction = {
    title: nameInput.value,
    category: categoryInput.value,
    date: dateInput.value,
    amount: Number(summInput.value),
  };

  try {
    const data = await createTransaction(transaction);
    window.location.href = "";
  } catch (error) {
    console.error("Ошибка", error);
    alert("Ошибка создания расхода");
  }
});
