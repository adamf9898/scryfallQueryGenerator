# Scryfall Query Generator - Web App

A web-based interface for building [Scryfall](https://scryfall.com) search queries for Magic: The Gathering cards.

## Overview

This web application provides a user-friendly form interface to construct complex Scryfall search queries without needing to memorize the search syntax. Simply fill in the fields you want to search by, and the app will generate the query for you.

## Features

- **Visual Query Builder**: Build queries using intuitive form controls
- **Real-time Preview**: See your query update as you make changes
- **Color Selection**: Easy-to-use color picker with MTG color symbols
- **Keyword Tags**: Click-to-select interface for common keywords
- **Advanced Options**: Access less common filters like frame, border, and price
- **One-Click Search**: Open your search directly on Scryfall
- **Copy to Clipboard**: Easily copy the query or URL

## Usage

### Running Locally

Simply open `index.html` in a web browser. The app is entirely client-side and requires no server or build process.

```bash
# Option 1: Open directly in browser
open generator/index.html

# Option 2: Use a simple HTTP server (recommended for best compatibility)
cd generator
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

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

### Example Searches

#### Find cheap Commander creatures
- Type: Creature
- Color Identity: Select all colors, Operator: <=
- Format: Commander
- Mana Value: 4, Operator: <=
- Rarity: Rare, Operator: >=

**Generated Query**: `t:creature id<=wubrg f:commander mv<=4 r>=rare`

#### Find instants that draw cards
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
| `app.js` | JavaScript code including the ScryfallQueryBuilder class |
| `config.json` | Configuration file with card types, colors, formats, etc. |
| `README.md` | This documentation file |

## Configuration

The `config.json` file contains all the options displayed in the form:

- **colors**: MTG color codes and names
- **types**: Card types (Creature, Instant, etc.)
- **formats**: Game formats (Standard, Modern, Commander, etc.)
- **rarities**: Rarity levels with codes and names
- **operators**: Comparison operators (=, <, >, <=, >=)
- **keywords**: Common MTG keywords (Flying, Trample, etc.)
- **isFilters**: Properties for "is:" filters
- **borders**: Border color options
- **frames**: Frame style options

## Browser Compatibility

This web app works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Related

- [Scryfall Query Generator (npm package)](../README.md) - The JavaScript library this web app is based on
- [Scryfall Search Syntax](https://scryfall.com/docs/syntax) - Official documentation for Scryfall's search syntax

## License

MIT
