let quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  {
    text: "Be yourself; everyone else is already taken.",
    category: "Inspiration",
  },
  { text: "Dream big and dare to fail.", category: "Success" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  quoteDisplay.innerHTML = "";
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;
  const quoteCategory = document.createElement("em");
  quoteCategory.textContent = `— ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

function createAddQuoteForm() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
  } else {
    alert("Please enter both quote and category.");
  }
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing the file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((q) => q.category))];
  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    filter.value = savedCategory;
    filterQuotes();
  }
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  quoteDisplay.innerHTML = "";

  const filteredQuotes =
    selected === "all" ? quotes : quotes.filter((q) => q.category === selected);

  filteredQuotes.forEach((quote) => {
    const p = document.createElement("p");
    p.innerHTML = `"${quote.text}" <em>— ${quote.category}</em>`;
    quoteDisplay.appendChild(p);
  });
}

function fetchServerQuotes() {
  fetch(serverUrl)
    .then((res) => res.json())
    .then((data) => {
      const serverQuotes = data.slice(0, 5).map((post) => ({
        text: post.title,
        category: "Server",
      }));

      resolveConflicts(serverQuotes);
    })
    .catch((err) => console.error("Server fetch failed", err));
}

function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  const mergedQuotes = [...serverQuotes];
  localQuotes.forEach((quote) => {
    if (!serverQuotes.some((sq) => sq.text === quote.text)) {
      mergedQuotes.push(quote);
    }
  });

  quotes = mergedQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();
  notifyUser("Quotes synced with server.");
}

function notifyUser(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "#ffd";
  note.style.border = "1px solid #ccc";
  note.style.padding = "10px";
  note.style.marginTop = "10px";
  document.body.prepend(note);
  setTimeout(() => note.remove(), 5000);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

loadQuotes();
showRandomQuote();
populateCategories();
filterQuotes();
fetchServerQuotes();
setInterval(fetchServerQuotes, 30000);
