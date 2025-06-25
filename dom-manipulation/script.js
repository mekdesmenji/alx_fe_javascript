let quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  {
    text: "Be yourself; everyone else is already taken.",
    category: "Inspiration",
  },
  { text: "Dream big and dare to fail.", category: "Success" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

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

    quoteDisplay.innerHTML = "";

    const quoteTextElem = document.createElement("p");
    quoteTextElem.textContent = `"${newQuote.text}"`;

    const quoteCategoryElem = document.createElement("em");
    quoteCategoryElem.textContent = `— ${newQuote.category}`;

    quoteDisplay.appendChild(quoteTextElem);
    quoteDisplay.appendChild(quoteCategoryElem);

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

newQuoteBtn.addEventListener("click", showRandomQuote);

showRandomQuote();
