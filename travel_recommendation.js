// Example recommendation list (you can replace this later with API results)
const recommendations = [
    "Visit Paris for great food and culture",
    "Try yoga for relaxation",
    "Read books about mindfulness",
    "Explore web development tutorials",
    "Travel to Iceland for nature lovers",
    "Take a hip-hop dance class"
];

// DOM elements
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

// Main search function (HTML calls this)
function travelRecommendationSearch(query) {
    const filtered = recommendations.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
    );
    return filtered;
}

// Display results on the page
function displayResults(results) {
    resultsDiv.innerHTML = "";

    if (!results || results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    const list = document.createElement("ul");

    results.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });

    resultsDiv.appendChild(list);
}

// Handle SEARCH button (form submit)
document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const query = searchInput.value.trim();
    if (query === "") {
        resultsDiv.innerHTML = "<p>Please enter a keyword to search.</p>";
        return;
    }

    const results = travelRecommendationSearch(query);
    displayResults(results);
});

// Handle RESET button
document.getElementById("resetButton").addEventListener("click", function() {
    searchInput.value = "";
    resultsDiv.innerHTML = "";
});
