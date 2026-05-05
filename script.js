// DOM Elements
const balanceEl = document.getElementById("balance");
const moneyPlusEl = document.getElementById("money-plus");
const moneyMinusEl = document.getElementById("money-minus");
const historyEl = document.getElementById("history");
const form = document.getElementById("form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");

// Sample transactions (will be replaced with localStorage)
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Initialize app
function init() {
  historyEl.innerHTML = "";
  transactions.forEach(addTransactionToDOM);
  updateValues();
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (textInput.value.trim() === "" || amountInput.value.trim() === "") {
    alert("Please add a text and amount");
    return;
  }

  const transaction = {
    id: generateID(),
    text: textInput.value,
    amount: +amountInput.value,
  };

  transactions.push(transaction);
  addTransactionToDOM(transaction);
  updateValues();
  updateLocalStorage();

  textInput.value = "";
  amountInput.value = "";
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionToDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
        ${transaction.text} 
        <span>${sign}${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

  historyEl.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balanceEl.innerText = `${total}`;
  moneyPlusEl.innerText = `+${income}`;
  moneyMinusEl.innerText = `-${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Event listeners
form.addEventListener("submit", addTransaction);

// Initialize app
init();
