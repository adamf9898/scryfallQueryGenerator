/**
 * Data Module Index
 * 
 * Central export for all MTG data files used by the Scryfall Query Generator.
 * These data files contain structured information about Magic: The Gathering
 * cards, formats, mechanics, and query syntax.
 * 
 * @module data
 */

// Import all data files
const colors = require('./colors.json');
const types = require('./types.json');
const keywords = require('./keywords.json');
const formats = require('./formats.json');
const rarities = require('./rarities.json');
const operators = require('./operators.json');
const sets = require('./sets.json');
const queryTemplates = require('./query-templates.json');

/**
 * Color data including single colors, pairs, trios, and multicolor combinations
 * @type {Object}
 */
module.exports.colors = colors;

/**
 * Card type data including supertypes, card types, and subtypes
 * @type {Object}
 */
module.exports.types = types;

/**
 * Keyword abilities data including evergreen, deciduous, and set-specific keywords
 * @type {Object}
 */
module.exports.keywords = keywords;

/**
 * Format data for constructed, multiplayer, limited, and digital formats
 * @type {Object}
 */
module.exports.formats = formats;

/**
 * Rarity information and pack distribution data
 * @type {Object}
 */
module.exports.rarities = rarities;

/**
 * Scryfall operator syntax for queries
 * @type {Object}
 */
module.exports.operators = operators;

/**
 * MTG set information including recent and popular sets
 * @type {Object}
 */
module.exports.sets = sets;

/**
 * Pre-built query templates for common search patterns
 * @type {Object}
 */
module.exports.queryTemplates = queryTemplates;

// Convenience exports for common use cases

/**
 * Get all color codes as an array
 * @returns {string[]} Array of color codes ['w', 'u', 'b', 'r', 'g', 'c']
 */
module.exports.getColorCodes = function() {
  return colors.colors.map(c => c.code);
};

/**
 * Get all color names as an array
 * @returns {string[]} Array of color names
 */
module.exports.getColorNames = function() {
  return colors.colors.map(c => c.name);
};

/**
 * Get all card types as an array
 * @returns {string[]} Array of card type names
 */
module.exports.getCardTypes = function() {
  return types.cardTypes.map(t => t.name);
};

/**
 * Get all creature types as an array
 * @returns {string[]} Array of creature type names
 */
module.exports.getCreatureTypes = function() {
  return types.creatureTypes;
};

/**
 * Get all evergreen keywords as an array
 * @returns {string[]} Array of evergreen keyword names
 */
module.exports.getEvergreenKeywords = function() {
  return keywords.evergreen.map(k => k.name);
};

/**
 * Get all keywords (evergreen + deciduous + common) as an array
 * @returns {string[]} Array of all keyword names
 */
module.exports.getAllKeywords = function() {
  return [
    ...keywords.evergreen.map(k => k.name),
    ...keywords.deciduous.map(k => k.name),
    ...keywords.common.map(k => k.name)
  ];
};

/**
 * Get all format codes as an array
 * @returns {string[]} Array of format codes
 */
module.exports.getFormatCodes = function() {
  const allFormats = [
    ...formats.constructed,
    ...formats.multiplayer,
    ...formats.limited,
    ...formats.digital,
    ...formats.casual
  ];
  return allFormats.map(f => f.code);
};

/**
 * Get format by code
 * @param {string} code - Format code (e.g., 'modern', 'commander')
 * @returns {Object|null} Format object or null if not found
 */
module.exports.getFormat = function(code) {
  const allFormats = [
    ...formats.constructed,
    ...formats.multiplayer,
    ...formats.limited,
    ...formats.digital,
    ...formats.casual
  ];
  return allFormats.find(f => f.code === code.toLowerCase()) || null;
};

/**
 * Get rarity codes in order from common to mythic
 * @returns {string[]} Array of rarity codes
 */
module.exports.getRarityCodes = function() {
  return rarities.hierarchy;
};

/**
 * Get comparison operators
 * @returns {Object[]} Array of comparison operator objects
 */
module.exports.getComparisonOperators = function() {
  return operators.comparison;
};

/**
 * Get recent set codes
 * @returns {string[]} Array of recent set codes
 */
module.exports.getRecentSetCodes = function() {
  return sets.recentSets.map(s => s.code);
};

/**
 * Get query templates by category
 * @param {string} category - Category name
 * @returns {Object[]} Array of query template objects
 */
module.exports.getTemplatesByCategory = function(category) {
  return queryTemplates.templates.filter(t => t.category === category);
};

/**
 * Get all query template categories
 * @returns {Object} Categories object with name and description
 */
module.exports.getTemplateCategories = function() {
  return queryTemplates.categories;
};

/**
 * Find a color pair or trio by its codes
 * @param {string} codes - Color codes (e.g., 'ub', 'wub')
 * @returns {Object|null} Color combination object or null
 */
module.exports.findColorCombination = function(codes) {
  const sortedCodes = codes.toLowerCase().split('').sort().join('');
  
  // Check pairs
  for (const pair of [...colors.colorPairs.allied, ...colors.colorPairs.enemy]) {
    if (pair.codes.split('').sort().join('') === sortedCodes) {
      return pair;
    }
  }
  
  // Check trios
  for (const trio of [...colors.colorTrios.shards, ...colors.colorTrios.wedges]) {
    if (trio.codes.split('').sort().join('') === sortedCodes) {
      return trio;
    }
  }
  
  // Check four-color
  for (const quad of colors.fourColor) {
    if (quad.codes.split('').sort().join('') === sortedCodes) {
      return quad;
    }
  }
  
  // Check five-color
  if (colors.fiveColor.codes.split('').sort().join('') === sortedCodes) {
    return colors.fiveColor;
  }
  
  return null;
};

/**
 * Find keyword by name
 * @param {string} name - Keyword name
 * @returns {Object|null} Keyword object or null
 */
module.exports.findKeyword = function(name) {
  const lowerName = name.toLowerCase();
  
  const allKeywords = [
    ...keywords.evergreen,
    ...keywords.deciduous,
    ...keywords.common
  ];
  
  return allKeywords.find(k => k.name.toLowerCase() === lowerName) || null;
};
