import {auth, db} from "./firebase-config.js";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";

// =================== AUTH CHECK ===================
let currentUser = localStorage.getItem("email");

onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is signed in:", user.email);
    currentUser = user.email;
    loadItems();
  } else {
    window.location.href = "/auth.html";
  }
});

// =================== LOGOUT FUNCTION ===================
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "/auth.html";
});

// =================== ITEM CRUD ===================
const itemForm = document.getElementById("item-form");
const itemList = document.getElementById("items");
const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const balanceEl = document.getElementById("balance");
const categoryFilter = document.getElementById("category-filter");
const monthFilter = document.getElementById("month-filter");

let totalIncome = 0;
let totalExpenses = 0;

// Load Items from LocalStorage
const loadItems = () => {
  itemList.innerHTML = "";
  totalIncome = 0;
  totalExpenses = 0;

  const allItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
  allItems.forEach(item => {
    if (item.email === currentUser) {
      addItemToUI(item);
      updateSummary(item);
    }
  });
};

// Add Item Function (Moved Above to Fix Scope Issue)
const addItem = (name, amount, category) => {
  const item = {
    id: Date.now().toString(),
    name: name || "Unnamed Item",
    amount,
    category,
    email: currentUser,
    timestamp: new Date().toISOString(),
  };

  const allItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
  allItems.push(item);
  localStorage.setItem("budgetItems", JSON.stringify(allItems));

  addItemToUI(item);
  updateSummary(item);
};

// Add Item via Form Submission
itemForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("item-name").value.trim();
  const amount = parseFloat(document.getElementById("item-amount").value);
  const category = document.getElementById("item-category").value;

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid name and amount.");
    return;
  }

  addItem(name, amount, category);
  itemForm.reset();
});

// Display Item in UI
function addItemToUI(item) {
  const li = document.createElement("li");
  li.setAttribute("data-id", item.id);
  li.textContent = `${item.name} - $${item.amount} [${item.category}]`;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editItem(item.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteItem(item.id));

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  itemList.appendChild(li);
}

// Update Totals
function updateSummary(item) {
  if (item.category === "income") {
    totalIncome += item.amount;
  } else {
    totalExpenses += item.amount;
  }
  totalIncomeEl.textContent = `$${totalIncome}`;
  totalExpensesEl.textContent = `$${totalExpenses}`;
  balanceEl.textContent = `$${totalIncome - totalExpenses}`;
}

// Edit Item
const editItem = id => {
  const allItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
  const item = allItems.find(itm => itm.id === id);

  const newName = prompt("Edit item name:", item.name);
  const newAmount = parseFloat(prompt("Edit amount:", item.amount));

  if (newName && !isNaN(newAmount)) {
    item.name = newName;
    item.amount = newAmount;

    localStorage.setItem("budgetItems", JSON.stringify(allItems));
    loadItems();
  }
};

// Delete Item
const deleteItem = id => {
  let allItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
  allItems = allItems.filter(itm => itm.id !== id);

  localStorage.setItem("budgetItems", JSON.stringify(allItems));
  loadItems();
};

// =================== FILTERING ===================

// Filter by Category
categoryFilter.addEventListener("change", () => {
  const selectedCategory = categoryFilter.value;
  const allItems = JSON.parse(localStorage.getItem("budgetItems")) || [];

  itemList.innerHTML = "";

  allItems.forEach(item => {
    if (
      item.email === currentUser &&
      (selectedCategory === "all" || item.category === selectedCategory)
    ) {
      addItemToUI(item);
    }
  });
});

// Filter by Month
monthFilter.addEventListener("change", () => {
  const selectedMonth = monthFilter.value;
  const allItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
  const monthlyList = document.getElementById("monthly-list");

  monthlyList.innerHTML = "";

  allItems.forEach(item => {
    const itemDate = new Date(item.timestamp);
    const itemMonth = `${itemDate.getFullYear()}-${String(
      itemDate.getMonth() + 1
    ).padStart(2, "0")}`;

    if (item.email === currentUser && itemMonth === selectedMonth) {
      const li = document.createElement("li");
      li.textContent = `${item.name} - $${item.amount} [${item.category}]`;
      monthlyList.appendChild(li);
    }
  });
});
// =================== FETCH OPENAI API KEY FROM FIRESTORE ===================
const fetchOpenAIKey = async () => {
  try {
    const docRef = doc(db, "config", "openai");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const apiKey = docSnap.data().apiKey;
      console.log("Fetched OpenAI Key from Firestore:", apiKey);
      return apiKey;
    } else {
      console.error("No OpenAI API key found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching OpenAI API key from Firestore:", error);
  }
};

// =================== CHATBOT (Enhanced) ===================
const chatbotInput = document.getElementById("chatbot-input");
const chatbotSendBtn = document.getElementById("chatbot-send");
const chatbotWindow = document.getElementById("chatbot-window");

const appendMessage = (sender, message) => {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(sender);
  msgDiv.textContent = `${sender}: ${message}`;
  chatbotWindow.appendChild(msgDiv);
};

// Call OpenAI with Firestore API Key
const callOpenAI = async userMessage => {
  const apiKey = await fetchOpenAIKey();
  if (!apiKey) {
    appendMessage("Bot", "Unable to access AI services. Missing API Key.");
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: userMessage}],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const reply = data.choices[0].message.content;
      appendMessage("Bot", reply);
      processAICommand(userMessage.toLowerCase());
    } else {
      console.error("OpenAI API Error:", data);
      appendMessage("Bot", "Sorry, something went wrong with OpenAI.");
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    appendMessage("Bot", "Error connecting to AI.");
  }
};

chatbotSendBtn.addEventListener("click", async () => {
  const userMessage = chatbotInput.value.trim();
  if (!userMessage) return;

  appendMessage("You", userMessage);
  chatbotInput.value = "";

  await callOpenAI(userMessage);
});

// =================== PROCESS AI COMMANDS ===================
const processAICommand = message => {
  // Improved Regex to handle phrases like "I bought a candy for $2"
  const addRegex =
    /(buy|bought|spent|earned|received|got|income|expense)\s*(?:a|an|the)?\s*(.*?)\s*(?:for|of)?\s*\$?(\d+(\.\d{1,2})?)/i;
  const addMatch = message.match(addRegex);

  if (addMatch) {
    const action = addMatch[1].toLowerCase();
    const itemName = addMatch[2] || "Unnamed Item";
    const amount = parseFloat(addMatch[3]);

    let category = "expense";
    if (["earned", "received", "income", "got"].includes(action)) {
      category = "income";
    }

    addItem(itemName.trim(), amount, category);
    appendMessage("Bot", `Added ${category} of $${amount} for ${itemName}`);
    return;
  }

  // Delete all items
  if (message.includes("delete all") || message.includes("remove all")) {
    deleteAllItems();
    appendMessage("Bot", "All items deleted.");
    return;
  }

  // Show balance
  if (message.includes("balance") || message.includes("total")) {
    appendMessage(
      "Bot",
      `Your current balance is $${totalIncome - totalExpenses}`
    );
    return;
  }

  // Fallback
  appendMessage("Bot", "I couldn't understand the command. Please try again.");
};
const deleteAllItems = () => {
  localStorage.removeItem("budgetItems");
  loadItems();
  appendMessage("Bot", "All items have been deleted.");
};
