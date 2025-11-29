/**
 * ScryfallQueryBuilder - A fluent API for building Scryfall search queries
 * Browser-compatible version for the web app
 * 
 * @see https://scryfall.com/docs/syntax for Scryfall search syntax documentation
 */
class ScryfallQueryBuilder {
  constructor() {
    this.parts = [];
  }

  /**
   * Search for cards by name (partial match)
   * @param {string} name - The card name to search for
   * @returns {ScryfallQueryBuilder}
   */
  name(name) {
    if (name && name.trim()) {
      const trimmed = name.trim();
      if (trimmed.includes(' ')) {
        this.parts.push(`name:"${trimmed}"`);
      } else {
        this.parts.push(`name:${trimmed}`);
      }
    }
    return this;
  }

  /**
   * Search for cards with exact name match
   * @param {string} name - The exact card name
   * @returns {ScryfallQueryBuilder}
   */
  exactName(name) {
    if (name && name.trim()) {
      this.parts.push(`!"${name.trim()}"`);
    }
    return this;
  }

  /**
   * Search by oracle text (rules text)
   * @param {string} text - Text to search in oracle text
   * @returns {ScryfallQueryBuilder}
   */
  oracleText(text) {
    if (text && text.trim()) {
      const trimmed = text.trim();
      if (trimmed.includes(' ')) {
        this.parts.push(`o:"${trimmed}"`);
      } else {
        this.parts.push(`o:${trimmed}`);
      }
    }
    return this;
  }

  /**
   * Search by card type
   * @param {string} type - The card type (e.g., "creature", "instant", "sorcery")
   * @returns {ScryfallQueryBuilder}
   */
  type(type) {
    if (type && type.trim()) {
      const trimmed = type.trim();
      if (trimmed.includes(' ')) {
        this.parts.push(`t:"${trimmed}"`);
      } else {
        this.parts.push(`t:${trimmed}`);
      }
    }
    return this;
  }

  /**
   * Search by color identity
   * @param {string|string[]} colors - Color(s) to search for (w, u, b, r, g, c)
   * @param {string} [operator='='] - Comparison operator (=, <=, >=, <, >)
   * @returns {ScryfallQueryBuilder}
   */
  colorIdentity(colors, operator = '=') {
    const colorStr = Array.isArray(colors) ? colors.join('') : colors;
    if (colorStr && colorStr.trim()) {
      this.parts.push(`id${operator}${colorStr.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search by color
   * @param {string|string[]} colors - Color(s) to search for (w, u, b, r, g, c)
   * @param {string} [operator='='] - Comparison operator (=, <=, >=, <, >)
   * @returns {ScryfallQueryBuilder}
   */
  color(colors, operator = '=') {
    const colorStr = Array.isArray(colors) ? colors.join('') : colors;
    if (colorStr && colorStr.trim()) {
      this.parts.push(`c${operator}${colorStr.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search by mana cost
   * @param {string} cost - The mana cost (e.g., "{2}{U}{U}")
   * @param {string} [operator='='] - Comparison operator
   * @returns {ScryfallQueryBuilder}
   */
  manaCost(cost, operator = '=') {
    if (cost && cost.trim()) {
      this.parts.push(`m${operator}${cost.trim()}`);
    }
    return this;
  }

  /**
   * Search by mana value (converted mana cost)
   * @param {number} value - The mana value
   * @param {string} [operator='='] - Comparison operator
   * @returns {ScryfallQueryBuilder}
   */
  manaValue(value, operator = '=') {
    if (value !== undefined && value !== null && value !== '') {
      this.parts.push(`mv${operator}${value}`);
    }
    return this;
  }

  /**
   * Search by power
   * @param {number|string} power - The power value
   * @param {string} [operator='='] - Comparison operator
   * @returns {ScryfallQueryBuilder}
   */
  power(power, operator = '=') {
    if (power !== undefined && power !== null && power !== '') {
      this.parts.push(`pow${operator}${power}`);
    }
    return this;
  }

  /**
   * Search by toughness
   * @param {number|string} toughness - The toughness value
   * @param {string} [operator='='] - Comparison operator
   * @returns {ScryfallQueryBuilder}
   */
  toughness(toughness, operator = '=') {
    if (toughness !== undefined && toughness !== null && toughness !== '') {
      this.parts.push(`tou${operator}${toughness}`);
    }
    return this;
  }

  /**
   * Search by rarity
   * @param {string} rarity - The rarity (common, uncommon, rare, mythic)
   * @param {string} [operator='='] - Comparison operator
   * @returns {ScryfallQueryBuilder}
   */
  rarity(rarity, operator = '=') {
    if (rarity && rarity.trim()) {
      this.parts.push(`r${operator}${rarity.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search by set
   * @param {string} set - The set code (e.g., "dom", "m21")
   * @returns {ScryfallQueryBuilder}
   */
  set(set) {
    if (set && set.trim()) {
      this.parts.push(`s:${set.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search by format legality
   * @param {string} format - The format (e.g., "standard", "modern", "commander")
   * @returns {ScryfallQueryBuilder}
   */
  format(format) {
    if (format && format.trim()) {
      this.parts.push(`f:${format.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search for cards that are banned in a format
   * @param {string} format - The format
   * @returns {ScryfallQueryBuilder}
   */
  banned(format) {
    if (format && format.trim()) {
      this.parts.push(`banned:${format.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search for cards that are restricted in a format
   * @param {string} format - The format
   * @returns {ScryfallQueryBuilder}
   */
  restricted(format) {
    if (format && format.trim()) {
      this.parts.push(`restricted:${format.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search by artist
   * @param {string} artist - The artist name
   * @returns {ScryfallQueryBuilder}
   */
  artist(artist) {
    if (artist && artist.trim()) {
      const trimmed = artist.trim();
      if (trimmed.includes(' ')) {
        this.parts.push(`a:"${trimmed}"`);
      } else {
        this.parts.push(`a:${trimmed}`);
      }
    }
    return this;
  }

  /**
   * Search by flavor text
   * @param {string} text - Text to search in flavor text
   * @returns {ScryfallQueryBuilder}
   */
  flavorText(text) {
    if (text && text.trim()) {
      const trimmed = text.trim();
      if (trimmed.includes(' ')) {
        this.parts.push(`ft:"${trimmed}"`);
      } else {
        this.parts.push(`ft:${trimmed}`);
      }
    }
    return this;
  }

  /**
   * Search by watermark
   * @param {string} watermark - The watermark name
   * @returns {ScryfallQueryBuilder}
   */
  watermark(watermark) {
    if (watermark && watermark.trim()) {
      this.parts.push(`wm:${watermark.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search for cards in a specific language
   * @param {string} lang - The language code (e.g., "en", "ja", "de")
   * @returns {ScryfallQueryBuilder}
   */
  language(lang) {
    if (lang && lang.trim()) {
      this.parts.push(`lang:${lang.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search for cards with a specific frame
   * @param {string} frame - The frame type (e.g., "2015", "1993", "future")
   * @returns {ScryfallQueryBuilder}
   */
  frame(frame) {
    if (frame && frame.trim()) {
      this.parts.push(`frame:${frame.trim()}`);
    }
    return this;
  }

  /**
   * Search for cards with a specific border color
   * @param {string} border - The border color (e.g., "black", "white", "borderless")
   * @returns {ScryfallQueryBuilder}
   */
  border(border) {
    if (border && border.trim()) {
      this.parts.push(`border:${border.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Search for cards by USD price
   * @param {number} price - The price in USD
   * @param {string} [operator='='] - Comparison operator
   * @returns {ScryfallQueryBuilder}
   */
  priceUsd(price, operator = '=') {
    if (price !== undefined && price !== null && price !== '') {
      this.parts.push(`usd${operator}${price}`);
    }
    return this;
  }

  /**
   * Search for cards by EUR price
   * @param {number} price - The price in EUR
   * @param {string} [operator='='] - Comparison operator
   * @returns {ScryfallQueryBuilder}
   */
  priceEur(price, operator = '=') {
    if (price !== undefined && price !== null && price !== '') {
      this.parts.push(`eur${operator}${price}`);
    }
    return this;
  }

  /**
   * Search for cards by TIX price
   * @param {number} price - The price in TIX
   * @param {string} [operator='='] - Comparison operator
   * @returns {ScryfallQueryBuilder}
   */
  priceTix(price, operator = '=') {
    if (price !== undefined && price !== null && price !== '') {
      this.parts.push(`tix${operator}${price}`);
    }
    return this;
  }

  /**
   * Search for cards with specific keywords
   * @param {string} keyword - The keyword (e.g., "flying", "trample", "hexproof")
   * @returns {ScryfallQueryBuilder}
   */
  keyword(keyword) {
    if (keyword && keyword.trim()) {
      this.parts.push(`keyword:${keyword.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Check if card produces specific mana
   * @param {string} colors - The colors produced
   * @returns {ScryfallQueryBuilder}
   */
  produces(colors) {
    if (colors && colors.trim()) {
      this.parts.push(`produces:${colors.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Filter by extra properties (is: filters)
   * @param {string} property - The property to filter by (e.g., "commander", "spell", "permanent")
   * @returns {ScryfallQueryBuilder}
   */
  is(property) {
    if (property && property.trim()) {
      this.parts.push(`is:${property.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Negate a condition (not: filter)
   * @param {string} property - The property to negate
   * @returns {ScryfallQueryBuilder}
   */
  not(property) {
    if (property && property.trim()) {
      this.parts.push(`-is:${property.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Add a raw query part
   * @param {string} query - Raw query string to add
   * @returns {ScryfallQueryBuilder}
   */
  raw(query) {
    if (query && query.trim()) {
      this.parts.push(query.trim());
    }
    return this;
  }

  /**
   * Add an OR condition (group)
   * @param {Function} callback - Callback function that receives a new builder
   * @returns {ScryfallQueryBuilder}
   */
  or(callback) {
    const subBuilder = new ScryfallQueryBuilder();
    callback(subBuilder);
    const subQuery = subBuilder.build();
    if (subQuery) {
      this.parts.push(`(${subQuery.split(' ').join(' or ')})`);
    }
    return this;
  }

  /**
   * Add an AND group
   * @param {Function} callback - Callback function that receives a new builder
   * @returns {ScryfallQueryBuilder}
   */
  and(callback) {
    const subBuilder = new ScryfallQueryBuilder();
    callback(subBuilder);
    const subQuery = subBuilder.build();
    if (subQuery) {
      this.parts.push(`(${subQuery})`);
    }
    return this;
  }

  /**
   * Negate the next condition
   * @param {Function} callback - Callback function that receives a new builder
   * @returns {ScryfallQueryBuilder}
   */
  negate(callback) {
    const subBuilder = new ScryfallQueryBuilder();
    callback(subBuilder);
    const subQuery = subBuilder.build();
    if (subQuery) {
      this.parts.push(`-(${subQuery})`);
    }
    return this;
  }

  /**
   * Build and return the final query string
   * @returns {string}
   */
  build() {
    return this.parts.join(' ');
  }

  /**
   * Build the complete Scryfall URL for the search
   * @returns {string}
   */
  toUrl() {
    const query = this.build();
    return `https://scryfall.com/search?q=${encodeURIComponent(query)}`;
  }

  /**
   * Build the Scryfall API URL for the search
   * @returns {string}
   */
  toApiUrl() {
    const query = this.build();
    return `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`;
  }

  /**
   * Reset the builder to start fresh
   * @returns {ScryfallQueryBuilder}
   */
  reset() {
    this.parts = [];
    return this;
  }

  /**
   * Clone the current builder
   * @returns {ScryfallQueryBuilder}
   */
  clone() {
    const cloned = new ScryfallQueryBuilder();
    cloned.parts = [...this.parts];
    return cloned;
  }
}

// ===== Web App Code =====

let config = null;
let queries = null;
let builder = new ScryfallQueryBuilder();
let selectedKeywords = new Set();
let selectedIsFilters = new Set();
let currentRandomQuery = '';
let queryHistory = [];

// Load history from localStorage
function loadHistory() {
  try {
    const saved = localStorage.getItem('scryfallQueryHistory');
    if (saved) {
      queryHistory = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load history:', e);
    queryHistory = [];
  }
}

// Save history to localStorage
function saveHistory() {
  try {
    localStorage.setItem('scryfallQueryHistory', JSON.stringify(queryHistory));
  } catch (e) {
    console.warn('Failed to save history:', e);
  }
}

/**
 * Initialize the web app
 */
async function init() {
  try {
    // Load configuration and queries in parallel
    const [configResponse, queriesResponse] = await Promise.all([
      fetch('config.json'),
      fetch('queries.json')
    ]);
    
    config = await configResponse.json();
    queries = await queriesResponse.json();
    
    // Load history from localStorage
    loadHistory();
    
    // Populate form fields
    populateFormFields();
    
    // Setup tab navigation
    setupTabs();
    
    // Populate random query categories
    populateRandomCategories();
    
    // Render history
    renderHistory();
    
    // Add event listeners
    setupEventListeners();
    
    // Setup random query events
    setupRandomQueryEvents();
    
    // Setup history events
    setupHistoryEvents();
    
    // Initial query update
    updateQuery();
    
    // Register service worker for PWA
    registerServiceWorker();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showNotification('Failed to load configuration', true);
  }
}

/**
 * Register service worker for PWA functionality
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  }
}

/**
 * Setup tab navigation
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      
      // Update button states
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update tab content
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
}

/**
 * Populate random query category dropdown
 */
function populateRandomCategories() {
  const select = document.getElementById('random-category');
  if (!select || !queries) return;
  
  Object.keys(queries).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    select.appendChild(option);
  });
}

/**
 * Setup random query event listeners
 */
function setupRandomQueryEvents() {
  document.getElementById('generate-random-btn')?.addEventListener('click', generateRandomQuery);
  document.getElementById('generate-multiple-btn')?.addEventListener('click', generateMultipleQueries);
  document.getElementById('random-search-btn')?.addEventListener('click', searchRandomQuery);
  document.getElementById('random-copy-btn')?.addEventListener('click', copyRandomQuery);
  document.getElementById('random-save-btn')?.addEventListener('click', saveRandomQueryToHistory);
}

/**
 * Setup history event listeners
 */
function setupHistoryEvents() {
  document.getElementById('clear-history-btn')?.addEventListener('click', clearHistory);
  document.getElementById('export-history-btn')?.addEventListener('click', exportHistory);
}

/**
 * Generate a random query
 */
function generateRandomQuery() {
  if (!queries) {
    showNotification('Queries not loaded', true);
    return;
  }
  
  const category = document.getElementById('random-category').value;
  let queryList;
  
  if (category === 'all') {
    // Combine all categories
    queryList = Object.values(queries).flat();
  } else {
    queryList = queries[category] || [];
  }
  
  if (queryList.length === 0) {
    showNotification('No queries available for this category', true);
    return;
  }
  
  // Pick a random query
  const randomIndex = Math.floor(Math.random() * queryList.length);
  currentRandomQuery = queryList[randomIndex];
  
  // Display the query
  document.getElementById('random-query-display').textContent = currentRandomQuery;
  document.getElementById('random-query-url').textContent = 
    `https://scryfall.com/search?q=${encodeURIComponent(currentRandomQuery)}`;
  
  // Hide multiple queries card
  document.getElementById('multiple-queries-card').style.display = 'none';
  
  showNotification('Random query generated!');
}

/**
 * Generate multiple random queries
 */
function generateMultipleQueries() {
  if (!queries) {
    showNotification('Queries not loaded', true);
    return;
  }
  
  const category = document.getElementById('random-category').value;
  let queryList;
  
  if (category === 'all') {
    queryList = Object.values(queries).flat();
  } else {
    queryList = queries[category] || [];
  }
  
  if (queryList.length === 0) {
    showNotification('No queries available for this category', true);
    return;
  }
  
  // Generate 5 unique random queries
  const selectedQueries = [];
  const usedIndices = new Set();
  const count = Math.min(5, queryList.length);
  
  while (selectedQueries.length < count) {
    const index = Math.floor(Math.random() * queryList.length);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      selectedQueries.push(queryList[index]);
    }
  }
  
  // Display the queries
  const container = document.getElementById('multiple-queries-list');
  container.innerHTML = '';
  
  selectedQueries.forEach((query, i) => {
    const item = document.createElement('div');
    item.className = 'query-item';
    item.innerHTML = `
      <div class="query-item-text">${escapeHtml(query)}</div>
      <div class="query-item-actions">
        <button class="query-item-btn search" onclick="window.open('https://scryfall.com/search?q=${encodeURIComponent(query)}', '_blank')">🔍</button>
        <button class="query-item-btn copy" onclick="copyToClipboard('${escapeJs(query)}')">📋</button>
        <button class="query-item-btn" style="background: var(--success-color);" onclick="addToHistory('${escapeJs(query)}', '${category}')">💾</button>
      </div>
    `;
    container.appendChild(item);
  });
  
  document.getElementById('multiple-queries-card').style.display = 'block';
  
  // Also set the first one as current
  currentRandomQuery = selectedQueries[0];
  document.getElementById('random-query-display').textContent = currentRandomQuery;
  document.getElementById('random-query-url').textContent = 
    `https://scryfall.com/search?q=${encodeURIComponent(currentRandomQuery)}`;
  
  showNotification(`Generated ${count} random queries!`);
}

/**
 * Search the current random query on Scryfall
 */
function searchRandomQuery() {
  if (currentRandomQuery) {
    window.open(`https://scryfall.com/search?q=${encodeURIComponent(currentRandomQuery)}`, '_blank');
  } else {
    showNotification('Generate a query first', true);
  }
}

/**
 * Copy the current random query
 */
async function copyRandomQuery() {
  if (currentRandomQuery) {
    try {
      await navigator.clipboard.writeText(currentRandomQuery);
      showNotification('Query copied to clipboard!');
    } catch (err) {
      showNotification('Failed to copy query', true);
    }
  } else {
    showNotification('No query to copy', true);
  }
}

/**
 * Save the current random query to history
 */
function saveRandomQueryToHistory() {
  if (currentRandomQuery) {
    const category = document.getElementById('random-category').value;
    addToHistory(currentRandomQuery, category);
  } else {
    showNotification('Generate a query first', true);
  }
}

/**
 * Add a query to history
 */
function addToHistory(query, category = 'manual') {
  // Check if already exists
  const exists = queryHistory.find(h => h.query === query);
  if (exists) {
    showNotification('Query already in history');
    return;
  }
  
  queryHistory.unshift({
    query: query,
    category: category,
    timestamp: Date.now()
  });
  
  // Limit history to 50 items
  if (queryHistory.length > 50) {
    queryHistory = queryHistory.slice(0, 50);
  }
  
  saveHistory();
  renderHistory();
  showNotification('Query saved to history!');
}

/**
 * Render the history list
 */
function renderHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;
  
  if (queryHistory.length === 0) {
    container.innerHTML = `
      <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">
        No saved queries yet. Use the Query Builder or Random Generator to create queries.
      </p>
    `;
    return;
  }
  
  container.innerHTML = '';
  
  queryHistory.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'query-item';
    div.innerHTML = `
      <div class="query-item-text">${escapeHtml(item.query)}</div>
      <span class="query-item-category">${escapeHtml(item.category)}</span>
      <div class="query-item-actions">
        <button class="query-item-btn search" onclick="window.open('https://scryfall.com/search?q=${encodeURIComponent(item.query)}', '_blank')">🔍</button>
        <button class="query-item-btn copy" onclick="copyToClipboard('${escapeJs(item.query)}')">📋</button>
        <button class="query-item-btn delete" onclick="removeFromHistory(${index})">🗑️</button>
      </div>
    `;
    container.appendChild(div);
  });
}

/**
 * Remove a query from history
 */
function removeFromHistory(index) {
  queryHistory.splice(index, 1);
  saveHistory();
  renderHistory();
  showNotification('Query removed from history');
}

/**
 * Clear all history
 */
function clearHistory() {
  if (confirm('Are you sure you want to clear all history?')) {
    queryHistory = [];
    saveHistory();
    renderHistory();
    showNotification('History cleared');
  }
}

/**
 * Export history as JSON
 */
function exportHistory() {
  if (queryHistory.length === 0) {
    showNotification('No history to export', true);
    return;
  }
  
  const dataStr = JSON.stringify(queryHistory, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'scryfall-query-history.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showNotification('History exported!');
}

/**
 * Copy text to clipboard (global helper)
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard!');
  } catch (err) {
    showNotification('Failed to copy', true);
  }
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Escape string for JavaScript
 */
function escapeJs(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

/**
 * Populate form fields from config
 */
function populateFormFields() {
  // Populate types dropdown
  const typeSelect = document.getElementById('type');
  config.types.forEach(type => {
    const option = document.createElement('option');
    option.value = type.toLowerCase();
    option.textContent = type;
    typeSelect.appendChild(option);
  });
  
  // Populate format dropdown
  const formatSelect = document.getElementById('format');
  config.formats.forEach(format => {
    const option = document.createElement('option');
    option.value = format;
    option.textContent = format.charAt(0).toUpperCase() + format.slice(1);
    formatSelect.appendChild(option);
  });
  
  // Populate rarity dropdown
  const raritySelect = document.getElementById('rarity');
  config.rarities.forEach(rarity => {
    const option = document.createElement('option');
    option.value = rarity.code;
    option.textContent = rarity.name;
    raritySelect.appendChild(option);
  });
  
  // Populate operators
  const operatorSelects = document.querySelectorAll('.operator-select');
  operatorSelects.forEach(select => {
    config.operators.forEach(op => {
      const option = document.createElement('option');
      option.value = op.code;
      option.textContent = op.name;
      select.appendChild(option);
    });
  });
  
  // Populate keywords
  const keywordsContainer = document.getElementById('keywords-container');
  config.keywords.forEach(keyword => {
    const tag = document.createElement('span');
    tag.className = 'keyword-tag';
    tag.textContent = keyword;
    tag.dataset.keyword = keyword;
    tag.addEventListener('click', () => toggleKeyword(tag, keyword));
    keywordsContainer.appendChild(tag);
  });
  
  // Populate is: filters
  const isContainer = document.getElementById('is-filters-container');
  config.isFilters.forEach(filter => {
    const tag = document.createElement('span');
    tag.className = 'keyword-tag';
    tag.textContent = filter;
    tag.dataset.filter = filter;
    tag.addEventListener('click', () => toggleIsFilter(tag, filter));
    isContainer.appendChild(tag);
  });
  
  // Populate frame dropdown
  const frameSelect = document.getElementById('frame');
  config.frames.forEach(frame => {
    const option = document.createElement('option');
    option.value = frame;
    option.textContent = frame;
    frameSelect.appendChild(option);
  });
  
  // Populate border dropdown
  const borderSelect = document.getElementById('border');
  config.borders.forEach(border => {
    const option = document.createElement('option');
    option.value = border;
    option.textContent = border.charAt(0).toUpperCase() + border.slice(1);
    borderSelect.appendChild(option);
  });
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Form input changes
  const form = document.getElementById('query-form');
  form.addEventListener('input', updateQuery);
  form.addEventListener('change', updateQuery);
  
  // Button clicks
  document.getElementById('search-btn').addEventListener('click', searchScryfall);
  document.getElementById('copy-btn').addEventListener('click', copyQuery);
  document.getElementById('copy-url-btn').addEventListener('click', copyUrl);
  document.getElementById('reset-btn').addEventListener('click', resetForm);
  document.getElementById('save-query-btn').addEventListener('click', saveBuilderQuery);
  
  // Collapsible sections
  document.querySelectorAll('.collapsible').forEach(elem => {
    elem.addEventListener('click', () => toggleCollapsible(elem));
  });
}

/**
 * Save the current builder query to history
 */
function saveBuilderQuery() {
  const query = builder.build();
  if (query) {
    addToHistory(query, 'builder');
  } else {
    showNotification('Create a query first', true);
  }
}

/**
 * Toggle keyword selection
 */
function toggleKeyword(element, keyword) {
  if (selectedKeywords.has(keyword)) {
    selectedKeywords.delete(keyword);
    element.classList.remove('selected');
  } else {
    selectedKeywords.add(keyword);
    element.classList.add('selected');
  }
  updateQuery();
}

/**
 * Toggle is: filter selection
 */
function toggleIsFilter(element, filter) {
  if (selectedIsFilters.has(filter)) {
    selectedIsFilters.delete(filter);
    element.classList.remove('selected');
  } else {
    selectedIsFilters.add(filter);
    element.classList.add('selected');
  }
  updateQuery();
}

/**
 * Toggle collapsible sections
 */
function toggleCollapsible(element) {
  const content = element.nextElementSibling;
  element.classList.toggle('collapsed');
  content.classList.toggle('collapsed');
}

/**
 * Update the query based on form values
 */
function updateQuery() {
  builder = new ScryfallQueryBuilder();
  
  // Card Name
  const cardName = document.getElementById('card-name').value;
  const exactMatch = document.getElementById('exact-match').checked;
  if (cardName) {
    if (exactMatch) {
      builder.exactName(cardName);
    } else {
      builder.name(cardName);
    }
  }
  
  // Oracle Text
  const oracleText = document.getElementById('oracle-text').value;
  if (oracleText) {
    builder.oracleText(oracleText);
  }
  
  // Flavor Text
  const flavorText = document.getElementById('flavor-text').value;
  if (flavorText) {
    builder.flavorText(flavorText);
  }
  
  // Type
  const type = document.getElementById('type').value;
  if (type) {
    builder.type(type);
  }
  
  // Colors
  const colorMode = document.getElementById('color-mode').value;
  const colorOperator = document.getElementById('color-operator').value;
  const selectedColors = [];
  document.querySelectorAll('.color-checkbox input:checked').forEach(checkbox => {
    selectedColors.push(checkbox.value);
  });
  
  if (selectedColors.length > 0) {
    const colorStr = selectedColors.join('');
    if (colorMode === 'identity') {
      builder.colorIdentity(colorStr, colorOperator);
    } else {
      builder.color(colorStr, colorOperator);
    }
  }
  
  // Mana Value
  const manaValue = document.getElementById('mana-value').value;
  const manaValueOp = document.getElementById('mana-value-operator').value;
  if (manaValue !== '') {
    builder.manaValue(manaValue, manaValueOp);
  }
  
  // Power
  const power = document.getElementById('power').value;
  const powerOp = document.getElementById('power-operator').value;
  if (power !== '') {
    builder.power(power, powerOp);
  }
  
  // Toughness
  const toughness = document.getElementById('toughness').value;
  const toughnessOp = document.getElementById('toughness-operator').value;
  if (toughness !== '') {
    builder.toughness(toughness, toughnessOp);
  }
  
  // Rarity
  const rarity = document.getElementById('rarity').value;
  const rarityOp = document.getElementById('rarity-operator').value;
  if (rarity) {
    builder.rarity(rarity, rarityOp);
  }
  
  // Set
  const set = document.getElementById('set').value;
  if (set) {
    builder.set(set);
  }
  
  // Format
  const format = document.getElementById('format').value;
  if (format) {
    builder.format(format);
  }
  
  // Artist
  const artist = document.getElementById('artist').value;
  if (artist) {
    builder.artist(artist);
  }
  
  // Keywords
  selectedKeywords.forEach(keyword => {
    builder.keyword(keyword);
  });
  
  // Is filters
  selectedIsFilters.forEach(filter => {
    builder.is(filter);
  });
  
  // Frame
  const frame = document.getElementById('frame').value;
  if (frame) {
    builder.frame(frame);
  }
  
  // Border
  const border = document.getElementById('border').value;
  if (border) {
    builder.border(border);
  }
  
  // USD Price
  const priceUsd = document.getElementById('price-usd').value;
  const priceUsdOp = document.getElementById('price-usd-operator').value;
  if (priceUsd !== '') {
    builder.priceUsd(priceUsd, priceUsdOp);
  }
  
  // Raw query
  const rawQuery = document.getElementById('raw-query').value;
  if (rawQuery) {
    builder.raw(rawQuery);
  }
  
  // Update display
  const query = builder.build();
  document.getElementById('query-display').textContent = query;
  document.getElementById('url-display').textContent = query ? builder.toUrl() : '';
}

/**
 * Open Scryfall search in new tab
 */
function searchScryfall() {
  const query = builder.build();
  if (query) {
    window.open(builder.toUrl(), '_blank');
  } else {
    showNotification('Please add some search criteria first', true);
  }
}

/**
 * Copy query to clipboard
 */
async function copyQuery() {
  const query = builder.build();
  if (query) {
    try {
      await navigator.clipboard.writeText(query);
      showNotification('Query copied to clipboard!');
    } catch (err) {
      showNotification('Failed to copy query', true);
    }
  } else {
    showNotification('No query to copy', true);
  }
}

/**
 * Copy URL to clipboard
 */
async function copyUrl() {
  const query = builder.build();
  if (query) {
    try {
      await navigator.clipboard.writeText(builder.toUrl());
      showNotification('URL copied to clipboard!');
    } catch (err) {
      showNotification('Failed to copy URL', true);
    }
  } else {
    showNotification('No URL to copy', true);
  }
}

/**
 * Reset the form
 */
function resetForm() {
  document.getElementById('query-form').reset();
  
  // Clear color checkboxes
  document.querySelectorAll('.color-checkbox input').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Clear keywords
  selectedKeywords.clear();
  document.querySelectorAll('#keywords-container .keyword-tag').forEach(tag => {
    tag.classList.remove('selected');
  });
  
  // Clear is filters
  selectedIsFilters.clear();
  document.querySelectorAll('#is-filters-container .keyword-tag').forEach(tag => {
    tag.classList.remove('selected');
  });
  
  updateQuery();
  showNotification('Form reset!');
}

/**
 * Show notification message
 */
function showNotification(message, isError = false) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.background = isError ? '#ef4444' : '#10b981';
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
