let items = [];

// Load JSON once
async function loadData() {
  if (items.length > 0) return;
  const response = await fetch("travel_recommendation_api.json");
  const data = await response.json();

  // Countries link to Cities
  data.countries.forEach(country => {
    country.cities.forEach(city => {
      items.push({
        name: city.name,
        description: city.description,
        imageUrl: city.imageUrl
      });
    });
  });

  // Temples
  data.temples.forEach(t => items.push(t));

  // Beaches
  data.beaches.forEach(b => items.push(b));
}

// Keywird searches with lowerCase conversion
async function travelRecommendationSearch(query) {
  await loadData();
  query = query.toLowerCase();

  return items.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );
}

// Display results
function displayResults(results) {
  const list = document.getElementById("results");
  list.innerHTML = "";

  if (results.length === 0) {
    list.innerHTML = "<li>No results found.</li>";
    return;
  }

  results.forEach(item => {
    const li = document.createElement("li");

    if (item.imageUrl) {
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.width = 140;
      li.appendChild(img);
    }

    li.appendChild(document.createTextNode(item.name));
    list.appendChild(li);
  });
}

// Form handling
document.getElementById("searchForm").addEventListener("submit", async e => {
  e.preventDefault();
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  const results = await travelRecommendationSearch(query);
  displayResults(results);
});

// Reset button
document.getElementById("resetButton").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  document.getElementById("results").innerHTML = "";
});
