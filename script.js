// Select DOM elements
const form = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const expensesList = document.getElementById("expenses-list");
const totalDisplay = document.getElementById("total");
const typeFilter = document.getElementById("type-filter");
const dateFilter = document.getElementById("date-filter");


// Load expenses from localStorage or start with an empty array
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
updateUI();

// Add new expense on form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const date = dateInput.value;

  if (!description || isNaN(amount) || !date) {
    alert("Please fill in all fields with valid data.");
    return;
  }

  const expense = {
    id: Date.now(), // unique ID
    description,
    amount,
    date,
  };

  expenses.push(expense);
  saveAndUpdate();
  form.reset();
});

// Save expenses to localStorage and update UI
function saveAndUpdate() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateUI();
}

// Delete expense by ID
function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  saveAndUpdate();
}

// Edit expense (pre-fills form, deletes old record)
function editExpense(id) {
  const expense = expenses.find(exp => exp.id === id);
  if (!expense) return;

  descriptionInput.value = expense.description;
  amountInput.value = expense.amount;
  dateInput.value = expense.date;

  expenses = expenses.filter(exp => exp.id !== id);
  saveAndUpdate();
}

// Update the list and total balance
function updateUI() {
  const incomeList = document.getElementById("income-list");
  const expenseList = document.getElementById("expense-list");
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";
  let total = 0;

  expenses
  .filter(exp => {
    const matchesType =
      typeFilter.value === "all" ||
      (typeFilter.value === "income" && exp.amount >= 0) ||
      (typeFilter.value === "expense" && exp.amount < 0);

    const matchesDate =
      !dateFilter.value || exp.date === dateFilter.value;

    return matchesType && matchesDate;
  })
  .forEach(exp => {

    total += exp.amount;

    const li = document.createElement("li");
    li.innerHTML = `
  <span>${exp.description} (${exp.date})</span>
  <span>
    $${exp.amount.toFixed(2)}
    <button title="Edit" onclick="editExpense(${exp.id})">✏️</button>
    <button title="Delete" onclick="deleteExpense(${exp.id})">🗑️</button>
  </span>
`;


    if (exp.amount >= 0) {
      li.className = "income";
      incomeList.appendChild(li);
    } else {
      li.className = "expense";
      expenseList.appendChild(li);
    }
  });

  totalDisplay.textContent = `Total Balance: $${total.toFixed(2)}`;
}
typeFilter.addEventListener("change", updateUI);
dateFilter.addEventListener("change", updateUI);
