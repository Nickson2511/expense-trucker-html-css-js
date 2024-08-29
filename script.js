// Grabbing elements from the DOM (Document Object Model) to manipulate later
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Retrieve transactions from localStorage if they exist, otherwise start with an empty array
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault(); // Prevent form from submitting the traditional way (reloading the page)

  // Check if text or amount is empty, and alert the user if so
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    // Create a new transaction object with a unique ID, text, and amount
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value // Convert amount to a number
    };

    // Add the new transaction to the transactions array
    transactions.push(transaction);

    // Add the transaction to the DOM (to be displayed on the page)
    addTransactionDOM(transaction);

    // Update the balance, income, and expense values
    updateValues();

    // Save the transactions to localStorage
    updateLocalStorage();

    // Clear the form inputs for the next transaction
    text.value = '';
    amount.value = '';
  }
}

// Function to generate a random ID for each transaction
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Function to add a transaction to the DOM list
function addTransactionDOM(transaction) {
  // Determine if the transaction is an income or expense
  const sign = transaction.amount < 0 ? '-' : '+';

  // Create a new list item element (li) for the transaction
  const item = document.createElement('li');

  // Add a class to the list item based on whether it's an income or expense
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  // Set the inner HTML of the list item to include the transaction text, amount, and a delete button
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  // Add the list item to the transaction list in the DOM
  list.appendChild(item);
}

// Function to update the balance, income, and expense values
function updateValues() {
  // Create an array of all transaction amounts
  const amounts = transactions.map(transaction => transaction.amount);

  // Calculate the total balance by summing all transaction amounts
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  // Calculate the total income by summing all positive transaction amounts
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);

  // Calculate the total expense by summing all negative transaction amounts
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  // Update the DOM with the new balance, income, and expense values
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Function to remove a transaction by its ID
function removeTransaction(id) {
  // Filter out the transaction with the matching ID from the transactions array
  transactions = transactions.filter(transaction => transaction.id !== id);

  // Update localStorage with the remaining transactions
  updateLocalStorage();

  // Reinitialize the app to update the DOM
  init();
}

// Function to update localStorage with the current transactions array
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to initialize the app
function init() {
  // Clear the current transaction list in the DOM
  list.innerHTML = '';

  // Add each transaction in the transactions array to the DOM
  transactions.forEach(addTransactionDOM);

  // Update the balance, income, and expense values
  updateValues();
}

// Initialize the app when the script first runs
init();

// Add an event listener to the form to listen for the submit event and trigger addTransaction
form.addEventListener('submit', addTransaction);
