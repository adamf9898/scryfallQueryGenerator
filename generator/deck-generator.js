/**
 * DeckGenerator - Combinatorial deck configuration generator
 * 
 * This module provides functionality to:
 * - Generate deck configurations based on constraints
 * - Support various deck sizes and formats (60-card, Commander 100-card)
 * - Apply multiplicity constraints (4-of, singleton, etc.)
 * - Implement smart sampling for large search spaces
 * 
 * @see https://scryfall.com/docs/api/cards for card object documentation
 */

class DeckGenerator {
  constructor(searchIndex, options = {}) {
    this.searchIndex = searchIndex;
    this.generatedDecks = [];
    this.onProgress = options.onProgress || (() => {});
    
    // Default configurations for common formats
    this.formatConfigs = {
      standard: { deckSize: 60, maxCopies: 4, minLands: 20, maxLands: 26 },
      modern: { deckSize: 60, maxCopies: 4, minLands: 20, maxLands: 26 },
      pioneer: { deckSize: 60, maxCopies: 4, minLands: 20, maxLands: 26 },
      legacy: { deckSize: 60, maxCopies: 4, minLands: 20, maxLands: 26 },
      vintage: { deckSize: 60, maxCopies: 4, minLands: 20, maxLands: 26 },
      commander: { deckSize: 100, maxCopies: 1, minLands: 35, maxLands: 40, hasCommander: true },
      brawl: { deckSize: 60, maxCopies: 1, minLands: 22, maxLands: 26, hasCommander: true },
      pauper: { deckSize: 60, maxCopies: 4, minLands: 20, maxLands: 26 },
      limited: { deckSize: 40, maxCopies: 99, minLands: 16, maxLands: 18 }
    };
  }

  /**
   * Get format configuration
   * @param {string} format - Format name
   * @returns {Object} Format configuration
   */
  getFormatConfig(format) {
    return this.formatConfigs[format?.toLowerCase()] || this.formatConfigs.standard;
  }

  /**
   * Get a pool of candidate cards based on query
   * @param {Object} query - Query to filter candidates
   * @returns {Array} Candidate cards
   */
  getCandidatePool(query) {
    return this.searchIndex.search(query);
  }

  /**
   * Validate deck constraints
   * @param {Object} constraints - Deck constraints
   * @returns {Object} Validated constraints with defaults
   */
  validateConstraints(constraints) {
    const format = constraints.format || 'standard';
    const formatConfig = this.getFormatConfig(format);

    return {
      format: format,
      deckSize: constraints.deckSize || formatConfig.deckSize,
      maxCopies: constraints.maxCopies ?? formatConfig.maxCopies,
      minLands: constraints.minLands ?? formatConfig.minLands,
      maxLands: constraints.maxLands ?? formatConfig.maxLands,
      hasCommander: constraints.hasCommander ?? formatConfig.hasCommander,
      commander: constraints.commander || null,
      colorIdentity: constraints.colorIdentity || null,
      minCreatures: constraints.minCreatures,
      maxCreatures: constraints.maxCreatures,
      minSpells: constraints.minSpells,
      maxSpells: constraints.maxSpells,
      avgManaValue: constraints.avgManaValue,
      maxManaValue: constraints.maxManaValue,
      bannedCards: constraints.bannedCards || [],
      mustInclude: constraints.mustInclude || [],
      categories: constraints.categories || null
    };
  }

  /**
   * Check if a card is valid for the deck
   * @param {Object} card - Card to check
   * @param {Object} constraints - Deck constraints
   * @param {Object} currentDeck - Current deck state
   * @returns {boolean} Whether the card is valid
   */
  isCardValid(card, constraints, currentDeck) {
    // Check if card is banned
    if (constraints.bannedCards.includes(card.name)) {
      return false;
    }

    // Check format legality
    if (constraints.format && card.legal_formats) {
      if (!card.legal_formats[constraints.format]) {
        return false;
      }
    }

    // Check color identity for Commander/Brawl
    if (constraints.colorIdentity && constraints.hasCommander) {
      const allowedColors = new Set(constraints.colorIdentity.toLowerCase().split(''));
      const cardColors = card.color_identity.map(c => c.toLowerCase());
      for (const color of cardColors) {
        if (!allowedColors.has(color) && color !== 'c') {
          return false;
        }
      }
    }

    // Check copy limits
    const cardCount = currentDeck.cardCounts.get(card.name) || 0;
    
    // Basic lands are exempt from copy limits
    const isBasicLand = card.type_line?.includes('Basic') && card.type_line?.includes('Land');
    if (!isBasicLand && cardCount >= constraints.maxCopies) {
      return false;
    }

    // Check max mana value
    if (constraints.maxManaValue !== undefined && card.cmc > constraints.maxManaValue) {
      return false;
    }

    return true;
  }

  /**
   * Categorize a card
   * @param {Object} card - Card to categorize
   * @returns {string} Category
   */
  categorizeCard(card) {
    const types = card.parsed_types?.types || [];
    
    if (types.includes('land')) return 'land';
    if (types.includes('creature')) return 'creature';
    if (types.includes('planeswalker')) return 'planeswalker';
    if (types.includes('instant')) return 'instant';
    if (types.includes('sorcery')) return 'sorcery';
    if (types.includes('enchantment')) return 'enchantment';
    if (types.includes('artifact')) return 'artifact';
    if (types.includes('battle')) return 'battle';
    return 'other';
  }

  /**
   * Get mana curve category
   * @param {number} cmc - Converted mana cost
   * @returns {string} Curve slot
   */
  getManaCurveSlot(cmc) {
    if (cmc <= 1) return '0-1';
    if (cmc === 2) return '2';
    if (cmc === 3) return '3';
    if (cmc === 4) return '4';
    if (cmc === 5) return '5';
    return '6+';
  }

  /**
   * Calculate deck statistics
   * @param {Array} deck - Deck card list
   * @returns {Object} Deck statistics
   */
  calculateDeckStats(deck) {
    const stats = {
      totalCards: 0,
      uniqueCards: new Set(),
      byCategory: {},
      manaCurve: { '0-1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6+': 0 },
      colors: new Set(),
      avgManaValue: 0,
      totalManaValue: 0,
      nonLandCount: 0
    };

    for (const entry of deck) {
      const count = entry.count || 1;
      const card = entry.card;
      
      stats.totalCards += count;
      stats.uniqueCards.add(card.name);
      
      const category = this.categorizeCard(card);
      stats.byCategory[category] = (stats.byCategory[category] || 0) + count;
      
      if (category !== 'land') {
        stats.manaCurve[this.getManaCurveSlot(card.cmc)] += count;
        stats.totalManaValue += (card.cmc || 0) * count;
        stats.nonLandCount += count;
      }
      
      for (const color of card.color_identity || []) {
        stats.colors.add(color);
      }
    }

    stats.avgManaValue = stats.nonLandCount > 0 
      ? (stats.totalManaValue / stats.nonLandCount).toFixed(2)
      : 0;
    stats.uniqueCards = stats.uniqueCards.size;
    stats.colors = Array.from(stats.colors);

    return stats;
  }

  /**
   * Shuffle array using Fisher-Yates
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Generate a random deck using sampling
   * @param {Array} candidates - Candidate card pool
   * @param {Object} constraints - Deck constraints
   * @returns {Object} Generated deck
   */
  generateRandomDeck(candidates, constraints) {
    const validatedConstraints = this.validateConstraints(constraints);
    const deck = [];
    const currentDeck = {
      cardCounts: new Map(),
      byCategory: {},
      totalManaValue: 0,
      nonLandCount: 0
    };

    // Separate lands from non-lands
    const lands = candidates.filter(c => this.categorizeCard(c) === 'land');
    const nonLands = candidates.filter(c => this.categorizeCard(c) !== 'land');

    // Add must-include cards first
    for (const cardName of validatedConstraints.mustInclude) {
      const card = nonLands.find(c => c.name.toLowerCase() === cardName.toLowerCase()) ||
                   lands.find(c => c.name.toLowerCase() === cardName.toLowerCase());
      if (card && this.isCardValid(card, validatedConstraints, currentDeck)) {
        this.addCardToDeck(deck, card, currentDeck, validatedConstraints);
      }
    }

    // Determine land count
    const targetLands = validatedConstraints.minLands + 
      Math.floor(Math.random() * (validatedConstraints.maxLands - validatedConstraints.minLands + 1));
    
    // Add lands
    const shuffledLands = this.shuffle(lands);
    for (const land of shuffledLands) {
      if (currentDeck.byCategory.land >= targetLands) break;
      if (this.isCardValid(land, validatedConstraints, currentDeck)) {
        this.addCardToDeck(deck, land, currentDeck, validatedConstraints);
      }
    }

    // Add non-lands
    const shuffledNonLands = this.shuffle(nonLands);
    for (const card of shuffledNonLands) {
      if (deck.reduce((sum, e) => sum + e.count, 0) >= validatedConstraints.deckSize) break;
      if (this.isCardValid(card, validatedConstraints, currentDeck)) {
        this.addCardToDeck(deck, card, currentDeck, validatedConstraints);
      }
    }

    // Calculate stats
    const stats = this.calculateDeckStats(deck);

    return {
      deck: deck,
      constraints: validatedConstraints,
      stats: stats,
      valid: stats.totalCards >= validatedConstraints.deckSize * 0.9
    };
  }

  /**
   * Add a card to the deck
   * @param {Array} deck - Deck array
   * @param {Object} card - Card to add
   * @param {Object} currentDeck - Current deck state
   * @param {Object} constraints - Deck constraints
   */
  addCardToDeck(deck, card, currentDeck, constraints) {
    const category = this.categorizeCard(card);
    const isBasicLand = card.type_line?.includes('Basic') && card.type_line?.includes('Land');
    const currentCount = currentDeck.cardCounts.get(card.name) || 0;
    
    // Determine how many copies to add
    let copiesToAdd = 1;
    if (isBasicLand) {
      // For basic lands, add multiple copies to meet land requirements
      const currentLands = currentDeck.byCategory.land || 0;
      const targetLands = constraints.maxLands;
      copiesToAdd = Math.min(4, targetLands - currentLands);
    } else if (constraints.maxCopies > 1) {
      // For non-singleton formats, randomly add 1-maxCopies
      copiesToAdd = Math.min(
        Math.ceil(Math.random() * constraints.maxCopies),
        constraints.maxCopies - currentCount
      );
    }

    if (copiesToAdd <= 0) return;

    // Find existing entry or create new one
    const existingEntry = deck.find(e => e.card.id === card.id);
    if (existingEntry) {
      existingEntry.count += copiesToAdd;
    } else {
      deck.push({ card: card, count: copiesToAdd });
    }

    // Update state
    currentDeck.cardCounts.set(card.name, currentCount + copiesToAdd);
    currentDeck.byCategory[category] = (currentDeck.byCategory[category] || 0) + copiesToAdd;
    
    if (category !== 'land') {
      currentDeck.totalManaValue += (card.cmc || 0) * copiesToAdd;
      currentDeck.nonLandCount += copiesToAdd;
    }
  }

  /**
   * Generate multiple decks
   * @param {Object} query - Query to filter candidates
   * @param {Object} constraints - Deck constraints
   * @param {number} count - Number of decks to generate
   * @returns {Array} Generated decks
   */
  generateMultiple(query, constraints, count = 5) {
    const candidates = this.getCandidatePool(query);
    
    if (candidates.length === 0) {
      return { decks: [], error: 'No cards match the query' };
    }

    this.onProgress({ 
      status: 'generating', 
      message: `Generating ${count} decks from ${candidates.length} candidates...` 
    });

    const decks = [];
    for (let i = 0; i < count; i++) {
      const deck = this.generateRandomDeck(candidates, constraints);
      decks.push(deck);
      
      this.onProgress({ 
        status: 'generating', 
        message: `Generated ${i + 1}/${count} decks`,
        progress: (i + 1) / count
      });
    }

    this.onProgress({ 
      status: 'complete', 
      message: `Generated ${count} decks` 
    });

    return { decks: decks, candidateCount: candidates.length };
  }

  /**
   * Generate a Commander deck
   * @param {Object} commander - Commander card
   * @param {Object} additionalConstraints - Additional constraints
   * @returns {Object} Generated Commander deck
   */
  generateCommanderDeck(commander, additionalConstraints = {}) {
    if (!commander) {
      throw new Error('Commander is required');
    }

    // Get commander's color identity
    const colorIdentity = commander.color_identity?.join('') || 'c';

    const constraints = {
      ...additionalConstraints,
      format: 'commander',
      colorIdentity: colorIdentity,
      hasCommander: true,
      commander: commander.name,
      deckSize: 99, // Excluding commander
      maxCopies: 1
    };

    // Query for cards in commander's color identity
    const query = {
      format: 'commander',
      colorIdentity: colorIdentity,
      colorIdentityOperator: '<='
    };

    const candidates = this.getCandidatePool(query);
    
    // Remove the commander from candidates
    const filteredCandidates = candidates.filter(c => c.oracle_id !== commander.oracle_id);

    const deck = this.generateRandomDeck(filteredCandidates, constraints);
    
    // Add commander to deck info
    deck.commander = commander;
    deck.deck.unshift({ card: commander, count: 1, isCommander: true });
    deck.stats = this.calculateDeckStats(deck.deck);

    return deck;
  }

  /**
   * Suggest improvements for a deck
   * @param {Array} deck - Current deck
   * @param {Object} constraints - Deck constraints
   * @returns {Object} Suggestions
   */
  suggestImprovements(deck, constraints) {
    const stats = this.calculateDeckStats(deck);
    const suggestions = [];

    // Check land count
    const landCount = stats.byCategory.land || 0;
    if (constraints.minLands !== undefined && landCount < constraints.minLands) {
      suggestions.push({
        type: 'warning',
        message: `Land count (${landCount}) is below minimum (${constraints.minLands})`,
        action: 'Add more lands'
      });
    } else if (constraints.maxLands !== undefined && landCount > constraints.maxLands) {
      suggestions.push({
        type: 'warning',
        message: `Land count (${landCount}) is above maximum (${constraints.maxLands})`,
        action: 'Remove some lands'
      });
    }

    // Check mana curve
    const lowCmc = stats.manaCurve['0-1'] + stats.manaCurve['2'];
    const highCmc = stats.manaCurve['5'] + stats.manaCurve['6+'];
    
    if (lowCmc < stats.nonLandCount * 0.3) {
      suggestions.push({
        type: 'info',
        message: 'Low early-game presence',
        action: 'Consider adding more 1-2 mana cards'
      });
    }

    if (highCmc > stats.nonLandCount * 0.25) {
      suggestions.push({
        type: 'info',
        message: 'Heavy top-end curve',
        action: 'Consider reducing high-cost cards or adding ramp'
      });
    }

    // Check average mana value
    if (parseFloat(stats.avgManaValue) > 3.5) {
      suggestions.push({
        type: 'warning',
        message: `High average mana value (${stats.avgManaValue})`,
        action: 'Consider lowering the curve'
      });
    }

    return {
      stats: stats,
      suggestions: suggestions,
      isValid: suggestions.filter(s => s.type === 'error').length === 0
    };
  }

  /**
   * Export deck to different formats
   * @param {Object} deck - Deck object
   * @param {string} format - Export format (text, json, csv, mtgo)
   * @returns {string} Formatted deck
   */
  exportDeck(deck, format = 'text') {
    switch (format.toLowerCase()) {
      case 'text':
        return this.exportToText(deck);
      case 'json':
        return JSON.stringify(deck, null, 2);
      case 'csv':
        return this.exportToCsv(deck);
      case 'mtgo':
        return this.exportToMtgo(deck);
      default:
        return this.exportToText(deck);
    }
  }

  /**
   * Export deck to plain text
   * @param {Object} deckObj - Deck object
   * @returns {string} Text representation
   */
  exportToText(deckObj) {
    const lines = [];
    const deck = deckObj.deck || deckObj;
    
    // Group by category
    const byCategory = {};
    for (const entry of deck) {
      const category = this.categorizeCard(entry.card);
      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(entry);
    }

    // Output by category
    for (const [category, cards] of Object.entries(byCategory)) {
      lines.push(`// ${category.charAt(0).toUpperCase() + category.slice(1)}s`);
      for (const entry of cards) {
        lines.push(`${entry.count}x ${entry.card.name}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Export deck to CSV
   * @param {Object} deckObj - Deck object
   * @returns {string} CSV representation
   */
  exportToCsv(deckObj) {
    const deck = deckObj.deck || deckObj;
    const lines = ['Count,Name,Type,CMC,Set'];
    
    for (const entry of deck) {
      lines.push([
        entry.count,
        `"${entry.card.name}"`,
        `"${entry.card.type_line || ''}"`,
        entry.card.cmc || 0,
        entry.card.set || ''
      ].join(','));
    }

    return lines.join('\n');
  }

  /**
   * Export deck to MTGO format
   * @param {Object} deckObj - Deck object
   * @returns {string} MTGO format
   */
  exportToMtgo(deckObj) {
    const deck = deckObj.deck || deckObj;
    const lines = [];
    
    // Mainboard
    for (const entry of deck) {
      if (!entry.isSideboard) {
        lines.push(`${entry.count} ${entry.card.name}`);
      }
    }

    // Sideboard
    const sideboard = deck.filter(e => e.isSideboard);
    if (sideboard.length > 0) {
      lines.push('');
      lines.push('Sideboard');
      for (const entry of sideboard) {
        lines.push(`${entry.count} ${entry.card.name}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Clear generated decks
   */
  clear() {
    this.generatedDecks = [];
  }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeckGenerator;
}
