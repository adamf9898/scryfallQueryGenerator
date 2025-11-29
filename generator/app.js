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
    
    const textDiv = document.createElement('div');
    textDiv.className = 'query-item-text';
    textDiv.textContent = query;
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'query-item-actions';
    
    const searchBtn = document.createElement('button');
    searchBtn.className = 'query-item-btn search';
    searchBtn.textContent = '🔍';
    searchBtn.addEventListener('click', () => {
      window.open(`https://scryfall.com/search?q=${encodeURIComponent(query)}`, '_blank');
    });
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'query-item-btn copy';
    copyBtn.textContent = '📋';
    copyBtn.addEventListener('click', () => copyToClipboard(query));
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'query-item-btn';
    saveBtn.style.background = 'var(--success-color)';
    saveBtn.textContent = '💾';
    saveBtn.addEventListener('click', () => addToHistory(query, category));
    
    actionsDiv.appendChild(searchBtn);
    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(saveBtn);
    
    item.appendChild(textDiv);
    item.appendChild(actionsDiv);
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
    const emptyMsg = document.createElement('p');
    emptyMsg.style.cssText = 'color: var(--text-secondary); text-align: center; padding: 2rem;';
    emptyMsg.textContent = 'No saved queries yet. Use the Query Builder or Random Generator to create queries.';
    container.innerHTML = '';
    container.appendChild(emptyMsg);
    return;
  }
  
  container.innerHTML = '';
  
  queryHistory.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'query-item';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'query-item-text';
    textDiv.textContent = item.query;
    
    const categorySpan = document.createElement('span');
    categorySpan.className = 'query-item-category';
    categorySpan.textContent = item.category;
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'query-item-actions';
    
    const searchBtn = document.createElement('button');
    searchBtn.className = 'query-item-btn search';
    searchBtn.textContent = '🔍';
    searchBtn.addEventListener('click', () => {
      window.open(`https://scryfall.com/search?q=${encodeURIComponent(item.query)}`, '_blank');
    });
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'query-item-btn copy';
    copyBtn.textContent = '📋';
    copyBtn.addEventListener('click', () => copyToClipboard(item.query));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'query-item-btn delete';
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => removeFromHistory(index));
    
    actionsDiv.appendChild(searchBtn);
    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(deleteBtn);
    
    div.appendChild(textDiv);
    div.appendChild(categorySpan);
    div.appendChild(actionsDiv);
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

// ===== Bulk Data Management =====

let bulkDataManager = null;
let cardNormalizer = null;
let searchIndex = null;
let deckGenerator = null;

/**
 * Initialize data management modules
 */
function initDataManagement() {
  // Check if modules are loaded
  if (typeof BulkDataManager !== 'undefined') {
    bulkDataManager = new BulkDataManager({
      onProgress: handleDataProgress
    });
    updateDataStatus();
  }
  
  if (typeof CardNormalizer !== 'undefined') {
    cardNormalizer = new CardNormalizer();
  }
  
  if (typeof CardSearchIndex !== 'undefined') {
    searchIndex = new CardSearchIndex({
      onProgress: handleIndexProgress
    });
    updateIndexStatus();
  }
  
  if (typeof DeckGenerator !== 'undefined' && searchIndex) {
    deckGenerator = new DeckGenerator(searchIndex, {
      onProgress: handleDeckProgress
    });
  }
  
  // Setup data management event listeners
  setupDataEventListeners();
}

/**
 * Setup event listeners for data management
 */
function setupDataEventListeners() {
  // Data sync buttons
  document.getElementById('sync-data-btn')?.addEventListener('click', syncData);
  document.getElementById('refresh-data-btn')?.addEventListener('click', () => syncData(true));
  document.getElementById('clear-data-btn')?.addEventListener('click', clearData);
  
  // Index buttons
  document.getElementById('build-index-btn')?.addEventListener('click', buildIndex);
  document.getElementById('rebuild-index-btn')?.addEventListener('click', () => buildIndex(true));
  
  // Local search
  document.getElementById('local-search-btn')?.addEventListener('click', performLocalSearch);
  document.getElementById('local-search-clear-btn')?.addEventListener('click', clearLocalSearch);
  
  // Deck generation
  document.getElementById('generate-deck-btn')?.addEventListener('click', generateDecks);
  document.getElementById('clear-decks-btn')?.addEventListener('click', clearDecks);
}

/**
 * Handle data progress updates
 */
function handleDataProgress(progress) {
  const progressContainer = document.getElementById('data-progress');
  const progressFill = document.getElementById('data-progress-fill');
  const progressText = document.getElementById('data-progress-text');
  
  if (!progressContainer) return;
  
  if (progress.status === 'complete' || progress.status === 'error' || progress.status === 'up_to_date') {
    progressContainer.style.display = 'none';
    updateDataStatus();
    
    if (progress.status === 'complete') {
      showNotification(progress.message);
    } else if (progress.status === 'error') {
      showNotification(progress.message, true);
    }
  } else {
    progressContainer.style.display = 'block';
    progressText.textContent = progress.message;
    
    if (progress.progress !== undefined) {
      progressFill.style.width = `${progress.progress * 100}%`;
    }
  }
}

/**
 * Handle index progress updates
 */
function handleIndexProgress(progress) {
  const progressText = document.getElementById('data-progress-text');
  
  if (progress.status === 'complete') {
    showNotification(progress.message);
    updateIndexStatus();
  } else if (progress.status === 'building' && progressText) {
    progressText.textContent = progress.message;
  }
}

/**
 * Handle deck generation progress
 */
function handleDeckProgress(progress) {
  if (progress.status === 'complete') {
    showNotification(progress.message);
  }
}

/**
 * Sync bulk data from Scryfall
 */
async function syncData(forceRefresh = false) {
  if (!bulkDataManager) {
    showNotification('Data manager not initialized', true);
    return;
  }
  
  const datasetType = document.getElementById('dataset-type')?.value || 'oracle_cards';
  bulkDataManager.datasetType = datasetType;
  
  try {
    const result = await bulkDataManager.syncBulkData({ forceRefresh });
    
    if (result.success) {
      updateDataStatus();
      if (result.refreshed) {
        showNotification(`Synced ${result.metadata?.cardCount || 0} cards`);
      } else {
        showNotification(result.message);
      }
    } else {
      showNotification(result.message, true);
    }
  } catch (error) {
    showNotification(`Error: ${error.message}`, true);
  }
}

/**
 * Clear all stored data
 */
function clearData() {
  if (confirm('Are you sure you want to clear all card data?')) {
    if (bulkDataManager) {
      bulkDataManager.clearData();
    }
    if (cardNormalizer) {
      cardNormalizer.clear();
    }
    if (searchIndex) {
      searchIndex.clear();
    }
    updateDataStatus();
    updateIndexStatus();
    showNotification('Data cleared');
  }
}

/**
 * Update data status display
 */
function updateDataStatus() {
  if (!bulkDataManager) return;
  
  const status = bulkDataManager.getBulkStatus();
  
  document.getElementById('data-status-value').textContent = status.hasData ? 'Loaded' : 'Not loaded';
  document.getElementById('data-status-value').className = 'status-value ' + (status.hasData ? 'success' : '');
  
  document.getElementById('data-dataset-value').textContent = status.metadata?.name || status.datasetType || '-';
  document.getElementById('data-count-value').textContent = status.cardCount?.toLocaleString() || '0';
  document.getElementById('data-updated-value').textContent = status.lastUpdated 
    ? new Date(status.lastUpdated).toLocaleDateString() 
    : '-';
  document.getElementById('data-synced-value').textContent = status.syncedAt 
    ? new Date(status.syncedAt).toLocaleString() 
    : '-';
}

/**
 * Build the search index
 */
async function buildIndex(rebuild = false) {
  if (!bulkDataManager || !cardNormalizer || !searchIndex) {
    showNotification('Required modules not initialized', true);
    return;
  }
  
  const data = bulkDataManager.getStoredData();
  if (!data || data.length === 0) {
    showNotification('No card data available. Please sync data first.', true);
    return;
  }
  
  showNotification('Building index...');
  
  try {
    // Clear existing data if rebuilding
    if (rebuild) {
      cardNormalizer.clear();
      searchIndex.clear();
    }
    
    // Process cards in batches
    const normalized = cardNormalizer.processCards(data);
    
    // Build the search index
    searchIndex.buildIndex(normalized);
    
    updateIndexStatus();
    showNotification(`Index built with ${normalized.length} cards`);
    
    // Initialize deck generator with updated index
    if (typeof DeckGenerator !== 'undefined') {
      deckGenerator = new DeckGenerator(searchIndex, {
        onProgress: handleDeckProgress
      });
    }
  } catch (error) {
    showNotification(`Error building index: ${error.message}`, true);
  }
}

/**
 * Update index status display
 */
function updateIndexStatus() {
  if (!searchIndex) return;
  
  const stats = searchIndex.getStats();
  
  document.getElementById('index-built-value').textContent = stats.cardCount > 0 ? 'Yes' : 'No';
  document.getElementById('index-built-value').className = 'status-value ' + (stats.cardCount > 0 ? 'success' : '');
  
  document.getElementById('index-count-value').textContent = stats.cardCount?.toLocaleString() || '0';
  document.getElementById('index-time-value').textContent = stats.buildTime 
    ? `${stats.buildTime}ms` 
    : '-';
}

/**
 * Perform local search
 */
function performLocalSearch() {
  if (!searchIndex || searchIndex.getStats().cardCount === 0) {
    showNotification('Search index not available. Please build the index first.', true);
    return;
  }
  
  const query = {
    text: document.getElementById('local-search-text')?.value || undefined,
    type: document.getElementById('local-search-type')?.value || undefined,
    format: document.getElementById('local-search-format')?.value || undefined,
    colorIdentity: document.getElementById('local-search-colors')?.value || undefined,
    colorIdentityOperator: '<=',
    manaValue: document.getElementById('local-search-mana')?.value || undefined,
    manaValueOperator: '<=',
    limit: 50
  };
  
  // Remove undefined values
  Object.keys(query).forEach(key => {
    if (query[key] === undefined || query[key] === '') {
      delete query[key];
    }
  });
  
  const results = searchIndex.search(query);
  displaySearchResults(results);
}

/**
 * Display search results
 */
function displaySearchResults(results) {
  const container = document.getElementById('local-search-results');
  const card = document.getElementById('local-search-results-card');
  const countEl = document.getElementById('local-results-count');
  
  if (!container || !card) return;
  
  card.style.display = 'block';
  countEl.textContent = `Found ${results.length} cards`;
  
  if (results.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No cards found matching your criteria.</p>';
    return;
  }
  
  container.innerHTML = results.map(card => {
    const imageUrl = card.image_uris?.small || card.card_faces?.[0]?.image_uris?.small || '';
    const colors = (card.color_identity || []).map(c => 
      `<span class="search-result-tag color-${c.toLowerCase()}">${c}</span>`
    ).join('');
    
    return `
      <div class="search-result-item">
        ${imageUrl ? `<img src="${imageUrl}" alt="${card.name}" class="search-result-image" loading="lazy">` : '<div class="search-result-image"></div>'}
        <div class="search-result-info">
          <div class="search-result-name">${escapeHtml(card.name)}</div>
          <div class="search-result-type">${escapeHtml(card.type_line || '')}</div>
          <div class="search-result-meta">
            ${card.cmc !== undefined ? `<span class="search-result-tag">CMC: ${card.cmc}</span>` : ''}
            ${colors}
            ${card.rarity ? `<span class="search-result-tag">${card.rarity}</span>` : ''}
            ${card.set ? `<span class="search-result-tag">${card.set.toUpperCase()}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Clear local search
 */
function clearLocalSearch() {
  document.getElementById('local-search-text').value = '';
  document.getElementById('local-search-type').value = '';
  document.getElementById('local-search-format').value = '';
  document.getElementById('local-search-colors').value = '';
  document.getElementById('local-search-mana').value = '';
  document.getElementById('local-search-results-card').style.display = 'none';
}

/**
 * Generate decks
 */
function generateDecks() {
  if (!deckGenerator || !searchIndex || searchIndex.getStats().cardCount === 0) {
    showNotification('Deck generator not available. Please build the index first.', true);
    return;
  }
  
  const format = document.getElementById('deck-format')?.value || 'standard';
  const count = parseInt(document.getElementById('deck-count')?.value) || 3;
  const colors = document.getElementById('deck-colors')?.value || '';
  const maxCmc = document.getElementById('deck-max-cmc')?.value;
  const minLands = document.getElementById('deck-min-lands')?.value;
  const maxLands = document.getElementById('deck-max-lands')?.value;
  const mustInclude = document.getElementById('deck-must-include')?.value
    ?.split(',')
    ?.map(s => s.trim())
    ?.filter(Boolean) || [];
  
  // Build query for card pool
  const query = {
    format: format
  };
  
  if (colors) {
    query.colorIdentity = colors;
    query.colorIdentityOperator = '<=';
  }
  
  // Build constraints
  const constraints = {
    format: format,
    colorIdentity: colors || undefined,
    maxManaValue: maxCmc ? parseInt(maxCmc) : undefined,
    minLands: minLands ? parseInt(minLands) : undefined,
    maxLands: maxLands ? parseInt(maxLands) : undefined,
    mustInclude: mustInclude
  };
  
  try {
    const result = deckGenerator.generateMultiple(query, constraints, count);
    
    if (result.error) {
      showNotification(result.error, true);
      return;
    }
    
    displayDeckResults(result.decks);
    showNotification(`Generated ${result.decks.length} decks from ${result.candidateCount} candidates`);
  } catch (error) {
    showNotification(`Error generating decks: ${error.message}`, true);
  }
}

/**
 * Display deck results
 */
function displayDeckResults(decks) {
  const container = document.getElementById('deck-results');
  const card = document.getElementById('deck-results-card');
  
  if (!container || !card) return;
  
  card.style.display = 'block';
  
  if (decks.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No decks generated.</p>';
    return;
  }
  
  container.innerHTML = decks.map((deck, index) => {
    const stats = deck.stats;
    const categories = {};
    
    // Group cards by category
    for (const entry of deck.deck) {
      const cat = deckGenerator.categorizeCard(entry.card);
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(entry);
    }
    
    const categoryHtml = Object.entries(categories).map(([cat, cards]) => `
      <div class="deck-category">
        <div class="deck-category-title">${cat}s (${cards.reduce((s, e) => s + e.count, 0)})</div>
        <div class="deck-cards">
          ${cards.map(e => `
            <span class="deck-card">
              <span class="deck-card-count">${e.count}x</span>${escapeHtml(e.card.name)}
            </span>
          `).join('')}
        </div>
      </div>
    `).join('');
    
    // Create mana curve
    const curveMax = Math.max(...Object.values(stats.manaCurve), 1);
    const curveHtml = Object.entries(stats.manaCurve).map(([slot, count]) => `
      <div class="mana-curve-bar">
        <div class="mana-curve-fill" style="height: ${(count / curveMax) * 60}px"></div>
        <div class="mana-curve-count">${count}</div>
        <div class="mana-curve-label">${slot}</div>
      </div>
    `).join('');
    
    return `
      <div class="deck-item">
        <div class="deck-header">
          <span class="deck-title">Deck ${index + 1}</span>
          <div class="deck-stats">
            <span class="deck-stat">Cards: <strong>${stats.totalCards}</strong></span>
            <span class="deck-stat">Unique: <strong>${stats.uniqueCards}</strong></span>
            <span class="deck-stat">Avg CMC: <strong>${stats.avgManaValue}</strong></span>
            <span class="deck-stat">Colors: <strong>${stats.colors.join('').toUpperCase() || 'C'}</strong></span>
          </div>
        </div>
        <div class="deck-body">
          <div class="mana-curve">${curveHtml}</div>
          ${categoryHtml}
        </div>
        <div class="deck-actions">
          <button class="deck-action-btn" onclick="copyDeckToClipboard(${index})">📋 Copy List</button>
          <button class="deck-action-btn secondary" onclick="exportDeck(${index}, 'text')">💾 Export</button>
        </div>
      </div>
    `;
  }).join('');
  
  // Store decks for export
  window.generatedDecks = decks;
}

/**
 * Copy deck to clipboard
 */
async function copyDeckToClipboard(index) {
  if (!window.generatedDecks || !window.generatedDecks[index]) return;
  
  const deck = window.generatedDecks[index];
  const text = deckGenerator.exportDeck(deck, 'text');
  
  try {
    await navigator.clipboard.writeText(text);
    showNotification('Deck list copied to clipboard!');
  } catch (err) {
    showNotification('Failed to copy', true);
  }
}

/**
 * Export deck
 */
function exportDeck(index, format) {
  if (!window.generatedDecks || !window.generatedDecks[index]) return;
  
  const deck = window.generatedDecks[index];
  const text = deckGenerator.exportDeck(deck, format);
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `deck-${index + 1}.${format === 'json' ? 'json' : 'txt'}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showNotification('Deck exported!');
}

/**
 * Clear deck results
 */
function clearDecks() {
  document.getElementById('deck-results-card').style.display = 'none';
  window.generatedDecks = [];
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  init();
  // Initialize data management after a short delay to ensure modules are loaded
  setTimeout(initDataManagement, 100);
});
