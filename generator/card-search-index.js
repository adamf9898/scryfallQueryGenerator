/**
 * CardSearchIndex - Search index for Scryfall card data
 * 
 * This module provides functionality to:
 * - Build and maintain a search index over card data
 * - Support structured filters (color, type, mana, etc.)
 * - Support full-text search over oracle text
 * - Enable fast querying with Boolean operators
 * 
 * @see https://scryfall.com/docs/syntax for query syntax reference
 */

class CardSearchIndex {
  constructor(options = {}) {
    this.cards = new Map();
    this.textIndex = new Map();
    this.fieldIndices = {
      name: new Map(),
      type: new Map(),
      supertype: new Map(),
      subtype: new Map(),
      color: new Map(),
      colorIdentity: new Map(),
      rarity: new Map(),
      set: new Map(),
      keyword: new Map(),
      format: new Map(),
      artist: new Map(),
      manaValue: new Map(),
      power: new Map(),
      toughness: new Map()
    };
    this.version = 1;
    this.buildTime = null;
    this.onProgress = options.onProgress || (() => {});
  }

  /**
   * Build the search index from normalized card data
   * @param {Array} cards - Normalized card data
   */
  buildIndex(cards) {
    this.onProgress({ status: 'building', message: 'Building search index...', total: cards.length });
    
    const startTime = Date.now();
    this.clear();

    let processed = 0;
    for (const card of cards) {
      this.indexCard(card);
      processed++;
      
      if (processed % 1000 === 0) {
        this.onProgress({ 
          status: 'building', 
          message: `Indexed ${processed}/${cards.length} cards...`,
          progress: processed / cards.length
        });
      }
    }

    this.buildTime = Date.now() - startTime;
    this.onProgress({ 
      status: 'complete', 
      message: `Index built in ${this.buildTime}ms`,
      cardCount: this.cards.size
    });
  }

  /**
   * Index a single card
   * @param {Object} card - Normalized card object
   */
  indexCard(card) {
    // Store the card
    this.cards.set(card.id, card);

    // Index name (tokenized)
    this.indexTokens(card.name, 'name', card.id);

    // Index types
    for (const type of card.parsed_types.types) {
      this.addToFieldIndex('type', type, card.id);
    }
    for (const supertype of card.parsed_types.supertypes) {
      this.addToFieldIndex('supertype', supertype, card.id);
    }
    for (const subtype of card.parsed_types.subtypes) {
      this.addToFieldIndex('subtype', subtype, card.id);
    }

    // Index colors
    if (card.colors.length === 0) {
      this.addToFieldIndex('color', 'c', card.id);
    } else {
      for (const color of card.colors) {
        this.addToFieldIndex('color', color.toLowerCase(), card.id);
      }
    }

    // Index color identity
    if (card.color_identity.length === 0) {
      this.addToFieldIndex('colorIdentity', 'c', card.id);
    } else {
      for (const color of card.color_identity) {
        this.addToFieldIndex('colorIdentity', color.toLowerCase(), card.id);
      }
    }

    // Index rarity
    if (card.rarity) {
      this.addToFieldIndex('rarity', card.rarity, card.id);
    }

    // Index set
    if (card.set) {
      this.addToFieldIndex('set', card.set.toLowerCase(), card.id);
    }

    // Index keywords
    for (const keyword of card.keywords || []) {
      this.addToFieldIndex('keyword', keyword.toLowerCase(), card.id);
    }

    // Index format legality
    for (const [format, isLegal] of Object.entries(card.legal_formats || {})) {
      if (isLegal) {
        this.addToFieldIndex('format', format, card.id);
      }
    }

    // Index artist
    if (card.artist) {
      this.addToFieldIndex('artist', card.artist.toLowerCase(), card.id);
    }

    // Index mana value
    if (card.cmc !== undefined && card.cmc !== null) {
      this.addToFieldIndex('manaValue', card.cmc.toString(), card.id);
    }

    // Index power and toughness (for creatures)
    if (card.power !== undefined && card.power !== null) {
      this.addToFieldIndex('power', card.power.toString(), card.id);
    }
    if (card.toughness !== undefined && card.toughness !== null) {
      this.addToFieldIndex('toughness', card.toughness.toString(), card.id);
    }

    // Index oracle text for full-text search
    this.indexFullText(card.full_oracle_text || card.oracle_text, card.id);
  }

  /**
   * Tokenize and index text
   * @param {string} text - Text to tokenize
   * @param {string} field - Field name
   * @param {string} cardId - Card ID
   */
  indexTokens(text, field, cardId) {
    if (!text) return;
    
    const tokens = this.tokenize(text);
    for (const token of tokens) {
      this.addToFieldIndex(field, token, cardId);
    }
  }

  /**
   * Index full text for search
   * @param {string} text - Text to index
   * @param {string} cardId - Card ID
   */
  indexFullText(text, cardId) {
    if (!text) return;
    
    const tokens = this.tokenize(text);
    for (const token of tokens) {
      if (!this.textIndex.has(token)) {
        this.textIndex.set(token, new Set());
      }
      this.textIndex.get(token).add(cardId);
    }
  }

  /**
   * Tokenize text into searchable terms
   * @param {string} text - Text to tokenize
   * @returns {Array} Tokens
   */
  tokenize(text) {
    if (!text) return [];
    
    return text
      .toLowerCase()
      .replace(/[^\w\s+/-]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 1);
  }

  /**
   * Add a value to a field index
   * @param {string} field - Field name
   * @param {string} value - Value to index
   * @param {string} cardId - Card ID
   */
  addToFieldIndex(field, value, cardId) {
    if (!this.fieldIndices[field]) {
      this.fieldIndices[field] = new Map();
    }
    
    if (!this.fieldIndices[field].has(value)) {
      this.fieldIndices[field].set(value, new Set());
    }
    
    this.fieldIndices[field].get(value).add(cardId);
  }

  /**
   * Query the index
   * @param {Object} query - Query object
   * @returns {Array} Matching cards
   */
  search(query) {
    let resultIds = null;

    // Text search
    if (query.text) {
      resultIds = this.searchText(query.text);
    }

    // Name search
    if (query.name) {
      const nameIds = this.searchField('name', query.name);
      resultIds = resultIds ? this.intersect(resultIds, nameIds) : nameIds;
    }

    // Type filter
    if (query.type) {
      const types = Array.isArray(query.type) ? query.type : [query.type];
      let typeIds = new Set();
      for (const type of types) {
        const ids = this.getFieldIds('type', type.toLowerCase()) ||
                    this.getFieldIds('subtype', type.toLowerCase()) ||
                    this.getFieldIds('supertype', type.toLowerCase());
        if (ids) {
          typeIds = this.union(typeIds, ids);
        }
      }
      resultIds = resultIds ? this.intersect(resultIds, typeIds) : typeIds;
    }

    // Color filter
    if (query.colors) {
      const colorIds = this.searchColors(query.colors, query.colorOperator || '=', 'color');
      resultIds = resultIds ? this.intersect(resultIds, colorIds) : colorIds;
    }

    // Color identity filter
    if (query.colorIdentity) {
      const idIds = this.searchColors(query.colorIdentity, query.colorIdentityOperator || '=', 'colorIdentity');
      resultIds = resultIds ? this.intersect(resultIds, idIds) : idIds;
    }

    // Mana value filter
    if (query.manaValue !== undefined) {
      const mvIds = this.searchNumeric('manaValue', query.manaValue, query.manaValueOperator || '=');
      resultIds = resultIds ? this.intersect(resultIds, mvIds) : mvIds;
    }

    // Power filter
    if (query.power !== undefined) {
      const powIds = this.searchNumeric('power', query.power, query.powerOperator || '=');
      resultIds = resultIds ? this.intersect(resultIds, powIds) : powIds;
    }

    // Toughness filter
    if (query.toughness !== undefined) {
      const touIds = this.searchNumeric('toughness', query.toughness, query.toughnessOperator || '=');
      resultIds = resultIds ? this.intersect(resultIds, touIds) : touIds;
    }

    // Rarity filter
    if (query.rarity) {
      const rarityIds = this.searchRarity(query.rarity, query.rarityOperator || '=');
      resultIds = resultIds ? this.intersect(resultIds, rarityIds) : rarityIds;
    }

    // Set filter
    if (query.set) {
      const setIds = this.getFieldIds('set', query.set.toLowerCase());
      if (setIds) {
        resultIds = resultIds ? this.intersect(resultIds, setIds) : setIds;
      } else {
        resultIds = new Set();
      }
    }

    // Format filter
    if (query.format) {
      const formatIds = this.getFieldIds('format', query.format.toLowerCase());
      if (formatIds) {
        resultIds = resultIds ? this.intersect(resultIds, formatIds) : formatIds;
      } else {
        resultIds = new Set();
      }
    }

    // Keyword filter
    if (query.keyword) {
      const keywords = Array.isArray(query.keyword) ? query.keyword : [query.keyword];
      for (const keyword of keywords) {
        const keyIds = this.getFieldIds('keyword', keyword.toLowerCase());
        if (keyIds) {
          resultIds = resultIds ? this.intersect(resultIds, keyIds) : keyIds;
        } else {
          resultIds = new Set();
        }
      }
    }

    // Artist filter
    if (query.artist) {
      const artistIds = this.searchField('artist', query.artist.toLowerCase());
      resultIds = resultIds ? this.intersect(resultIds, artistIds) : artistIds;
    }

    // If no filters applied, return all cards
    if (resultIds === null) {
      resultIds = new Set(this.cards.keys());
    }

    // Get card objects
    let results = Array.from(resultIds).map(id => this.cards.get(id)).filter(Boolean);

    // Apply sorting
    if (query.sortBy) {
      results = this.sortResults(results, query.sortBy, query.sortOrder || 'asc');
    }

    // Apply pagination
    if (query.limit !== undefined) {
      const offset = query.offset || 0;
      results = results.slice(offset, offset + query.limit);
    }

    return results;
  }

  /**
   * Search full text
   * @param {string} text - Search text
   * @returns {Set} Matching card IDs
   */
  searchText(text) {
    const tokens = this.tokenize(text);
    if (tokens.length === 0) return new Set();

    // Check for OR operator
    const isOr = text.toLowerCase().includes(' or ');
    
    let resultIds = null;
    for (const token of tokens) {
      if (token === 'or' || token === 'and') continue;
      
      const tokenIds = this.textIndex.get(token) || new Set();
      
      if (resultIds === null) {
        resultIds = new Set(tokenIds);
      } else if (isOr) {
        resultIds = this.union(resultIds, tokenIds);
      } else {
        resultIds = this.intersect(resultIds, tokenIds);
      }
    }

    return resultIds || new Set();
  }

  /**
   * Search a specific field
   * @param {string} field - Field name
   * @param {string} value - Value to search
   * @returns {Set} Matching card IDs
   */
  searchField(field, value) {
    const tokens = this.tokenize(value);
    if (tokens.length === 0) return new Set();

    let resultIds = null;
    for (const token of tokens) {
      const tokenIds = this.fieldIndices[field]?.get(token) || new Set();
      if (resultIds === null) {
        resultIds = new Set(tokenIds);
      } else {
        resultIds = this.intersect(resultIds, tokenIds);
      }
    }

    return resultIds || new Set();
  }

  /**
   * Get IDs from a field index
   * @param {string} field - Field name
   * @param {string} value - Value to look up
   * @returns {Set|null} Matching IDs or null
   */
  getFieldIds(field, value) {
    return this.fieldIndices[field]?.get(value) || null;
  }

  /**
   * Search colors with operator support
   * @param {string} colors - Color string (e.g., "ub", "wubrg")
   * @param {string} operator - Comparison operator
   * @param {string} field - Field to search (color or colorIdentity)
   * @returns {Set} Matching card IDs
   */
  searchColors(colors, operator, field) {
    const targetColors = new Set(colors.toLowerCase().split('').filter(c => 'wubrgc'.includes(c)));
    const resultIds = new Set();

    for (const [cardId, card] of this.cards) {
      const cardColors = new Set(
        (field === 'colorIdentity' ? card.color_identity : card.colors)
          .map(c => c.toLowerCase())
      );
      
      // Handle colorless
      if (cardColors.size === 0) {
        cardColors.add('c');
      }

      let matches = false;
      switch (operator) {
        case '=':
          matches = this.setsEqual(cardColors, targetColors);
          break;
        case '<=':
          matches = this.isSubset(cardColors, targetColors);
          break;
        case '>=':
          matches = this.isSubset(targetColors, cardColors);
          break;
        case '<':
          matches = this.isProperSubset(cardColors, targetColors);
          break;
        case '>':
          matches = this.isProperSubset(targetColors, cardColors);
          break;
      }

      if (matches) {
        resultIds.add(cardId);
      }
    }

    return resultIds;
  }

  /**
   * Search numeric values with operator support
   * @param {string} field - Field name
   * @param {number} value - Target value
   * @param {string} operator - Comparison operator
   * @returns {Set} Matching card IDs
   */
  searchNumeric(field, value, operator) {
    const resultIds = new Set();
    const targetValue = parseFloat(value);

    for (const [cardId, card] of this.cards) {
      let cardValue;
      switch (field) {
        case 'manaValue':
          cardValue = card.cmc;
          break;
        case 'power':
          cardValue = parseFloat(card.power);
          break;
        case 'toughness':
          cardValue = parseFloat(card.toughness);
          break;
        default:
          continue;
      }

      if (isNaN(cardValue)) continue;

      let matches = false;
      switch (operator) {
        case '=':
          matches = cardValue === targetValue;
          break;
        case '<':
          matches = cardValue < targetValue;
          break;
        case '>':
          matches = cardValue > targetValue;
          break;
        case '<=':
          matches = cardValue <= targetValue;
          break;
        case '>=':
          matches = cardValue >= targetValue;
          break;
      }

      if (matches) {
        resultIds.add(cardId);
      }
    }

    return resultIds;
  }

  /**
   * Search rarity with operator support
   * @param {string} rarity - Target rarity
   * @param {string} operator - Comparison operator
   * @returns {Set} Matching card IDs
   */
  searchRarity(rarity, operator) {
    const rarityOrder = ['common', 'uncommon', 'rare', 'mythic'];
    const targetIndex = rarityOrder.indexOf(rarity.toLowerCase());
    
    if (targetIndex === -1) {
      return this.getFieldIds('rarity', rarity.toLowerCase()) || new Set();
    }

    const resultIds = new Set();
    
    for (const [cardId, card] of this.cards) {
      const cardIndex = rarityOrder.indexOf(card.rarity);
      if (cardIndex === -1) continue;

      let matches = false;
      switch (operator) {
        case '=':
          matches = cardIndex === targetIndex;
          break;
        case '<':
          matches = cardIndex < targetIndex;
          break;
        case '>':
          matches = cardIndex > targetIndex;
          break;
        case '<=':
          matches = cardIndex <= targetIndex;
          break;
        case '>=':
          matches = cardIndex >= targetIndex;
          break;
      }

      if (matches) {
        resultIds.add(cardId);
      }
    }

    return resultIds;
  }

  /**
   * Sort results
   * @param {Array} results - Results to sort
   * @param {string} sortBy - Field to sort by
   * @param {string} order - Sort order (asc/desc)
   * @returns {Array} Sorted results
   */
  sortResults(results, sortBy, order) {
    const multiplier = order === 'desc' ? -1 : 1;

    return results.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          return multiplier * aVal.localeCompare(bVal);
        case 'manaValue':
        case 'cmc':
          aVal = a.cmc || 0;
          bVal = b.cmc || 0;
          break;
        case 'rarity':
          const order = ['common', 'uncommon', 'rare', 'mythic'];
          aVal = order.indexOf(a.rarity);
          bVal = order.indexOf(b.rarity);
          break;
        case 'released':
          aVal = new Date(a.released_at || 0);
          bVal = new Date(b.released_at || 0);
          break;
        case 'color':
          aVal = (a.colors || []).join('');
          bVal = (b.colors || []).join('');
          return multiplier * aVal.localeCompare(bVal);
        default:
          return 0;
      }

      return multiplier * (aVal - bVal);
    });
  }

  // Set operations
  intersect(setA, setB) {
    return new Set([...setA].filter(x => setB.has(x)));
  }

  union(setA, setB) {
    return new Set([...setA, ...setB]);
  }

  setsEqual(setA, setB) {
    if (setA.size !== setB.size) return false;
    for (const item of setA) {
      if (!setB.has(item)) return false;
    }
    return true;
  }

  isSubset(setA, setB) {
    for (const item of setA) {
      if (!setB.has(item)) return false;
    }
    return true;
  }

  isProperSubset(setA, setB) {
    return this.isSubset(setA, setB) && setA.size < setB.size;
  }

  /**
   * Clear the index
   */
  clear() {
    this.cards.clear();
    this.textIndex.clear();
    for (const field of Object.keys(this.fieldIndices)) {
      this.fieldIndices[field].clear();
    }
  }

  /**
   * Get index statistics
   * @returns {Object}
   */
  getStats() {
    return {
      cardCount: this.cards.size,
      textTokens: this.textIndex.size,
      buildTime: this.buildTime,
      fieldStats: Object.fromEntries(
        Object.entries(this.fieldIndices).map(([field, index]) => [field, index.size])
      )
    };
  }

  /**
   * Export index for storage
   * @returns {Object}
   */
  export() {
    return {
      version: this.version,
      cards: Array.from(this.cards.entries()),
      textIndex: Array.from(this.textIndex.entries()).map(([k, v]) => [k, Array.from(v)]),
      fieldIndices: Object.fromEntries(
        Object.entries(this.fieldIndices).map(([field, index]) => [
          field,
          Array.from(index.entries()).map(([k, v]) => [k, Array.from(v)])
        ])
      )
    };
  }

  /**
   * Import index from storage
   * @param {Object} data - Exported index data
   */
  import(data) {
    if (data.version !== this.version) {
      throw new Error(`Index version mismatch: expected ${this.version}, got ${data.version}`);
    }

    this.cards = new Map(data.cards);
    this.textIndex = new Map(data.textIndex.map(([k, v]) => [k, new Set(v)]));
    this.fieldIndices = Object.fromEntries(
      Object.entries(data.fieldIndices).map(([field, entries]) => [
        field,
        new Map(entries.map(([k, v]) => [k, new Set(v)]))
      ])
    );
  }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CardSearchIndex;
}
