/**
 * Advanced Scryfall Query Examples
 * 
 * This file demonstrates advanced usage patterns for the ScryfallQueryBuilder
 * and RandomQueryGenerator classes.
 */

// ===== Browser Usage =====
// If using in browser, the classes are available globally from app.js

// ===== Node.js Usage =====
// const { ScryfallQueryBuilder, RandomQueryGenerator } = require('scryfall-query-generator');

/**
 * Example 1: Building Complex Commander Queries
 */
function buildCommanderQuery(colors, maxManaValue, tribe) {
  const builder = new ScryfallQueryBuilder();
  
  builder
    .type('creature')
    .type('legendary')
    .colorIdentity(colors, '<=')
    .format('commander')
    .is('commander');
  
  if (maxManaValue) {
    builder.manaValue(maxManaValue, '<=');
  }
  
  if (tribe) {
    builder.type(tribe);
  }
  
  return builder.build();
}

// Usage:
// const query = buildCommanderQuery('bg', 5, 'elf');
// Result: "t:creature t:legendary id<=bg f:commander is:commander mv<=5 t:elf"

/**
 * Example 2: Building Budget Deck Queries
 */
function buildBudgetQuery(options = {}) {
  const {
    maxPrice = 5,
    format = 'commander',
    type = null,
    rarity = null
  } = options;
  
  const builder = new ScryfallQueryBuilder();
  
  builder
    .format(format)
    .priceUsd(maxPrice, '<');
  
  if (type) builder.type(type);
  if (rarity) builder.rarity(rarity, '>=');
  
  return {
    query: builder.build(),
    url: builder.toUrl()
  };
}

// Usage:
// const result = buildBudgetQuery({ maxPrice: 1, type: 'creature', rarity: 'rare' });
// Result: { query: "f:commander usd<1 t:creature r>=rare", url: "https://scryfall.com/..." }

/**
 * Example 3: Tribal Deck Builder
 */
function buildTribalQuery(tribe, colors, options = {}) {
  const {
    format = 'commander',
    includeSupport = true,
    maxManaValue = null
  } = options;
  
  const builder = new ScryfallQueryBuilder();
  
  builder.format(format);
  
  if (includeSupport) {
    // Include creatures of the tribe OR cards that reference the tribe
    builder.or(b => {
      b.type(tribe);
      b.oracleText(tribe);
    });
  } else {
    builder.type('creature').type(tribe);
  }
  
  if (colors) {
    builder.colorIdentity(colors, '<=');
  }
  
  if (maxManaValue) {
    builder.manaValue(maxManaValue, '<=');
  }
  
  return builder.build();
}

// Usage:
// const query = buildTribalQuery('elf', 'bg', { maxManaValue: 4 });
// Result: "f:commander (t:elf or o:elf) id<=bg mv<=4"

/**
 * Example 4: Removal Spell Finder
 */
function findRemovalSpells(targetType, colors, options = {}) {
  const {
    format = 'modern',
    maxManaValue = 4,
    instant = true
  } = options;
  
  const builder = new ScryfallQueryBuilder();
  
  if (instant) {
    builder.type('instant');
  } else {
    builder.or(b => b.type('instant').type('sorcery'));
  }
  
  builder.format(format);
  
  // Add removal text patterns based on target
  switch (targetType) {
    case 'creature':
      builder.or(b => {
        b.oracleText('destroy target creature');
        b.oracleText('exile target creature');
      });
      break;
    case 'artifact':
      builder.or(b => {
        b.oracleText('destroy target artifact');
        b.oracleText('exile target artifact');
      });
      break;
    case 'any':
      builder.or(b => {
        b.oracleText('destroy target permanent');
        b.oracleText('exile target permanent');
      });
      break;
  }
  
  if (colors) builder.color(colors, '<=');
  if (maxManaValue) builder.manaValue(maxManaValue, '<=');
  
  return builder.build();
}

// Usage:
// const query = findRemovalSpells('creature', 'wb', { maxManaValue: 3 });

/**
 * Example 5: Card Advantage Engine Finder
 */
function findCardAdvantage(type, colors, options = {}) {
  const {
    format = 'commander',
    repeatable = true
  } = options;
  
  const builder = new ScryfallQueryBuilder();
  
  builder.format(format);
  
  if (type) builder.type(type);
  if (colors) builder.colorIdentity(colors, '<=');
  
  if (repeatable) {
    builder.or(b => {
      b.oracleText('whenever').oracleText('draw');
      b.oracleText('at the beginning').oracleText('draw');
    });
  } else {
    builder.oracleText('draw a card');
  }
  
  return builder.build();
}

// Usage:
// const query = findCardAdvantage('enchantment', 'ub', { repeatable: true });

/**
 * Example 6: Batch Query Generator
 */
function generateBatchQueries(count, category = 'all') {
  const generator = new RandomQueryGenerator();
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const query = generator.generate();
    if (query) {
      results.push({
        query,
        url: `https://scryfall.com/search?q=${encodeURIComponent(query.replace(/\+/g, ' '))}`
      });
    }
  }
  
  return results;
}

// Usage:
// const queries = generateBatchQueries(10);

/**
 * Example 7: Query Preset System
 */
const QueryPresets = {
  'budget-creatures': {
    description: 'Affordable creatures for budget decks',
    build: () => new ScryfallQueryBuilder()
      .type('creature')
      .priceUsd(0.50, '<')
      .rarity('rare', '>=')
      .build()
  },
  'commander-staples': {
    description: 'Common Commander format staples',
    build: () => new ScryfallQueryBuilder()
      .format('commander')
      .or(b => {
        b.oracleText('Sol Ring');
        b.oracleText('Command Tower');
        b.oracleText('Arcane Signet');
      })
      .build()
  },
  'modern-instants': {
    description: 'Popular Modern format instants',
    build: () => new ScryfallQueryBuilder()
      .type('instant')
      .format('modern')
      .manaValue(2, '<=')
      .rarity('uncommon', '>=')
      .build()
  },
  'evasive-threats': {
    description: 'Creatures that are hard to block',
    build: () => new ScryfallQueryBuilder()
      .type('creature')
      .or(b => {
        b.keyword('flying');
        b.keyword('menace');
        b.oracleText("can't be blocked");
      })
      .power(3, '>=')
      .build()
  }
};

function getPreset(name) {
  const preset = QueryPresets[name];
  if (!preset) {
    return { error: `Preset '${name}' not found` };
  }
  return {
    description: preset.description,
    query: preset.build()
  };
}

// Usage:
// const preset = getPreset('budget-creatures');

/**
 * Example 8: Query Builder Chain Helper
 */
function buildQueryFromOptions(options) {
  const builder = new ScryfallQueryBuilder();
  
  // Map options to builder methods
  const methodMap = {
    type: 'type',
    color: 'color',
    colorIdentity: 'colorIdentity',
    manaValue: 'manaValue',
    power: 'power',
    toughness: 'toughness',
    rarity: 'rarity',
    format: 'format',
    keyword: 'keyword',
    oracleText: 'oracleText',
    set: 'set',
    priceUsd: 'priceUsd'
  };
  
  for (const [key, value] of Object.entries(options)) {
    if (methodMap[key] && value !== undefined && value !== null && value !== '') {
      const method = methodMap[key];
      
      if (typeof value === 'object' && value.value !== undefined) {
        // Object with value and operator
        builder[method](value.value, value.operator || '=');
      } else {
        // Simple value
        builder[method](value);
      }
    }
  }
  
  return builder;
}

// Usage:
// const builder = buildQueryFromOptions({
//   type: 'creature',
//   manaValue: { value: 3, operator: '<=' },
//   format: 'modern',
//   keyword: 'flying'
// });
// const query = builder.build();

/**
 * Example 9: Search Result Handler
 */
async function searchScryfall(query) {
  const builder = new ScryfallQueryBuilder();
  builder.raw(query);
  
  const apiUrl = builder.toApiUrl();
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.object === 'error') {
      return { error: data.details };
    }
    
    return {
      total: data.total_cards,
      cards: data.data.map(card => ({
        name: card.name,
        manaCost: card.mana_cost,
        type: card.type_line,
        oracleText: card.oracle_text,
        image: card.image_uris?.normal
      }))
    };
  } catch (error) {
    return { error: error.message };
  }
}

// Usage (in async context):
// const results = await searchScryfall('t:creature c=r mv<=3');

/**
 * Example 10: Export Queries for External Use
 */
function exportQueries(queries, format = 'json') {
  switch (format) {
    case 'json':
      return JSON.stringify(queries, null, 2);
      
    case 'txt':
      return queries.map(q => q.query || q).join('\n');
      
    case 'csv':
      const headers = 'Query,Category,Timestamp\n';
      const rows = queries.map(q => 
        `"${q.query}","${q.category || 'custom'}","${q.timestamp || Date.now()}"`
      ).join('\n');
      return headers + rows;
      
    case 'lua':
      const luaQueries = queries.map(q => `  "${q.query || q}"`).join(',\n');
      return `local queries = {\n${luaQueries}\n}`;
      
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

// Usage:
// const exported = exportQueries([
//   { query: 't:creature', category: 'creatures' },
//   { query: 't:instant', category: 'spells' }
// ], 'csv');

// Export for Node.js (if applicable)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildCommanderQuery,
    buildBudgetQuery,
    buildTribalQuery,
    findRemovalSpells,
    findCardAdvantage,
    generateBatchQueries,
    QueryPresets,
    getPreset,
    buildQueryFromOptions,
    searchScryfall,
    exportQueries
  };
}
