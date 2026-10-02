import { deleteTransaction, getTransactions } from "../../../api/finance-api-transactions.js";

const text = document.getElementById("text-fin");
const deletBtn = document.getElementById("delete-button");

const data = await getTransactions();

deletBtn.addEventListener("click", async (e) => {
  deleteTransaction(data.id)
})

text.innerHTML = data
  .map(
    (transaction) => `
      <div>
        <h3>${transaction.title}</h3>
        <p>${transaction.amount} ₽</p>
        <p>${transaction.category}</p>
        <p>${transaction.date}</p>
      </div>
    `,
  )
  .join("");
