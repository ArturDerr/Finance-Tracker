import { registration } from "../../../api/auth-api.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const repeatPasswordInput = document.getElementById("repeat-password");
const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const repeatPassword = repeatPasswordInput.value;

  if (password === repeatPassword) {
    try {
      const data = await registration(email, password);
      window.location.href = "/src/pages/main/dashboard/dashboard.html";
    } catch (error) {
      console.error("Ошибка", error);
      alert("Ошибка входа");
    }
  } else {
    alert("Пароли не совпадают!");
  }
});
