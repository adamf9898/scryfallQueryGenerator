/**
 * CardNormalizer - Parsing and normalization layer for Scryfall card data
 * 
 * This module provides functionality to:
 * - Normalize card data into a consistent internal schema
 * - Extract key fields for search and combinations
 * - Handle multi-faced cards properly
 * - De-duplicate functional reprints by oracle_id
 * 
 * @see https://scryfall.com/docs/api/cards for card object documentation
 */

class CardNormalizer {
  constructor(options = {}) {
    this.deduplicateByOracle = options.deduplicateByOracle !== false;
    this.normalizedCards = new Map();
    this.oracleIndex = new Map();
  }

  /**
   * Parse a type line into its components
   * @param {string} typeLine - The card's type line
   * @returns {Object} Parsed type information
   */
  parseTypeLine(typeLine) {
    if (!typeLine) {
      return { supertypes: [], types: [], subtypes: [] };
    }

    const supertypeList = ['Basic', 'Legendary', 'Snow', 'World', 'Ongoing', 'Elite', 'Host'];
    const typeList = ['Creature', 'Artifact', 'Enchantment', 'Land', 'Planeswalker', 
                      'Instant', 'Sorcery', 'Battle', 'Kindred', 'Conspiracy', 
                      'Phenomenon', 'Plane', 'Scheme', 'Vanguard', 'Dungeon'];

    // Split by " — " to separate types from subtypes
    const [mainPart, subtypePart] = typeLine.split(' — ');
    const mainWords = mainPart ? mainPart.split(/\s+/) : [];
    const subtypes = subtypePart ? subtypePart.split(/\s+/) : [];

    const supertypes = [];
    const types = [];

    for (const word of mainWords) {
      if (supertypeList.includes(word)) {
        supertypes.push(word.toLowerCase());
      } else if (typeList.includes(word)) {
        types.push(word.toLowerCase());
      }
    }

    return {
      supertypes,
      types,
      subtypes: subtypes.map(s => s.toLowerCase())
    };
  }

  /**
   * Parse mana cost into components
   * @param {string} manaCost - The mana cost string (e.g., "{2}{U}{U}")
   * @returns {Object} Parsed mana cost info
   */
  parseManaCost(manaCost) {
    if (!manaCost) {
      return { symbols: [], colors: [], generic: 0, colorless: 0 };
    }

    const symbols = [];
    const colors = new Set();
    let generic = 0;
    let colorless = 0;

    const symbolRegex = /\{([^}]+)\}/g;
    let match;

    while ((match = symbolRegex.exec(manaCost)) !== null) {
      const symbol = match[1];
      symbols.push(symbol);

      if (/^\d+$/.test(symbol)) {
        generic += parseInt(symbol, 10);
      } else if (symbol === 'C') {
        colorless += 1;
      } else if (symbol === 'X' || symbol === 'Y' || symbol === 'Z') {
        // Variable costs
      } else if (['W', 'U', 'B', 'R', 'G'].includes(symbol)) {
        colors.add(symbol.toLowerCase());
      } else if (symbol.includes('/')) {
        // Hybrid mana - add all colors
        for (const c of ['W', 'U', 'B', 'R', 'G']) {
          if (symbol.includes(c)) {
            colors.add(c.toLowerCase());
          }
        }
      }
    }

    return {
      symbols,
      colors: Array.from(colors),
      generic,
      colorless,
      original: manaCost
    };
  }

  /**
   * Extract keywords from oracle text
   * @param {string} oracleText - The oracle text
   * @param {Array} definedKeywords - Keywords defined by the card
   * @returns {Array} List of keywords
   */
  extractKeywords(oracleText, definedKeywords = []) {
    const keywords = new Set(definedKeywords.map(k => k.toLowerCase()));
    
    // Add any keywords detected in oracle text
    const keywordPatterns = [
      'flying', 'trample', 'haste', 'vigilance', 'lifelink', 'deathtouch',
      'first strike', 'double strike', 'hexproof', 'indestructible', 'menace',
      'reach', 'flash', 'defender', 'ward', 'protection', 'shroud',
      'equip', 'enchant', 'prowess', 'landwalk', 'forestwalk', 'islandwalk',
      'mountainwalk', 'swampwalk', 'plainswalk', 'fear', 'intimidate',
      'regenerate', 'unblockable', 'persist', 'undying', 'cascade',
      'cycling', 'flashback', 'kicker', 'multikicker', 'overload',
      'affinity', 'convoke', 'delve', 'emerge', 'improvise', 'spectacle',
      'escape', 'mutate', 'companion', 'partner', 'foretell', 'disturb',
      'daybound', 'nightbound', 'decayed', 'exploit', 'transform'
    ];

    if (oracleText) {
      const lowerText = oracleText.toLowerCase();
      for (const keyword of keywordPatterns) {
        if (lowerText.includes(keyword)) {
          keywords.add(keyword);
        }
      }
    }

    return Array.from(keywords);
  }

  /**
   * Normalize a single card face
   * @param {Object} face - Card face object
   * @returns {Object} Normalized face
   */
  normalizeFace(face) {
    if (!face) return null;

    const parsedType = this.parseTypeLine(face.type_line);
    const parsedMana = this.parseManaCost(face.mana_cost);

    return {
      name: face.name,
      mana_cost: face.mana_cost,
      parsed_mana: parsedMana,
      cmc: face.cmc,
      type_line: face.type_line,
      parsed_types: parsedType,
      oracle_text: face.oracle_text,
      colors: face.colors || [],
      power: face.power,
      toughness: face.toughness,
      loyalty: face.loyalty,
      defense: face.defense,
      flavor_text: face.flavor_text,
      image_uris: face.image_uris
    };
  }

  /**
   * Normalize a complete card object
   * @param {Object} card - Raw card object from Scryfall
   * @returns {Object} Normalized card
   */
  normalizeCard(card) {
    const parsedType = this.parseTypeLine(card.type_line);
    const parsedMana = this.parseManaCost(card.mana_cost);
    const keywords = this.extractKeywords(card.oracle_text, card.keywords);

    // Handle multi-faced cards
    const faces = card.card_faces 
      ? card.card_faces.map(f => this.normalizeFace(f))
      : null;

    // Combine face oracle texts for search
    let fullOracleText = card.oracle_text || '';
    if (faces) {
      fullOracleText = faces.map(f => f.oracle_text || '').join(' // ');
    }

    // Normalize legalities to simple boolean format
    const legalFormats = {};
    if (card.legalities) {
      for (const [format, legality] of Object.entries(card.legalities)) {
        legalFormats[format] = legality === 'legal' || legality === 'restricted';
      }
    }

    return {
      // Identifiers
      id: card.id,
      oracle_id: card.oracle_id,
      multiverse_ids: card.multiverse_ids,
      mtgo_id: card.mtgo_id,
      arena_id: card.arena_id,
      tcgplayer_id: card.tcgplayer_id,
      cardmarket_id: card.cardmarket_id,
      
      // Basic info
      name: card.name,
      lang: card.lang,
      released_at: card.released_at,
      uri: card.uri,
      scryfall_uri: card.scryfall_uri,
      
      // Set info
      set: card.set,
      set_name: card.set_name,
      set_type: card.set_type,
      collector_number: card.collector_number,
      
      // Casting info
      mana_cost: card.mana_cost,
      parsed_mana: parsedMana,
      cmc: card.cmc,
      colors: card.colors || [],
      color_identity: card.color_identity || [],
      
      // Type info
      type_line: card.type_line,
      parsed_types: parsedType,
      
      // Rules
      oracle_text: card.oracle_text,
      full_oracle_text: fullOracleText,
      keywords: keywords,
      
      // Creature stats
      power: card.power,
      toughness: card.toughness,
      loyalty: card.loyalty,
      defense: card.defense,
      
      // Layout
      layout: card.layout,
      card_faces: faces,
      
      // Legality
      legalities: card.legalities,
      legal_formats: legalFormats,
      reserved: card.reserved,
      
      // Rarity and price
      rarity: card.rarity,
      prices: card.prices,
      
      // Art and frame
      artist: card.artist,
      artist_ids: card.artist_ids,
      illustration_id: card.illustration_id,
      image_uris: card.image_uris,
      frame: card.frame,
      frame_effects: card.frame_effects,
      border_color: card.border_color,
      full_art: card.full_art,
      textless: card.textless,
      
      // Printing info
      reprint: card.reprint,
      variation: card.variation,
      promo: card.promo,
      promo_types: card.promo_types,
      booster: card.booster,
      digital: card.digital,
      foil: card.foil,
      nonfoil: card.nonfoil,
      finishes: card.finishes,
      
      // Flavor
      flavor_name: card.flavor_name,
      flavor_text: card.flavor_text,
      
      // Misc
      edhrec_rank: card.edhrec_rank,
      penny_rank: card.penny_rank,
      produced_mana: card.produced_mana,
      
      // Internal fields
      _normalized_at: new Date().toISOString()
    };
  }

  /**
   * Process a batch of cards
   * @param {Array} cards - Array of raw card objects
   * @returns {Array} Array of normalized cards
   */
  processCards(cards) {
    const normalizedCards = [];
    
    for (const card of cards) {
      const normalized = this.normalizeCard(card);
      normalizedCards.push(normalized);
      
      // Store in maps for quick access
      this.normalizedCards.set(card.id, normalized);
      
      if (card.oracle_id) {
        if (!this.oracleIndex.has(card.oracle_id)) {
          this.oracleIndex.set(card.oracle_id, []);
        }
        this.oracleIndex.get(card.oracle_id).push(normalized);
      }
    }
    
    return normalizedCards;
  }

  /**
   * Get deduplicated cards (one per oracle_id)
   * @returns {Array} Deduplicated card list
   */
  getDeduplicatedCards() {
    const unique = [];
    const seen = new Set();
    
    for (const [oracleId, cards] of this.oracleIndex) {
      if (!seen.has(oracleId)) {
        // Pick the most recent printing
        const sorted = cards.sort((a, b) => 
          new Date(b.released_at) - new Date(a.released_at)
        );
        unique.push(sorted[0]);
        seen.add(oracleId);
      }
    }
    
    return unique;
  }

  /**
   * Get a card by ID
   * @param {string} id - Card ID
   * @returns {Object|null}
   */
  getCardById(id) {
    return this.normalizedCards.get(id) || null;
  }

  /**
   * Get all printings of a card by oracle ID
   * @param {string} oracleId - Oracle ID
   * @returns {Array}
   */
  getCardsByOracleId(oracleId) {
    return this.oracleIndex.get(oracleId) || [];
  }

  /**
   * Stream process cards for large datasets
   * @param {Array} cards - Card data
   * @param {Function} onBatch - Callback for each batch
   * @param {number} batchSize - Size of each batch
   */
  async streamProcess(cards, onBatch, batchSize = 1000) {
    for (let i = 0; i < cards.length; i += batchSize) {
      const batch = cards.slice(i, i + batchSize);
      const normalized = this.processCards(batch);
      await onBatch(normalized, i, cards.length);
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  /**
   * Clear all normalized data
   */
  clear() {
    this.normalizedCards.clear();
    this.oracleIndex.clear();
  }

  /**
   * Get statistics about the normalized cards
   * @returns {Object}
   */
  getStats() {
    const stats = {
      totalCards: this.normalizedCards.size,
      uniqueCards: this.oracleIndex.size,
      byType: {},
      byColor: {},
      byRarity: {},
      byFormat: {},
      bySet: {}
    };

    for (const card of this.normalizedCards.values()) {
      // Count by type
      for (const type of card.parsed_types.types) {
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      }
      
      // Count by color
      if (card.colors.length === 0) {
        stats.byColor.colorless = (stats.byColor.colorless || 0) + 1;
      } else {
        for (const color of card.colors) {
          stats.byColor[color] = (stats.byColor[color] || 0) + 1;
        }
      }
      
      // Count by rarity
      if (card.rarity) {
        stats.byRarity[card.rarity] = (stats.byRarity[card.rarity] || 0) + 1;
      }
      
      // Count by format legality
      for (const [format, isLegal] of Object.entries(card.legal_formats)) {
        if (isLegal) {
          stats.byFormat[format] = (stats.byFormat[format] || 0) + 1;
        }
      }
      
      // Count by set
      if (card.set) {
        stats.bySet[card.set] = (stats.bySet[card.set] || 0) + 1;
      }
    }

    return stats;
  }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CardNormalizer;
}
