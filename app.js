/**
 * Scryfall Query Generator - Web Application
 * 
 * This application provides an easy-to-use interface for creating Scryfall queries,
 * catering to both novice and experienced Magic: The Gathering players.
 * 
 * Features:
 * - Live query preview as you type
 * - Input validation with helpful error messages
 * - Tooltips for guidance
 * - Quick example queries
 * - Copy to clipboard functionality
 * - Mobile-responsive design
 * 
 * @see https://scryfall.com/docs/syntax for Scryfall search syntax documentation
 */

/**
 * ScryfallQueryBuilder - A fluent API for building Scryfall search queries
 * Browser-compatible version embedded in the web app
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
   * @param {string} type - The card type
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
   * @param {string|string[]} colors - Color(s) to search for
   * @param {string} [operator='='] - Comparison operator
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
   * @param {string|string[]} colors - Color(s) to search for
   * @param {string} [operator='='] - Comparison operator
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
   * @param {string} cost - The mana cost
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
   * @param {string} rarity - The rarity
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
   * @param {string} set - The set code
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
   * @param {string} format - The format
   * @returns {ScryfallQueryBuilder}
   */
  format(format) {
    if (format && format.trim()) {
      this.parts.push(`f:${format.trim().toLowerCase()}`);
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
   * Search for cards with a specific frame
   * @param {string} frame - The frame type
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
   * @param {string} border - The border color
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
   * Search for cards with specific keywords
   * @param {string} keyword - The keyword
   * @returns {ScryfallQueryBuilder}
   */
  keyword(keyword) {
    if (keyword && keyword.trim()) {
      this.parts.push(`keyword:${keyword.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Filter by extra properties (is: filters)
   * @param {string} property - The property to filter by
   * @returns {ScryfallQueryBuilder}
   */
  is(property) {
    if (property && property.trim()) {
      this.parts.push(`is:${property.trim().toLowerCase()}`);
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
}

// ===== Application State =====
let builder = new ScryfallQueryBuilder();
const selectedKeywords = new Set();
const selectedIsFilters = new Set();

// ===== DOM Elements =====
const elements = {
  form: null,
  queryDisplay: null,
  urlDisplay: null,
  errorDisplay: null,
  notification: null
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', init);

/**
 * Initialize the application
 */
function init() {
  // Cache DOM elements
  elements.form = document.getElementById('query-form');
  elements.queryDisplay = document.getElementById('query-display');
  elements.urlDisplay = document.getElementById('url-display');
  elements.errorDisplay = document.getElementById('error-display');
  elements.notification = document.getElementById('notification');

  // Setup event listeners
  setupFormListeners();
  setupButtonListeners();
  setupCollapsibleSections();
  setupKeywordTags();
  setupIsFilterTags();
  setupExampleButtons();

  // Initial query update
  updateQuery();
}

/**
 * Setup form input event listeners for live preview
 */
function setupFormListeners() {
  if (!elements.form) return;

  // Listen for all input changes
  elements.form.addEventListener('input', debounce(updateQuery, 150));
  elements.form.addEventListener('change', updateQuery);

  // Setup validation for specific fields
  setupValidation();
}

/**
 * Setup input validation
 */
function setupValidation() {
  // Card name validation
  const cardNameInput = document.getElementById('card-name');
  if (cardNameInput) {
    cardNameInput.addEventListener('input', () => {
      validateCardName(cardNameInput);
    });
  }

  // Mana value validation
  const manaValueInput = document.getElementById('mana-value');
  if (manaValueInput) {
    manaValueInput.addEventListener('input', () => {
      validateNumericInput(manaValueInput, 0, 20, 'mana-value-error');
    });
  }

  // Set code validation
  const setInput = document.getElementById('set');
  if (setInput) {
    setInput.addEventListener('input', () => {
      validateSetCode(setInput);
    });
  }
}

/**
 * Validate card name input
 * @param {HTMLInputElement} input 
 */
function validateCardName(input) {
  const errorEl = document.getElementById('card-name-error');
  const value = input.value.trim();

  if (value.length > 100) {
    showValidationError(errorEl, 'Card name is too long (max 100 characters)');
    return false;
  }

  // Check for potentially problematic characters
  if (/[<>{}]/.test(value)) {
    showValidationError(errorEl, 'Card name contains invalid characters');
    return false;
  }

  clearValidationError(errorEl);
  return true;
}

/**
 * Validate numeric input
 * @param {HTMLInputElement} input 
 * @param {number} min 
 * @param {number} max 
 * @param {string} errorId 
 */
function validateNumericInput(input, min, max, errorId) {
  const errorEl = document.getElementById(errorId);
  const value = input.value;

  if (value === '') {
    clearValidationError(errorEl);
    return true;
  }

  const num = parseFloat(value);
  if (isNaN(num)) {
    showValidationError(errorEl, 'Please enter a valid number');
    return false;
  }

  if (num < min) {
    showValidationError(errorEl, `Minimum value is ${min}`);
    return false;
  }

  if (num > max) {
    showValidationError(errorEl, `Maximum value is ${max}`);
    return false;
  }

  clearValidationError(errorEl);
  return true;
}

/**
 * Validate set code input
 * @param {HTMLInputElement} input 
 */
function validateSetCode(input) {
  const errorEl = document.getElementById('set-error');
  const value = input.value.trim();

  if (value === '') {
    clearValidationError(errorEl);
    return true;
  }

  // Set codes are typically 3-5 alphanumeric characters
  if (!/^[a-zA-Z0-9]{2,10}$/.test(value)) {
    showValidationError(errorEl, 'Set code should be 2-10 alphanumeric characters');
    return false;
  }

  clearValidationError(errorEl);
  return true;
}

/**
 * Show validation error message
 * @param {HTMLElement} errorEl 
 * @param {string} message 
 */
function showValidationError(errorEl, message) {
  if (errorEl) {
    errorEl.textContent = message;
  }
}

/**
 * Clear validation error message
 * @param {HTMLElement} errorEl 
 */
function clearValidationError(errorEl) {
  if (errorEl) {
    errorEl.textContent = '';
  }
}

/**
 * Setup button click event listeners
 */
function setupButtonListeners() {
  // Search button
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', searchScryfall);
  }

  // Copy query button
  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyQuery);
  }

  // Copy URL button
  const copyUrlBtn = document.getElementById('copy-url-btn');
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', copyUrl);
  }

  // Reset button
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }
}

/**
 * Setup collapsible sections
 */
function setupCollapsibleSections() {
  const collapsibles = document.querySelectorAll('.collapsible');
  
  collapsibles.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.collapse-icon');
      
      header.classList.toggle('collapsed');
      content.classList.toggle('collapsed');
      
      // Update icon
      if (icon) {
        icon.textContent = header.classList.contains('collapsed') ? '▶' : '▼';
      }
    });
  });
}

/**
 * Setup keyword tag selection
 */
function setupKeywordTags() {
  const container = document.getElementById('keywords-container');
  if (!container) return;

  const tags = container.querySelectorAll('.keyword-tag');
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      const keyword = tag.dataset.keyword;
      
      if (selectedKeywords.has(keyword)) {
        selectedKeywords.delete(keyword);
        tag.classList.remove('selected');
      } else {
        selectedKeywords.add(keyword);
        tag.classList.add('selected');
      }
      
      updateQuery();
    });

    // Make accessible via keyboard
    tag.setAttribute('tabindex', '0');
    tag.setAttribute('role', 'button');
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tag.click();
      }
    });
  });
}

/**
 * Setup is: filter tag selection
 */
function setupIsFilterTags() {
  const container = document.getElementById('is-filters-container');
  if (!container) return;

  const tags = container.querySelectorAll('.keyword-tag');
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      const filter = tag.dataset.filter;
      
      if (selectedIsFilters.has(filter)) {
        selectedIsFilters.delete(filter);
        tag.classList.remove('selected');
      } else {
        selectedIsFilters.add(filter);
        tag.classList.add('selected');
      }
      
      updateQuery();
    });

    // Make accessible via keyboard
    tag.setAttribute('tabindex', '0');
    tag.setAttribute('role', 'button');
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tag.click();
      }
    });
  });
}

/**
 * Setup example query buttons
 */
function setupExampleButtons() {
  const buttons = document.querySelectorAll('.example-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const example = btn.dataset.example;
      loadExample(example);
    });
  });
}

/**
 * Load an example query
 * @param {string} exampleName 
 */
function loadExample(exampleName) {
  // Reset form first
  resetFormWithoutNotification();

  switch (exampleName) {
    case 'cheap-creatures':
      document.getElementById('type').value = 'creature';
      document.getElementById('mana-value').value = '3';
      document.getElementById('mana-value-operator').value = '<=';
      break;

    case 'commander-legends':
      document.getElementById('type').value = 'legendary';
      document.getElementById('format').value = 'commander';
      break;

    case 'blue-instants':
      document.getElementById('type').value = 'instant';
      document.getElementById('oracle-text').value = 'draw';
      // Select blue color
      const blueCheckbox = document.querySelector('.color-input[value="u"]');
      if (blueCheckbox) blueCheckbox.checked = true;
      break;

    case 'budget-cards':
      document.getElementById('price-usd').value = '1';
      document.getElementById('price-usd-operator').value = '<';
      // Expand advanced options to show the price field
      const advancedHeader = document.querySelector('.card h2.collapsible');
      if (advancedHeader && advancedHeader.classList.contains('collapsed')) {
        advancedHeader.click();
      }
      break;

    case 'flying-creatures':
      document.getElementById('type').value = 'creature';
      document.getElementById('format').value = 'modern';
      // Select flying keyword
      const flyingTag = document.querySelector('.keyword-tag[data-keyword="flying"]');
      if (flyingTag && !flyingTag.classList.contains('selected')) {
        flyingTag.click();
        return; // click will trigger updateQuery
      }
      break;

    default:
      break;
  }

  updateQuery();
  showNotification('Example loaded!');
}

/**
 * Update the query based on current form values
 */
function updateQuery() {
  builder = new ScryfallQueryBuilder();

  // Card Name
  const cardName = document.getElementById('card-name')?.value || '';
  const exactMatch = document.getElementById('exact-match')?.checked || false;
  
  if (cardName.trim()) {
    if (exactMatch) {
      builder.exactName(cardName);
    } else {
      builder.name(cardName);
    }
  }

  // Oracle Text
  const oracleText = document.getElementById('oracle-text')?.value || '';
  if (oracleText.trim()) {
    builder.oracleText(oracleText);
  }

  // Flavor Text
  const flavorText = document.getElementById('flavor-text')?.value || '';
  if (flavorText.trim()) {
    builder.flavorText(flavorText);
  }

  // Type
  const type = document.getElementById('type')?.value || '';
  if (type) {
    builder.type(type);
  }

  // Colors
  const colorMode = document.getElementById('color-mode')?.value || 'color';
  const colorOperator = document.getElementById('color-operator')?.value || '=';
  const colorInputs = document.querySelectorAll('.color-input:checked');
  const selectedColors = Array.from(colorInputs).map(input => input.value);

  if (selectedColors.length > 0) {
    const colorStr = selectedColors.join('');
    if (colorMode === 'identity') {
      builder.colorIdentity(colorStr, colorOperator);
    } else {
      builder.color(colorStr, colorOperator);
    }
  }

  // Mana Value
  const manaValue = document.getElementById('mana-value')?.value || '';
  const manaValueOp = document.getElementById('mana-value-operator')?.value || '=';
  if (manaValue !== '') {
    builder.manaValue(manaValue, manaValueOp);
  }

  // Power
  const power = document.getElementById('power')?.value || '';
  const powerOp = document.getElementById('power-operator')?.value || '=';
  if (power !== '') {
    builder.power(power, powerOp);
  }

  // Toughness
  const toughness = document.getElementById('toughness')?.value || '';
  const toughnessOp = document.getElementById('toughness-operator')?.value || '=';
  if (toughness !== '') {
    builder.toughness(toughness, toughnessOp);
  }

  // Rarity
  const rarity = document.getElementById('rarity')?.value || '';
  const rarityOp = document.getElementById('rarity-operator')?.value || '=';
  if (rarity) {
    builder.rarity(rarity, rarityOp);
  }

  // Set
  const set = document.getElementById('set')?.value || '';
  if (set.trim()) {
    builder.set(set);
  }

  // Format
  const format = document.getElementById('format')?.value || '';
  if (format) {
    builder.format(format);
  }

  // Artist
  const artist = document.getElementById('artist')?.value || '';
  if (artist.trim()) {
    builder.artist(artist);
  }

  // Frame
  const frame = document.getElementById('frame')?.value || '';
  if (frame) {
    builder.frame(frame);
  }

  // Border
  const border = document.getElementById('border')?.value || '';
  if (border) {
    builder.border(border);
  }

  // Price USD
  const priceUsd = document.getElementById('price-usd')?.value || '';
  const priceUsdOp = document.getElementById('price-usd-operator')?.value || '=';
  if (priceUsd !== '') {
    builder.priceUsd(priceUsd, priceUsdOp);
  }

  // Keywords
  selectedKeywords.forEach(keyword => {
    builder.keyword(keyword);
  });

  // Is filters
  selectedIsFilters.forEach(filter => {
    builder.is(filter);
  });

  // Raw query
  const rawQuery = document.getElementById('raw-query')?.value || '';
  if (rawQuery.trim()) {
    builder.raw(rawQuery);
  }

  // Update display
  const query = builder.build();
  
  if (elements.queryDisplay) {
    elements.queryDisplay.textContent = query;
  }
  
  if (elements.urlDisplay) {
    elements.urlDisplay.textContent = query ? builder.toUrl() : '';
  }

  // Update button states
  updateButtonStates(query);
}

/**
 * Update button enabled/disabled states based on query
 * @param {string} query 
 */
function updateButtonStates(query) {
  const searchBtn = document.getElementById('search-btn');
  const copyBtn = document.getElementById('copy-btn');
  const copyUrlBtn = document.getElementById('copy-url-btn');

  const hasQuery = query && query.trim().length > 0;

  if (searchBtn) searchBtn.disabled = !hasQuery;
  if (copyBtn) copyBtn.disabled = !hasQuery;
  if (copyUrlBtn) copyUrlBtn.disabled = !hasQuery;
}

/**
 * Open Scryfall search in new tab
 */
function searchScryfall() {
  const query = builder.build();
  
  if (!query || !query.trim()) {
    showNotification('Please add some search criteria first', true);
    return;
  }

  const url = builder.toUrl();
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Copy query to clipboard
 */
async function copyQuery() {
  const query = builder.build();
  
  if (!query || !query.trim()) {
    showNotification('No query to copy', true);
    return;
  }

  try {
    await navigator.clipboard.writeText(query);
    showNotification('Query copied to clipboard!');
  } catch (err) {
    // Fallback for older browsers
    fallbackCopyToClipboard(query);
  }
}

/**
 * Copy URL to clipboard
 */
async function copyUrl() {
  const query = builder.build();
  
  if (!query || !query.trim()) {
    showNotification('No URL to copy', true);
    return;
  }

  const url = builder.toUrl();

  try {
    await navigator.clipboard.writeText(url);
    showNotification('URL copied to clipboard!');
  } catch (err) {
    // Fallback for older browsers
    fallbackCopyToClipboard(url);
  }
}

/**
 * Fallback copy to clipboard for older browsers
 * @param {string} text 
 */
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification('Copied to clipboard!');
    } else {
      showNotification('Failed to copy', true);
    }
  } catch (err) {
    showNotification('Failed to copy', true);
  }

  document.body.removeChild(textArea);
}

/**
 * Reset the form to default state
 */
function resetForm() {
  resetFormWithoutNotification();
  showNotification('Form reset!');
}

/**
 * Reset form without showing notification (used internally)
 */
function resetFormWithoutNotification() {
  // Reset form fields
  if (elements.form) {
    elements.form.reset();
  }

  // Clear color checkboxes
  document.querySelectorAll('.color-input').forEach(checkbox => {
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

  // Clear validation messages
  document.querySelectorAll('.validation-message').forEach(el => {
    el.textContent = '';
  });

  // Update query display
  updateQuery();
}

/**
 * Show notification message
 * @param {string} message - The message to display
 * @param {boolean} [isError=false] - Whether this is an error message
 */
function showNotification(message, isError = false) {
  if (!elements.notification) return;

  elements.notification.textContent = message;
  elements.notification.classList.remove('error');
  
  if (isError) {
    elements.notification.classList.add('error');
  }
  
  elements.notification.classList.add('show');

  // Hide after 3 seconds
  setTimeout(() => {
    elements.notification.classList.remove('show');
  }, 3000);
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in ms
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
