// travel_recommendation.js

// data store
let items = [];
let loaded = false;

// load JSON and flatten
async function loadData() {
  if (loaded) return;
  const r = await fetch('travel_recommendation_api.json', { cache: 'no-store' });
  const j = await r.json();

  if (Array.isArray(j.countries)) {
    j.countries.forEach(c => {
      const country = c.name || '';
      if (Array.isArray(c.cities)) {
        c.cities.forEach(city => items.push({
          name: city.name || '',
          description: city.description || '',
          imageUrl: city.imageUrl || '',
          category: 'city',
          country
        }));
      }
    });
  }

  if (Array.isArray(j.temples)) {
    j.temples.forEach(t => items.push({
      name: t.name || '',
      description: t.description || '',
      imageUrl: t.imageUrl || '',
      category: 'temple'
    }));
  }

  if (Array.isArray(j.beaches)) {
    j.beaches.forEach(b => items.push({
      name: b.name || '',
      description: b.description || '',
      imageUrl: b.imageUrl || '',
      category: 'beach'
    }));
  }

  loaded = true;
}

// simple synonyms
const SYN = {
  beach: ['beach','beaches','coast','seaside','sand'],
  temple: ['temple','temples','shrine']
};

// detect category keyword
function detectCat(q) {
  for (const k in SYN) if (SYN[k].some(s => q.includes(s))) return k;
  return null;
}

// perform search, guarantee >=2 results
async function search(q) {
  await loadData();
  q = (q || '').toLowerCase().trim();
  if (!q) return [];

  // 1) category keywords
  const cat = detectCat(q);
  let res = cat ? items.filter(it => it.category === cat) : [];

  // 2) country match
  if (res.length === 0) {
    res = items.filter(it => it.country && it.country.toLowerCase().includes(q));
  }

  // 3) name/description match
  if (res.length === 0) {
    res = items.filter(it =>
      (it.name && it.name.toLowerCase().includes(q)) ||
      (it.description && it.description.toLowerCase().includes(q))
    );
  }

  // 4) token fallback
  if (res.length === 0 && q.includes(' ')) {
    const t = q.split(/\s+/);
    res = items.filter(it => t.some(tok =>
      (it.name && it.name.toLowerCase().includes(tok)) ||
      (it.description && it.description.toLowerCase().includes(tok))
    ));
  }

  // ensure at least 2: supplement from same category then any
  if (res.length < 2) {
    const sameCat = (res[0] && res[0].category) || cat;
    if (sameCat) {
      items.forEach(it => { if (res.length < 2 && it.category === sameCat && !res.includes(it)) res.push(it); });
    }
    items.forEach(it => { if (res.length < 2 && !res.includes(it)) res.push(it); });
  }

  return res.slice(0, 10);
}

// render results to #results
function render(results) {
  const ul = document.getElementById('results');
  if (!ul) return;
  ul.innerHTML = '';
  if (!results || results.length === 0) {
    const li = document.createElement('li'); li.textContent = 'No results found.'; ul.appendChild(li); return;
  }
  results.forEach(r => {
    const li = document.createElement('li');

    if (r.imageUrl) {
      const img = document.createElement('img');
      img.src = r.imageUrl;
      img.alt = r.name || '';
      img.width = 140;
      img.height = 90;
      img.style.display = 'block';
      img.style.marginBottom = '6px';
      li.appendChild(img);
    }

    const name = document.createElement('div'); name.textContent = r.name || ''; li.appendChild(name);
    if (r.description) { const d = document.createElement('div'); d.textContent = r.description; li.appendChild(d); }

    ul.appendChild(li);
  });
}

// wire form submit and reset
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const reset = document.getElementById('resetButton');

  if (form) form.addEventListener('submit', async e => {
    e.preventDefault();
    const q = input ? input.value : '';
    if (!q || !q.trim()) {
      const ul = document.getElementById('results'); ul.innerHTML = ''; const li = document.createElement('li'); li.textContent = 'Please enter a keyword to search.'; ul.appendChild(li); return;
    }
    const res = await search(q);
    render(res);
  });

  if (reset) reset.addEventListener('click', () => {
    if (input) input.value = '';
    const ul = document.getElementById('results'); if (ul) ul.innerHTML = '';
  });
});
