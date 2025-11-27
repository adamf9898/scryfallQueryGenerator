# Scryfall Query Generator

A fluent JavaScript API for building [Scryfall](https://scryfall.com) search queries for Magic: The Gathering cards.

## Installation

```bash
npm install scryfall-query-generator
```

## Usage

### Query Builder

```javascript
const { ScryfallQueryBuilder } = require('scryfall-query-generator');

// Create a new query builder
const query = new ScryfallQueryBuilder()
  .type('creature')
  .color('r')
  .manaValue(3, '<=')
  .format('modern')
  .build();

// Output: "t:creature c=r mv<=3 f:modern"
console.log(query);

// Get the Scryfall search URL
const url = new ScryfallQueryBuilder()
  .type('instant')
  .oracleText('draw a card')
  .toUrl();

// Output: "https://scryfall.com/search?q=t%3Ainstant%20o%3A%22draw%20a%20card%22"
console.log(url);
```

### Random Query Generator

Generate unique Scryfall search queries programmatically:

```javascript
const { RandomQueryGenerator } = require('scryfall-query-generator');

// Create a random query generator
const generator = new RandomQueryGenerator();

// Generate a single unique query
const query = generator.generate();
// Output: "t:creature+c=r+mv<=3+f:modern"
console.log(query);

// Generate multiple unique queries
const queries = generator.generateMultiple(10);
queries.forEach((q, i) => {
  console.log(`${i + 1}. ${q}`);
});

// Use with Scryfall URL
const url = `https://scryfall.com/search?q=${query}`;
console.log(url);

// Reset the generator to allow duplicate queries
generator.reset();
```

**Features:**
- Generates unique Scryfall search queries
- Uses '+' instead of spaces (URL-friendly format)
- Does not include card names
- Tracks generated queries to ensure uniqueness
- Configurable options for query generation

## API Reference

### Card Name & Text

| Method | Description | Example |
|--------|-------------|---------|
| `name(name)` | Search by name (partial match) | `name("Lightning")` → `name:Lightning` |
| `exactName(name)` | Search for exact name | `exactName("Lightning Bolt")` → `!"Lightning Bolt"` |
| `oracleText(text)` | Search in rules text | `oracleText("draw a card")` → `o:"draw a card"` |
| `flavorText(text)` | Search in flavor text | `flavorText("doom")` → `ft:doom` |

### Type & Color

| Method | Description | Example |
|--------|-------------|---------|
| `type(type)` | Search by card type | `type("creature")` → `t:creature` |
| `color(colors, operator)` | Search by color | `color("ub")` → `c=ub` |
| `colorIdentity(colors, operator)` | Search by color identity | `colorIdentity("wubrg", "<=")` → `id<=wubrg` |

### Mana & Stats

| Method | Description | Example |
|--------|-------------|---------|
| `manaCost(cost, operator)` | Search by mana cost | `manaCost("{2}{U}")` → `m={2}{U}` |
| `manaValue(value, operator)` | Search by mana value (CMC) | `manaValue(3, "<=")` → `mv<=3` |
| `power(power, operator)` | Search by power | `power(4, ">")` → `pow>4` |
| `toughness(toughness, operator)` | Search by toughness | `toughness(3)` → `tou=3` |

### Rarity & Sets

| Method | Description | Example |
|--------|-------------|---------|
| `rarity(rarity, operator)` | Search by rarity | `rarity("mythic")` → `r=mythic` |
| `set(set)` | Search by set code | `set("dom")` → `s:dom` |

### Format Legality

| Method | Description | Example |
|--------|-------------|---------|
| `format(format)` | Search by format legality | `format("commander")` → `f:commander` |
| `banned(format)` | Search for banned cards | `banned("legacy")` → `banned:legacy` |
| `restricted(format)` | Search for restricted cards | `restricted("vintage")` → `restricted:vintage` |

### Additional Filters

| Method | Description | Example |
|--------|-------------|---------|
| `artist(artist)` | Search by artist | `artist("John Avon")` → `a:"John Avon"` |
| `watermark(watermark)` | Search by watermark | `watermark("orzhov")` → `wm:orzhov` |
| `language(lang)` | Search by language | `language("ja")` → `lang:ja` |
| `frame(frame)` | Search by frame type | `frame("2015")` → `frame:2015` |
| `border(border)` | Search by border color | `border("borderless")` → `border:borderless` |
| `keyword(keyword)` | Search by keyword | `keyword("flying")` → `keyword:flying` |
| `produces(colors)` | Search for mana producers | `produces("g")` → `produces:g` |

### Price Filters

| Method | Description | Example |
|--------|-------------|---------|
| `priceUsd(price, operator)` | Search by USD price | `priceUsd(10, "<")` → `usd<10` |
| `priceEur(price, operator)` | Search by EUR price | `priceEur(5)` → `eur=5` |
| `priceTix(price, operator)` | Search by TIX price | `priceTix(2, ">")` → `tix>2` |

### Special Filters

| Method | Description | Example |
|--------|-------------|---------|
| `is(property)` | Filter by property | `is("commander")` → `is:commander` |
| `not(property)` | Exclude by property | `not("reprint")` → `-is:reprint` |
| `raw(query)` | Add raw query text | `raw("game:paper")` → `game:paper` |

### Grouping

| Method | Description | Example |
|--------|-------------|---------|
| `or(callback)` | Create OR group | `or(b => b.type("creature").type("planeswalker"))` → `(t:creature or t:planeswalker)` |
| `and(callback)` | Create AND group | `and(b => b.type("land").color("r"))` → `(t:land c=r)` |
| `negate(callback)` | Negate a group | `negate(b => b.type("land"))` → `-(t:land)` |

### Output Methods

| Method | Description |
|--------|-------------|
| `build()` | Returns the query string |
| `toUrl()` | Returns the Scryfall search URL |
| `toApiUrl()` | Returns the Scryfall API URL |

### Utility Methods

| Method | Description |
|--------|-------------|
| `reset()` | Clears all query parts |
| `clone()` | Creates a copy of the builder |

## Examples

### Find cheap Commander creatures

```javascript
const query = new ScryfallQueryBuilder()
  .type('creature')
  .colorIdentity('wubrg', '<=')
  .format('commander')
  .manaValue(4, '<=')
  .rarity('rare', '>=')
  .build();
// "t:creature id<=wubrg f:commander mv<=4 r>=rare"
```

### Find instants that draw cards

```javascript
const query = new ScryfallQueryBuilder()
  .type('instant')
  .oracleText('draw a card')
  .manaValue(2, '<=')
  .format('modern')
  .build();
// "t:instant o:\"draw a card\" mv<=2 f:modern"
```

### Find non-basic dual lands

```javascript
const query = new ScryfallQueryBuilder()
  .type('land')
  .oracleText('plains')
  .oracleText('island')
  .not('basic')
  .build();
// "t:land o:plains o:island -is:basic"
```

### Using OR conditions

```javascript
const query = new ScryfallQueryBuilder()
  .format('standard')
  .or(b => b.type('creature').type('planeswalker'))
  .color('u')
  .build();
// "f:standard (t:creature or t:planeswalker) c=u"
```

## Comparison Operators

Many methods accept an optional operator parameter:
- `=` (default): equals
- `<`: less than
- `>`: greater than
- `<=`: less than or equal
- `>=`: greater than or equal

## License

MIT
