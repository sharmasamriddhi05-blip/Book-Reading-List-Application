/* =====================================================
   1. GET THE PARTS OF THE PAGE
   ===================================================== */
const bookForm = document.getElementById("book-form");
const titleInput = document.getElementById("title-input");
const authorInput = document.getElementById("author-input");
const statusInput = document.getElementById("status-input");
const formError = document.getElementById("form-error");
const bookList = document.getElementById("book-list");
const emptyMessage = document.getElementById("empty-message");
const filterButtons = document.querySelectorAll(".filter-btn");

const countTotal = document.getElementById("count-total");
const countToRead = document.getElementById("count-to-read");
const countReading = document.getElementById("count-reading");
const countFinished = document.getElementById("count-finished");

// The three possible statuses, with the words shown on screen
const STATUS_LABELS = {
  "to-read": "To read",
  "reading": "Reading",
  "finished": "Finished",
};

/* =====================================================
   2. SAVING AND LOADING  (so books stay after you close the page)
   The browser's localStorage keeps text, so we turn the list into
   text with JSON.stringify and back into a list with JSON.parse.
   ===================================================== */
function loadBooks() {
  try {
    const saved = localStorage.getItem("readingList");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return []; // if saving is blocked, just start with an empty list
  }
}

function saveBooks() {
  try {
    localStorage.setItem("readingList", JSON.stringify(books));
  } catch (error) {
    // saving is blocked: the app still works, but the list will not be remembered
  }
}

/* =====================================================
   3. VARIABLES THAT REMEMBER THE CURRENT STATE
   ===================================================== */
let books = loadBooks();     // the list of all books
let currentFilter = "all";   // which filter button is selected

/* =====================================================
   4. SHOWING EVERYTHING ON THE PAGE
   ===================================================== */

// Update the four numbers at the top
function updateCounts() {
  countTotal.textContent = books.length;
  countToRead.textContent = books.filter((b) => b.status === "to-read").length;
  countReading.textContent = books.filter((b) => b.status === "reading").length;
  countFinished.textContent = books.filter((b) => b.status === "finished").length;
}

// Build the list on screen from the books array
function render() {
  bookList.innerHTML = ""; // clear the old list

  // Keep only the books that match the selected filter
  const visibleBooks =
    currentFilter === "all"
      ? books
      : books.filter((b) => b.status === currentFilter);

  visibleBooks.forEach((book) => {
    const item = document.createElement("li");
    item.className = "book " + book.status;

    // Title and author (textContent keeps typed text safe)
    const info = document.createElement("div");
    info.className = "book-info";
    const title = document.createElement("strong");
    title.textContent = book.title;
    const author = document.createElement("span");
    author.textContent = book.author ? "by " + book.author : "Author unknown";
    info.appendChild(title);
    info.appendChild(author);

    // Dropdown to change the status
    const statusSelect = document.createElement("select");
    statusSelect.setAttribute("aria-label", "Change status of " + book.title);
    Object.keys(STATUS_LABELS).forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = STATUS_LABELS[value];
      if (value === book.status) option.selected = true;
      statusSelect.appendChild(option);
    });
    statusSelect.addEventListener("change", () => changeStatus(book.id, statusSelect.value));

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteBook(book.id));

    const actions = document.createElement("div");
    actions.className = "book-actions";
    actions.appendChild(statusSelect);
    actions.appendChild(deleteBtn);

    item.appendChild(info);
    item.appendChild(actions);
    bookList.appendChild(item);
  });

  // Show a message when there is nothing to display
  emptyMessage.classList.toggle("hidden", visibleBooks.length > 0);

  updateCounts();
}

/* =====================================================
   5. ACTIONS: ADD, CHANGE STATUS, DELETE, FILTER
   ===================================================== */
function addBook(title, author, status) {
  books.push({
    id: Date.now() + Math.random(), // a unique number for each book
    title: title,
    author: author,
    status: status,
  });
  saveBooks();
  render();
}

function changeStatus(id, newStatus) {
  const book = books.find((b) => b.id === id);
  if (book) book.status = newStatus;
  saveBooks();
  render();
}

function deleteBook(id) {
  books = books.filter((b) => b.id !== id); // keep every book except this one
  saveBooks();
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach((button) =>
    button.classList.toggle("active", button.dataset.filter === filter)
  );
  render();
}

/* =====================================================
   6. CONNECT THE FORM AND BUTTONS
   ===================================================== */
bookForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (title === "") {
    formError.textContent = "Please enter the book title.";
    return;
  }

  formError.textContent = "";
  addBook(title, author, statusInput.value);

  titleInput.value = "";
  authorInput.value = "";
  statusInput.value = "to-read";
  titleInput.focus();
});

filterButtons.forEach((button) =>
  button.addEventListener("click", () => setFilter(button.dataset.filter))
);

// Show the saved books as soon as the page opens
render();
