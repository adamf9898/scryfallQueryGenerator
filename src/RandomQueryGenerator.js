/**
 * RandomQueryGenerator - Generates unique random Scryfall search queries
 * 
 * This class generates random, unique Scryfall queries using the ScryfallQueryBuilder.
 * Queries are formatted with '+' instead of spaces and do not include card names.
 * 
 * @see https://scryfall.com/docs/syntax for Scryfall search syntax documentation
 */
const ScryfallQueryBuilder = require('./ScryfallQueryBuilder');

class RandomQueryGenerator {
  constructor(options = {}) {
    this.generatedQueries = new Set();
    this.maxRetries = options.maxRetries || 100;
    
    // Configuration for random query generation
    // Note: Multi-word keywords use spaces internally and are converted to '+' in the final output
    this.config = {
      types: ['creature', 'instant', 'sorcery', 'enchantment', 'artifact', 'planeswalker', 'land', 'battle'],
      colors: ['w', 'u', 'b', 'r', 'g', 'c'],
      formats: ['standard', 'modern', 'legacy', 'vintage', 'commander', 'pioneer', 'pauper', 'historic'],
      rarities: ['common', 'uncommon', 'rare', 'mythic'],
      operators: ['=', '<', '>', '<=', '>='],
      // Multi-word keywords use spaces - they will be converted to '+' in the final output
      keywords: ['flying', 'trample', 'haste', 'vigilance', 'lifelink', 'deathtouch', 'first strike', 'double strike', 'hexproof', 'indestructible', 'menace', 'reach', 'flash', 'defender', 'ward'],
      isFilters: ['commander', 'spell', 'permanent', 'modal', 'vanilla', 'booster', 'reprint', 'promo', 'foil'],
      borders: ['black', 'white', 'silver', 'gold', 'borderless'],
      frames: ['1993', '1997', '2003', '2015', 'future'],
      // Oracle text patterns are single-word terms to search for within card text
      oracleTextPatterns: ['destroy', 'draw', 'counter', 'exile', 'damage', 'life', 'mana', 'token', 'sacrifice', 'discard', 'graveyard', 'battlefield', 'library', 'hand', 'creature', 'enchantment', 'artifact', 'land', 'planeswalker', 'sorcery', 'instant', 'spell', 'permanent', 'player', 'opponent', 'controller', 'owner', 'target', 'choose', 'create', 'put', 'return', 'search', 'shuffle', 'tap', 'untap', 'attack', 'block', 'combat', 'phase', 'turn', 'upkeep'],
      ...options.config
    };
  }

  /**
   * Get a random element from an array
   * @param {Array} arr - Array to pick from
   * @returns {*} Random element from the array
   */
  _randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Get a random number within a range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random integer in the range
   */
  _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get a random boolean
   * @returns {boolean}
   */
  _randomBool() {
    return Math.random() < 0.5;
  }

  /**
   * Fisher-Yates shuffle algorithm for proper randomization
   * @param {Array} arr - Array to shuffle
   * @returns {Array} New shuffled array
   */
  _shuffle(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Get random colors (1-3 colors)
   * @returns {string} Color string (e.g., 'ub', 'wbr')
   */
  _randomColors() {
    const numColors = this._randomInt(1, 3);
    const shuffled = this._shuffle(this.config.colors);
    return shuffled.slice(0, numColors).join('');
  }

  /**
   * Generate a random query using ScryfallQueryBuilder
   * @returns {string} The generated query
   */
  _generateRandomQuery() {
    const builder = new ScryfallQueryBuilder();
    
    // Randomly add different query parts (but never card names)
    // Each query will have between 2 and 6 filters
    const numFilters = this._randomInt(2, 6);
    const usedFilters = new Set();
    
    const filterOptions = [
      'type',
      'color',
      'colorIdentity',
      'manaValue',
      'power',
      'toughness',
      'rarity',
      'format',
      'keyword',
      'is',
      'oracleText',
      'frame',
      'border'
    ];
    
    // Shuffle and pick filters using Fisher-Yates
    const shuffled = this._shuffle(filterOptions);
    
    for (let i = 0; i < numFilters && i < shuffled.length; i++) {
      const filter = shuffled[i];
      
      if (usedFilters.has(filter)) continue;
      usedFilters.add(filter);
      
      switch (filter) {
        case 'type':
          builder.type(this._randomElement(this.config.types));
          break;
        case 'color':
          builder.color(this._randomColors(), this._randomElement(this.config.operators));
          break;
        case 'colorIdentity':
          builder.colorIdentity(this._randomColors(), this._randomElement(this.config.operators));
          break;
        case 'manaValue':
          builder.manaValue(this._randomInt(0, 10), this._randomElement(this.config.operators));
          break;
        case 'power':
          builder.power(this._randomInt(0, 10), this._randomElement(this.config.operators));
          break;
        case 'toughness':
          builder.toughness(this._randomInt(0, 10), this._randomElement(this.config.operators));
          break;
        case 'rarity':
          builder.rarity(this._randomElement(this.config.rarities), this._randomElement(this.config.operators));
          break;
        case 'format':
          builder.format(this._randomElement(this.config.formats));
          break;
        case 'keyword':
          builder.keyword(this._randomElement(this.config.keywords));
          break;
        case 'is':
          builder.is(this._randomElement(this.config.isFilters));
          break;
        case 'oracleText':
          builder.oracleText(this._randomElement(this.config.oracleTextPatterns));
          break;
        case 'frame':
          builder.frame(this._randomElement(this.config.frames));
          break;
        case 'border':
          builder.border(this._randomElement(this.config.borders));
          break;
      }
    }
    
    return builder.build();
  }

  /**
   * Format the query with '+' instead of spaces
   * @param {string} query - The query to format
   * @returns {string} Query with '+' replacing spaces
   */
  _formatQuery(query) {
    return query.replace(/ /g, '+');
  }

  /**
   * Generate a single unique query
   * @returns {string|null} The unique query, or null if couldn't generate one after max retries
   */
  generate() {
    for (let i = 0; i < this.maxRetries; i++) {
      const query = this._generateRandomQuery();
      const formattedQuery = this._formatQuery(query);
      
      if (!this.generatedQueries.has(formattedQuery)) {
        this.generatedQueries.add(formattedQuery);
        return formattedQuery;
      }
    }
    return null;
  }

  /**
   * Generate multiple unique queries
   * @param {number} count - Number of queries to generate
   * @returns {string[]} Array of unique queries
   */
  generateMultiple(count) {
    const queries = [];
    for (let i = 0; i < count; i++) {
      const query = this.generate();
      if (query) {
        queries.push(query);
      } else {
        break; // Could not generate more unique queries
      }
    }
    return queries;
  }

  /**
   * Reset the generator (clear the set of generated queries)
   */
  reset() {
    this.generatedQueries.clear();
  }

  /**
   * Get the number of queries generated so far
   * @returns {number}
   */
  getGeneratedCount() {
    return this.generatedQueries.size;
  }

  /**
   * Check if a query has already been generated
   * @param {string} query - The query to check
   * @returns {boolean}
   */
  hasGenerated(query) {
    return this.generatedQueries.has(query);
  }
}

module.exports = RandomQueryGenerator;
