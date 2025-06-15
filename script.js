// Select DOM elements
const form = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");
const typeFilter = document.getElementById("type-filter");
const dateFilter = document.getElementById("date-filter");
const transactionsBody = document.getElementById("transactions-body");
const totalDisplay = document.getElementById("total");

// Load transactions from localStorage or start with an empty array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
updateUI();

// Add new Transaction on form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const type = typeInput.value;
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const date = dateInput.value;

  if (!type || !description || isNaN(amount) || !date) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const adjustedAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);

  const transaction = {
    id: Date.now(),
    type,
    description,
    amount: adjustedAmount,
    date,
  };

  transactions.push(transaction);
  saveAndUpdate();
  form.reset();
});

// Save transactions to localStorage and update UI
function saveAndUpdate() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI();
}

// Delete transaction by ID
function deleteExpense(id) {
  transactions = transactions.filter(exp => exp.id !== id);
  saveAndUpdate();
}

// Edit transaction (pre-fills form, deletes old record)
function editExpense(id) {
  const transaction = transactions.find(exp => exp.id === id);
  if (!transaction) return;

  typeInput.value = transaction.type;
  descriptionInput.value = transaction.description;
  amountInput.value = Math.abs(transaction.amount);
  dateInput.value = transaction.date;

  transactions = transactions.filter(exp => exp.id !== id);
  saveAndUpdate();
}

// Update the list and total balance
function updateUI() {
  transactionsBody.innerHTML = "";
  let total = 0;

  transactions
    .filter(exp => {
      const matchesType =
        !typeFilter || !typeFilter.value ||
        typeFilter.value === "all" ||
        typeFilter.value === exp.type;

      const matchesDate =
        !dateFilter || !dateFilter.value ||
        exp.date === dateFilter.value;

      return matchesType && matchesDate;
    })
    .forEach(exp => {
      total += exp.amount;

      const tr = document.createElement("tr");
      tr.className = exp.type === "income" ? "income" : "expense";

      tr.innerHTML = `
        <td>${capitalize(exp.type)}</td>
        <td>RWF${exp.amount.toFixed(2)}</td>
        <td>${exp.date}</td>
        <td>
          <button title="Edit" onclick="editExpense(${exp.id})">✏️</button>
          <button title="Delete" onclick="deleteExpense(${exp.id})">🗑️</button>
        </td>
      `;

      transactionsBody.appendChild(tr);
    });

  totalDisplay.textContent = `Total Balance: RWF${total.toFixed(2)}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Filter events (optional, if you add dropdowns for filtering)
if (typeFilter) typeFilter.addEventListener("change", updateUI);
if (dateFilter) dateFilter.addEventListener("change", updateUI);
