const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const resultsSection = document.getElementById("searchSection");
    const resultsContainer = document.getElementById("results");

    const popularList = [
    "The Silent Patient Alex Michaelides",
    "Atomic Habits James Clear",
    "It Ends With Us Colleen Hoover",
    "The Alchemist Paulo Coelho",
    "The Psychology of Money Morgan Housel"
    ];

    // search book data...
    async function searchBooks(query) {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        const data = await response.json();

        resultsContainer.innerHTML = ""; // clear old results

        if (!data.items) {
          resultsContainer.innerHTML = "<p class='text-gray-600'>No books found.</p>";
          return;
        }

        resultsSection.classList.remove("hidden"); // show results section

        data.items.forEach(book => {
          const info = book.volumeInfo;
          const thumbnail = info.imageLinks ? info.imageLinks.thumbnail : "/assets/default-book.png";
          

          const card = document.createElement("div");
          card.className = "bg-white rounded-lg shadow-lg p-4 hover:scale-105 transition-transform duration-200";

          card.innerHTML = `
            <img src="${thumbnail}" alt="${info.title}" class="rounded-md w-full h-[250px] object-cover">
            <h3 class="mt-3 text-lg font-semibold text-gray-800">${info.title}</h3>
            <p class="text-sm text-gray-500">${info.authors ? info.authors.join(", ") : "Unknown Author"}</p>
            <p class="text-sm text-gray-600 mt-1">${info.publishedDate ? info.publishedDate : ""}</p>
          `;

          resultsContainer.appendChild(card);

          card.innerHTML = `
  <img src="${thumbnail}" class="rounded-md w-full h-[250px] object-cover">
  <h3 class="mt-3 text-lg font-semibold text-gray-800">${info.title}</h3>
  <p class="text-sm text-gray-500">${info.authors ? info.authors.join(", ") : "Unknown Author"}</p>
`;

card.addEventListener("click", () => {
  const selectedBook = {
  title: info.title,
  authors: info.authors,
  description: info.description,
  published: info.publishedDate,
  image: thumbnail,
  preview: info.previewLink,
  infoLink: info.infoLink
};

  localStorage.setItem("selectedBook", JSON.stringify(selectedBook));

  window.location.href = "details.html";
});

        });
      } catch (error) {
        console.error("Error fetching books:", error);
        resultsContainer.innerHTML = "<p class='text-red-600'>Something went wrong. Please try again later.</p>";
      }
    }

    // Load popular books data section....

async function loadPopularBooks() {
  const popularContainer = document.querySelector("#popularBooks .grid"); 
  popularContainer.innerHTML = ""; // clear static HTML

  for (const query of popularList) {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();

      if (!data.items || data.items.length === 0) continue;

      const book = data.items[0];
      const info = book.volumeInfo;

      const thumbnail = info.imageLinks ? info.imageLinks.thumbnail : "/assets/default-book.png";

      const card = document.createElement("div");
      card.className = "popular-card bg-white rounded-lg shadow-lg p-4 hover:scale-105 transition-transform duration-200";

      card.innerHTML = `
        <img src="${thumbnail}" class="rounded-md w-full h-[250px] object-cover">
        <h3 class="mt-3 text-lg font-semibold text-gray-800">${info.title}</h3>
        <p class="text-sm text-gray-500">${info.authors ? info.authors.join(", ") : "Unknown Author"}</p>
      `;

      popularContainer.appendChild(card);

      // CLICK EVENT → DETAILS PAGE
      card.addEventListener("click", () => {

        const selectedBook = {
          title: info.title,
          authors: info.authors ? info.authors.join(", ") : "Unknown",
          description: info.description || "No description available.",
          published: info.publishedDate || "N/A",
          image: thumbnail,

          // SAFEST PREVIEW FALLBACKS
          preview: info.previewLink 
                   || (book.accessInfo && book.accessInfo.webReaderLink)
                   || "",

          infoLink: info.infoLink 
                    || `https://books.google.com/books?id=${book.id}`
        };

        localStorage.setItem("selectedBook", JSON.stringify(selectedBook));
        window.location.href = "details.html";
      });

    } catch (error) {
      console.error("Error loading popular book:", error);
    }
  }
}

loadPopularBooks();


    // Search when clicking the icon
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query !== "") searchBooks(query);
    });

    // Search when pressing Enter
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query !== "") searchBooks(query);
      }
    });

  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill all fields!");
      return;
    }

    const newMessage = { name, email, message, date: new Date().toLocaleString() };

    try {
      const response = await fetch("http://localhost:3001/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage)
      });

      if (response.ok) {
        alert("Message sent successfully!");
        
        form.reset();
      } else {
        alert("Something went wrong. Try again!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to server. Make sure JSON Server is running.");
    }
  });