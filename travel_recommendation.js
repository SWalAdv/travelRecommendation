const recommendations = [
    "Visit Paris for great food and culture",
    "Try yoga for relaxation",
    "Read books about mindfulness",
    "Explore web development tutorials",
    "Travel to Iceland for nature lovers",
    "Take a hip-hop dance class"
  ];
  
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resetButton = document.getElementById("resetButton");
  const resultsDiv = document.getElementById("results");
  
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    resultsDiv.innerHTML = "";
  
    if (query === "") {
      resultsDiv.innerHTML = "<p>Please enter a keyword to search.</p>";
      return;
    }
  
    const filtered = recommendations.filter(item =>
      item.toLowerCase().includes(query)
    );
  
    if (filtered.length === 0) {
      resultsDiv.innerHTML = "<p>No recommendations found.</p>";
    } else {
      const list = document.createElement("ul");
      filtered.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
      resultsDiv.appendChild(list);
    }
  });
  
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    resultsDiv.innerHTML = "";
  });
  