# Scryfall Query Generator - API Documentation

This document provides comprehensive API documentation for the Scryfall Query Generator web application.

## Table of Contents

- [ScryfallQueryBuilder Class](#scryfallquerybuilder-class)
- [Query Methods](#query-methods)
- [URL Generation](#url-generation)
- [Utility Methods](#utility-methods)
- [Web App API](#web-app-api)
- [Events](#events)
- [Local Storage](#local-storage)

---

## ScryfallQueryBuilder Class

The core class for building Scryfall search queries programmatically.

### Constructor

```javascript
const builder = new ScryfallQueryBuilder();
```

Creates a new query builder instance with an empty query.

---

## Query Methods

All query methods return `this` for method chaining.

### Card Name & Text

| Method | Parameters | Description | Example Output |
|--------|------------|-------------|----------------|
| `name(name)` | `string` | Search by partial name | `name:Lightning` |
| `exactName(name)` | `string` | Search by exact name | `!"Lightning Bolt"` |
| `oracleText(text)` | `string` | Search rules text | `o:"draw a card"` |
| `flavorText(text)` | `string` | Search flavor text | `ft:doom` |

### Type & Color

| Method | Parameters | Description | Example Output |
|--------|------------|-------------|----------------|
| `type(type)` | `string` | Card type | `t:creature` |
| `color(colors, operator?)` | `string, string` | Card color | `c=ub` |
| `colorIdentity(colors, operator?)` | `string, string` | Color identity | `id<=wubrg` |

### Mana & Stats

| Method | Parameters | Description | Example Output |
|--------|------------|-------------|----------------|
| `manaCost(cost, operator?)` | `string, string` | Mana cost | `m={2}{U}{U}` |
| `manaValue(value, operator?)` | `number, string` | Mana value (CMC) | `mv<=3` |
| `power(power, operator?)` | `number, string` | Power | `pow>=4` |
| `toughness(toughness, operator?)` | `number, string` | Toughness | `tou<=5` |

### Rarity & Set

| Method | Parameters | Description | Example Output |
|--------|------------|-------------|----------------|
| `rarity(rarity, operator?)` | `string, string` | Rarity level | `r>=rare` |
| `set(code)` | `string` | Set code | `s:dom` |

### Format & Legality

| Method | Parameters | Description | Example Output |
|--------|------------|-------------|----------------|
| `format(format)` | `string` | Format legality | `f:commander` |
| `banned(format)` | `string` | Banned cards | `banned:legacy` |
| `restricted(format)` | `string` | Restricted cards | `restricted:vintage` |

### Additional Filters

| Method | Parameters | Description | Example Output |
|--------|------------|-------------|----------------|
| `artist(name)` | `string` | Artist name | `a:"John Avon"` |
| `watermark(name)` | `string` | Watermark | `wm:orzhov` |
| `language(code)` | `string` | Language | `lang:ja` |
| `frame(type)` | `string` | Frame style | `frame:2015` |
| `border(color)` | `string` | Border color | `border:borderless` |
| `keyword(keyword)` | `string` | Keyword | `keyword:flying` |
| `produces(colors)` | `string` | Mana production | `produces:g` |

### Price Filters

| Method | Parameters | Description | Example Output |
|--------|------------|-------------|----------------|
| `priceUsd(price, operator?)` | `number, string` | USD price | `usd<10` |
| `priceEur(price, operator?)` | `number, string` | EUR price | `eur<=5` |
| `priceTix(price, operator?)` | `number, string` | TIX price | `tix>2` |

### Special Filters

| Method | Parameters | Description | Example Output |
|--------|------------|-------------|----------------|
| `is(property)` | `string` | Is property | `is:commander` |
| `not(property)` | `string` | Not property | `-is:reprint` |
| `raw(query)` | `string` | Raw query text | `game:paper` |

### Grouping

| Method | Parameters | Description |
|--------|------------|-------------|
| `or(callback)` | `function` | OR group |
| `and(callback)` | `function` | AND group |
| `negate(callback)` | `function` | Negated group |

Example:
```javascript
builder.or(b => b.type('creature').type('planeswalker'));
// Output: (t:creature or t:planeswalker)
```

---

## URL Generation

### build()

Returns the query string.

```javascript
const query = builder.type('creature').color('r').build();
// Returns: "t:creature c=r"
```

### toUrl()

Returns the complete Scryfall search URL.

```javascript
const url = builder.type('creature').toUrl();
// Returns: "https://scryfall.com/search?q=t%3Acreature"
```

### toApiUrl()

Returns the Scryfall API URL.

```javascript
const apiUrl = builder.type('creature').toApiUrl();
// Returns: "https://api.scryfall.com/cards/search?q=t%3Acreature"
```

---

## Utility Methods

### reset()

Clears all query parts and returns `this`.

```javascript
builder.type('creature').reset();
// Query is now empty
```

### clone()

Creates a copy of the current builder.

```javascript
const original = builder.type('creature');
const copy = original.clone();
copy.color('r');
// original: "t:creature"
// copy: "t:creature c=r"
```

---

## Web App API

The web app exposes several global functions for interacting with the application.

### copyToClipboard(text)

Copies text to the clipboard and shows a notification.

```javascript
copyToClipboard('t:creature c=r');
```

### addToHistory(query, category)

Adds a query to the history.

```javascript
addToHistory('t:creature keyword:flying', 'custom');
```

### removeFromHistory(index)

Removes a query from history by index.

```javascript
removeFromHistory(0); // Removes first item
```

### showNotification(message, isError?)

Shows a toast notification.

```javascript
showNotification('Query saved!');
showNotification('Error occurred', true);
```

---

## Events

The web app uses standard DOM events for interactivity.

### Form Events

- `input` - Updates query in real-time
- `change` - Updates query on field change

### Custom Events

Currently, the app doesn't dispatch custom events, but this can be added for integration:

```javascript
// Example of adding custom event dispatch
window.dispatchEvent(new CustomEvent('queryGenerated', {
  detail: { query: builder.build() }
}));
```

---

## Local Storage

The app stores data in `localStorage` for persistence.

### scryfallQueryHistory

Stores the query history as a JSON array.

```javascript
// Structure
[
  {
    "query": "t:creature keyword:flying",
    "category": "builder",
    "timestamp": 1699999999999
  }
]
```

### Reading History

```javascript
const history = JSON.parse(localStorage.getItem('scryfallQueryHistory') || '[]');
```

### Clearing History

```javascript
localStorage.removeItem('scryfallQueryHistory');
```

---

## Example: Complete Query Building

```javascript
// Build a complex Commander search
const query = new ScryfallQueryBuilder()
  .type('creature')
  .type('legendary')
  .colorIdentity('wubrg', '<=')
  .format('commander')
  .manaValue(5, '<=')
  .keyword('flying')
  .rarity('rare', '>=')
  .priceUsd(10, '<')
  .not('reprint')
  .build();

// Result: "t:creature t:legendary id<=wubrg f:commander mv<=5 keyword:flying r>=rare usd<10 -is:reprint"

// Get the Scryfall URL
const url = builder.toUrl();
// Opens: https://scryfall.com/search?q=...
```

---

## Operators

All comparison methods accept these operators:

| Operator | Description |
|----------|-------------|
| `=` | Equals (default) |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal |
| `>=` | Greater than or equal |

---

## Error Handling

The builder handles edge cases gracefully:

- Empty/null values are ignored
- Whitespace is trimmed
- Multi-word values are automatically quoted
- Invalid inputs don't break the chain

```javascript
builder
  .name('')       // Ignored
  .name(null)     // Ignored
  .type('  ')     // Ignored (whitespace only)
  .color('r')     // Added
  .build();
// Returns: "c=r"
```
