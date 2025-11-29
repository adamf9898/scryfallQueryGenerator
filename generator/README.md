# Scryfall Query Generator - Web App

A modern, feature-rich web application for building [Scryfall](https://scryfall.com) search queries for Magic: The Gathering cards.

## Features

### 🔧 Query Builder
- **Visual Query Builder**: Build queries using intuitive form controls
- **Real-time Preview**: See your query update as you make changes
- **Color Selection**: Easy-to-use color picker with MTG color symbols
- **Keyword Tags**: Click-to-select interface for common keywords
- **Advanced Options**: Access less common filters like frame, border, and price
- **One-Click Search**: Open your search directly on Scryfall
- **Copy to Clipboard**: Easily copy the query or URL

### 🎲 Random Query Generator
- **500+ Curated Queries**: Pre-built queries across 20 categories
- **Category Filtering**: Generate queries from specific categories
- **Batch Generation**: Generate multiple queries at once
- **Quick Actions**: Search, copy, or save queries instantly

### 📦 Card Data Management (NEW!)
- **Bulk Data Sync**: Download Scryfall's complete MTG card database
- **Multiple Dataset Types**: Support for Oracle Cards, Default Cards, and All Cards
- **Local Storage**: Store card data in browser for offline access
- **Version Control**: Track data freshness with timestamps
- **Incremental Updates**: Only download when new data is available

### 🔍 Local Search Index (NEW!)
- **Fast Local Search**: Query your downloaded card data instantly
- **Full-Text Search**: Search across oracle text and card names
- **Structured Filters**: Filter by type, color, format, mana value, and more
- **Indexed Performance**: Pre-built inverted index for fast queries

### 🃏 Deck Configuration Generator (NEW!)
- **Multiple Formats**: Support for Standard, Modern, Commander, and more
- **Smart Constraints**: Specify lands, colors, mana curve limits
- **Batch Generation**: Generate multiple deck configurations at once
- **Export Options**: Copy deck lists or export to file
- **Mana Curve Display**: Visual representation of deck curve

### 📜 Query History
- **Persistent Storage**: Queries saved in browser localStorage
- **Quick Access**: Re-use your favorite queries
- **Export Support**: Download history as JSON
- **Easy Management**: Delete individual queries or clear all

### 📱 Progressive Web App
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Works without internet connection
- **Fast Loading**: Service worker caching for instant loads

## Quick Start

### Running Locally

Simply open `index.html` in a web browser. The app is entirely client-side and requires no server or build process.

```bash
# Option 1: Open directly in browser
open generator/index.html

# Option 2: Use a simple HTTP server (recommended for best compatibility)
cd generator
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser

# Option 3: Use Node.js
npx http-server generator -p 8000
```

## Usage Guide

### Building a Query

1. **Card Name & Text**: Search by card name, oracle text, or flavor text
2. **Type & Color**: Filter by card type and colors
3. **Mana & Stats**: Specify mana value, power, and toughness with comparison operators
4. **Rarity & Set**: Filter by rarity level and specific set codes
5. **Format**: Filter by format legality (Standard, Modern, Commander, etc.)
6. **Advanced Options**: Access additional filters like artist, frame, border, and price
7. **Keywords**: Click on keyword tags to add them to your search
8. **Card Properties**: Filter by special properties using "is:" filters
9. **Raw Query**: Add any custom Scryfall syntax not covered by the form

### Using Random Queries

1. Switch to the **Random Queries** tab
2. Select a category or leave as "All Categories"
3. Click **Generate Random Query** for a single query
4. Click **Generate 5 Queries** for multiple options
5. Use the action buttons to search, copy, or save

### Managing Card Data

1. Switch to the **Card Data** tab
2. Select your preferred dataset type:
   - **Oracle Cards**: Unique cards only (recommended for most uses)
   - **Default Cards**: One card per printing
   - **All Cards**: All variations and printings
3. Click **Sync Data** to download the latest data
4. Click **Build Index** to create the search index
5. Use the **Search Local Data** section to query your data

### Generating Deck Configurations

1. Switch to the **Deck Builder** tab
2. Select your desired format (Standard, Modern, Commander, etc.)
3. Configure constraints:
   - **Color Identity**: Limit colors (optional)
   - **Max Mana Value**: Limit curve
   - **Land Range**: Specify min/max lands
   - **Must Include**: Cards that must be in the deck
4. Click **Generate Decks** to create deck configurations
5. Use **Copy List** or **Export** to save your deck

### Managing History

1. Switch to the **History** tab
2. Click on any saved query to search or copy
3. Use **Export History** to download as JSON
4. Use **Clear History** to remove all saved queries

## Example Searches

### Find cheap Commander creatures
- Type: Creature
- Color Identity: Select all colors, Operator: <=
- Format: Commander
- Mana Value: 4, Operator: <=
- Rarity: Rare, Operator: >=

**Generated Query**: `t:creature id<=wubrg f:commander mv<=4 r>=rare`

### Find instants that draw cards
- Type: Instant
- Oracle Text: "draw a card"
- Mana Value: 2, Operator: <=
- Format: Modern

**Generated Query**: `t:instant o:"draw a card" mv<=2 f:modern`

## Files

| File | Description |
|------|-------------|
| `index.html` | Main HTML page with the form interface |
| `styles.css` | CSS styles for the web app |
| `app.js` | Main JavaScript code including the ScryfallQueryBuilder class |
| `bulk-data.js` | Module for downloading and managing Scryfall bulk data |
| `card-normalizer.js` | Module for parsing and normalizing card data |
| `card-search-index.js` | Search index with structured and full-text query support |
| `deck-generator.js` | Combinatorial deck configuration generator |
| `config.json` | Configuration file with card types, colors, formats, etc. |
| `queries.json` | Database of 500+ pre-built queries across 20 categories |
| `manifest.json` | PWA manifest for app installation |
| `sw.js` | Service worker for offline functionality |
| `CHANGELOG.md` | Version history and roadmap |
| `docs/API.md` | API documentation |
| `docs/DEPLOYMENT.md` | Deployment guide |
| `docs/SCRYFALL-SYNTAX.md` | Complete Scryfall syntax reference |
| `examples/lua-integration.lua` | Tabletop Simulator integration example |
| `examples/advanced-queries.js` | Advanced JavaScript query examples |

## Configuration

### config.json

Contains all the options displayed in the form:

- **colors**: MTG color codes and names
- **types**: Card types (Creature, Instant, etc.)
- **formats**: Game formats (Standard, Modern, Commander, etc.)
- **rarities**: Rarity levels with codes and names
- **operators**: Comparison operators (=, <, >, <=, >=)
- **keywords**: Common MTG keywords (Flying, Trample, etc.)
- **isFilters**: Properties for "is:" filters
- **borders**: Border color options
- **frames**: Frame style options

### queries.json

Contains pre-built queries organized by category:

- **creatures**: Creature-focused queries
- **spells**: Instant and sorcery queries
- **artifacts**: Artifact queries
- **enchantments**: Enchantment queries
- **lands**: Land queries
- **planeswalkers**: Planeswalker queries
- **commander**: Commander format queries
- **formats**: Format-specific queries
- **removal**: Removal spell queries
- **card_advantage**: Card draw queries
- **mana**: Mana production queries
- **tribal**: Tribal deck queries
- **budget**: Price-filtered queries
- **competitive**: Competitive format queries
- **tokens**: Token generation queries
- **counters**: Counter-related queries
- **graveyard**: Graveyard strategy queries
- **life_gain**: Life gain queries
- **protection**: Protection ability queries
- **interaction**: Interactive spell queries

## API Reference

### BulkDataManager

Manages downloading and storing Scryfall bulk card data.

```javascript
const manager = new BulkDataManager({
  datasetType: 'oracle_cards',
  onProgress: (progress) => console.log(progress)
});

// Sync data
await manager.syncBulkData({ forceRefresh: false });

// Get status
const status = manager.getBulkStatus();

// Get stored data
const cards = manager.getStoredData();
```

### CardNormalizer

Parses and normalizes card data.

```javascript
const normalizer = new CardNormalizer();

// Process cards
const normalizedCards = normalizer.processCards(rawCards);

// Get deduplicated cards (one per oracle_id)
const uniqueCards = normalizer.getDeduplicatedCards();

// Get statistics
const stats = normalizer.getStats();
```

### CardSearchIndex

Provides fast searching over normalized card data.

```javascript
const index = new CardSearchIndex();

// Build index
index.buildIndex(normalizedCards);

// Search
const results = index.search({
  text: 'flying',
  type: 'creature',
  colors: 'u',
  colorOperator: '<=',
  format: 'modern',
  manaValue: 3,
  manaValueOperator: '<=',
  limit: 50
});
```

### DeckGenerator

Generates deck configurations based on constraints.

```javascript
const generator = new DeckGenerator(searchIndex);

// Generate decks
const result = generator.generateMultiple(
  { format: 'modern', colorIdentity: 'ub' },
  { 
    format: 'modern',
    colorIdentity: 'ub',
    maxManaValue: 4,
    minLands: 20,
    maxLands: 24
  },
  5 // number of decks
);

// Export deck
const deckText = generator.exportDeck(result.decks[0], 'text');
```

## Browser Compatibility

This web app works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Documentation

- [API Documentation](docs/API.md) - Detailed API reference
- [Deployment Guide](docs/DEPLOYMENT.md) - Hosting and deployment options
- [Scryfall Syntax Reference](docs/SCRYFALL-SYNTAX.md) - Complete search syntax guide
- [Changelog](CHANGELOG.md) - Version history and roadmap

## Examples

- [Lua Integration](examples/lua-integration.lua) - Tabletop Simulator integration
- [Advanced Queries](examples/advanced-queries.js) - JavaScript usage examples

## Related

- [Scryfall Query Generator (npm package)](../README.md) - The JavaScript library this web app is based on
- [Scryfall Search Syntax](https://scryfall.com/docs/syntax) - Official documentation for Scryfall's search syntax

## License

MIT
