/**
 * ScryfallQueryBuilder - A fluent API for building Scryfall search queries
 * 
 * This class provides a chainable interface for constructing complex
 * Scryfall search queries for Magic: The Gathering cards.
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
      // Use quotes for multi-word names
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
    if (value !== undefined && value !== null) {
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
    if (power !== undefined && power !== null) {
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
    if (toughness !== undefined && toughness !== null) {
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
    if (price !== undefined && price !== null) {
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
    if (price !== undefined && price !== null) {
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
    if (price !== undefined && price !== null) {
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

module.exports = ScryfallQueryBuilder;
