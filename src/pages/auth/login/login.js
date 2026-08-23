import { login } from "../../../api/auth-api.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const data = await login(email, password);
    console.log(data);
  } catch (error) {
    console.error("Ошибка", error);
    alert("Ошибка входа");
  }
});
